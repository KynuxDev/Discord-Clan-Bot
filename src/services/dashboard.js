import { EmbedBuilder } from 'discord.js';
import { GuildModel } from '../database/models/guild.js';
import { TagModel } from '../database/models/tag.js';
import { MemberModel } from '../database/models/member.js';
import { StatsModel } from '../database/models/stats.js';
import { StreakModel } from '../database/models/streak.js';
import { COLORS } from '../utils/constants.js';
import { generateProgressBar } from '../utils/embeds.js';
import { formatRelative } from '../utils/time.js';
import { t } from '../locales/index.js';

export async function updateDashboard(client, guildId) {
  const config = GuildModel.findById(guildId);
  if (!config?.dashboard_channel_id) return;

  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;

  const channel = guild.channels.cache.get(config.dashboard_channel_id);
  if (!channel) return;

  const embed = createDashboardEmbed(guildId);

  try {
    if (config.dashboard_message_id) {
      const message = await channel.messages.fetch(config.dashboard_message_id).catch(() => null);
      if (message) {
        await message.edit({ embeds: [embed] });
        return;
      }
    }

    const sent = await channel.send({ embeds: [embed] });
    GuildModel.updateDashboardMessage(guildId, sent.id);
  } catch (error) {
    console.error(`[Dashboard] ${guildId} güncelleme hatası:`, error.message);
  }
}

function createDashboardEmbed(guildId) {
  const config = GuildModel.findById(guildId);
  const tags = TagModel.findByGuild(guildId);
  const stats = StatsModel.findByGuild(guildId);
  const tagged = MemberModel.getTaggedCount(guildId);
  const untagged = MemberModel.getUntaggedCount(guildId);
  const total = tagged + untagged;
  const percent = total > 0 ? Math.round((tagged / total) * 100) : 0;
  const topStreaks = StreakModel.getTopStreaks(guildId, 3);

  const tagList = tags.length > 0
    ? tags.map(tg => `\`${tg.tag_name}\` → <@&${tg.role_id}>`).join('\n')
    : t(guildId, 'cmd.stats.tags.none');

  const medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
  const streakList = topStreaks.length > 0
    ? topStreaks.map((s, i) => `${medals[i] || `${i + 1}.`} <@${s.user_id}> — **${s.days}** ${t(guildId, 'cmd.streak.days', { days: s.days })}`).join('\n')
    : t(guildId, 'dashboard.no_streaks');

  const lastCheck = stats.last_check
    ? formatRelative(new Date(stats.last_check + 'Z').getTime())
    : t(guildId, 'cmd.stats.lastcheck.none');

  return new EmbedBuilder()
    .setTitle(`\uD83D\uDCCA ${t(guildId, 'dashboard.title')}`)
    .setColor(COLORS.BRAND)
    .addFields(
      {
        name: t(guildId, 'dashboard.members'),
        value: `${t(guildId, 'cmd.stats.tagged')}: **${tagged}** | ${t(guildId, 'cmd.stats.untagged')}: **${untagged}**\n\`\`\`\n${generateProgressBar(percent)} ${percent}%\n\`\`\``,
        inline: false,
      },
      {
        name: `\uD83C\uDFF7\uFE0F ${t(guildId, 'dashboard.tags')}`,
        value: tagList,
        inline: false,
      },
      {
        name: `\uD83D\uDD25 ${t(guildId, 'dashboard.streaks')}`,
        value: streakList,
        inline: false,
      },
      {
        name: `\uD83D\uDCC8 ${t(guildId, 'dashboard.stats')}`,
        value: [
          `${t(guildId, 'dashboard.checks', { count: stats.total_checks })} | ${t(guildId, 'dashboard.role_adds', { count: stats.roles_added })}`,
          `${t(guildId, 'dashboard.last_check')}: ${lastCheck}`,
          `${t(guildId, 'dashboard.interval')}: ${(config?.check_interval || 300) / 60} min`,
        ].join('\n'),
        inline: false,
      },
    )
    .setTimestamp()
    .setFooter({ text: 'Clan Bot v2.1 — Auto-updating dashboard' });
}

export async function deleteDashboard(client, guildId) {
  const config = GuildModel.findById(guildId);
  if (!config?.dashboard_channel_id || !config?.dashboard_message_id) return;

  try {
    const guild = client.guilds.cache.get(guildId);
    if (guild) {
      const channel = guild.channels.cache.get(config.dashboard_channel_id);
      if (channel) {
        const message = await channel.messages.fetch(config.dashboard_message_id).catch(() => null);
        if (message) await message.delete().catch(() => {});
      }
    }
  } catch {
    // ignore
  }

  GuildModel.updateDashboardChannel(guildId, null);
  GuildModel.updateDashboardMessage(guildId, null);
}
