import { Routes } from 'discord.js';
import { TagModel } from '../database/models/tag.js';
import { MemberModel } from '../database/models/member.js';
import { TagHistoryModel } from '../database/models/tagHistory.js';
import { StatsModel } from '../database/models/stats.js';
import { StreakModel } from '../database/models/streak.js';
import { GuildModel } from '../database/models/guild.js';
import { sendLog } from './logger.js';
import { updateDashboard } from './dashboard.js';
import { LIMITS } from '../utils/constants.js';
import { formatRelative } from '../utils/time.js';
import { t } from '../locales/index.js';

async function fetchUserClanTag(client, userId) {
  try {
    const userData = await client.rest.get(Routes.user(userId));
    return userData.clan?.tag || null;
  } catch (error) {
    if (error.status === 429) {
      const retryAfter = error.retry_after || 5000;
      await sleep(retryAfter);
      return fetchUserClanTag(client, userId);
    }
    console.error(`[TagChecker] User ${userId} tag fetch failed:`, error.message);
    return null;
  }
}

function meetsRequirements(member, config) {
  const now = Date.now();

  if (config.min_account_age > 0) {
    const accountAgeHours = (now - member.user.createdTimestamp) / 3600000;
    if (accountAgeHours < config.min_account_age) return false;
  }

  if (config.min_server_time > 0) {
    const serverTimeHours = (now - member.joinedTimestamp) / 3600000;
    if (serverTimeHours < config.min_server_time) return false;
  }

  return true;
}

export async function checkSingleMember(client, member, guildTags) {
  const guildId = member.guild.id;

  if (!guildTags) {
    guildTags = TagModel.findByGuild(guildId);
  }

  if (guildTags.length === 0) {
    return { hasTag: false, tagName: null, roleChanged: false, action: null };
  }

  const userTag = await fetchUserClanTag(client, member.id);
  const matchedTag = guildTags.find(tg => tg.tag_name === userTag);
  const result = { hasTag: false, tagName: userTag, roleChanged: false, action: null };

  if (matchedTag) {
    result.hasTag = true;

    const config = GuildModel.findById(guildId);
    if (!meetsRequirements(member, config || {})) {
      MemberModel.upsert(guildId, member.id, userTag, false);
      return result;
    }

    // Streak update
    StreakModel.startOrContinue(guildId, member.id, matchedTag.tag_name);

    if (!member.roles.cache.has(matchedTag.role_id)) {
      try {
        await member.roles.add(matchedTag.role_id);
        result.roleChanged = true;
        result.action = 'added';

        TagHistoryModel.record(guildId, member.id, matchedTag.tag_name, 'added');
        StatsModel.incrementRolesAdded(guildId);
        MemberModel.upsert(guildId, member.id, userTag, true);

        await sendLog(client, guildId, {
          type: 'success',
          title: t(guildId, 'tag.added'),
          description: t(guildId, 'tag.added.desc', {
            user: member.user.tag,
            tag: matchedTag.tag_name,
            role: `<@&${matchedTag.role_id}>`,
          }),
          thumbnail: member.user.displayAvatarURL({ dynamic: true }),
          fields: [
            { name: t(guildId, 'field.user'), value: `<@${member.id}>`, inline: true },
            { name: t(guildId, 'field.tag'), value: matchedTag.tag_name, inline: true },
            { name: t(guildId, 'field.time'), value: formatRelative(Date.now()), inline: true },
          ],
        });
      } catch (error) {
        console.error(`[TagChecker] Role add failed ${member.user.tag}:`, error.message);
      }
    } else {
      MemberModel.upsert(guildId, member.id, userTag, true);
    }
  } else {
    // Break streak
    StreakModel.breakStreak(guildId, member.id);

    for (const tag of guildTags) {
      if (member.roles.cache.has(tag.role_id)) {
        try {
          await member.roles.remove(tag.role_id);
          result.roleChanged = true;
          result.action = 'removed';

          TagHistoryModel.closeActiveEntries(guildId, member.id);
          StatsModel.incrementRolesRemoved(guildId);

          const descKey = userTag ? 'tag.removed.desc.different' : 'tag.removed.desc.none';

          await sendLog(client, guildId, {
            type: 'warning',
            title: t(guildId, 'tag.removed'),
            description: t(guildId, descKey, {
              user: member.user.tag,
              currentTag: userTag || '',
              role: `<@&${tag.role_id}>`,
            }),
            thumbnail: member.user.displayAvatarURL({ dynamic: true }),
            fields: [
              { name: t(guildId, 'field.user'), value: `<@${member.id}>`, inline: true },
              { name: t(guildId, 'field.time'), value: formatRelative(Date.now()), inline: true },
            ],
          });
        } catch (error) {
          console.error(`[TagChecker] Role remove failed ${member.user.tag}:`, error.message);
        }
      }
    }
    MemberModel.upsert(guildId, member.id, userTag, false);
  }

  return result;
}

export async function performBatchCheck(client, guild) {
  const guildId = guild.id;
  const guildTags = TagModel.findByGuild(guildId);

  if (guildTags.length === 0) return;

  console.log(`[TagChecker] ${guild.name} batch check starting...`);
  StatsModel.incrementChecks(guildId);

  try {
    await guild.members.fetch();
  } catch (error) {
    console.error(`[TagChecker] Member fetch failed ${guild.name}:`, error.message);
    return;
  }

  const members = guild.members.cache.filter(m => !m.user.bot);
  const memberArray = [...members.values()];
  let rolesChanged = 0;
  let tagged = 0;
  let untagged = 0;

  for (let i = 0; i < memberArray.length; i += LIMITS.BATCH_SIZE) {
    const batch = memberArray.slice(i, i + LIMITS.BATCH_SIZE);

    for (const member of batch) {
      const result = await checkSingleMember(client, member, guildTags);
      if (result.hasTag) tagged++;
      else untagged++;
      if (result.roleChanged) rolesChanged++;
    }

    if (i + LIMITS.BATCH_SIZE < memberArray.length) {
      await sleep(LIMITS.BATCH_DELAY_MS);
    }
  }

  if (rolesChanged > 0) {
    await sendLog(client, guildId, {
      type: 'info',
      title: t(guildId, 'batch.complete'),
      description: t(guildId, 'batch.complete.desc', { changed: rolesChanged }),
      fields: [
        { name: t(guildId, 'field.checked'), value: `${tagged + untagged}`, inline: true },
        { name: t(guildId, 'cmd.stats.tagged'), value: `${tagged}`, inline: true },
        { name: t(guildId, 'cmd.stats.untagged'), value: `${untagged}`, inline: true },
        { name: t(guildId, 'field.role_change'), value: `${rolesChanged}`, inline: true },
      ],
    });
  }

  // Update dashboard after batch check
  await updateDashboard(client, guildId).catch(err => {
    console.error(`[TagChecker] Dashboard update failed:`, err.message);
  });

  console.log(`[TagChecker] ${guild.name} done — Tagged: ${tagged}, Untagged: ${untagged}, Changed: ${rolesChanged}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
