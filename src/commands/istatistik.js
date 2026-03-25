import { SlashCommandBuilder } from 'discord.js';
import { StatsModel } from '../database/models/stats.js';
import { TagModel } from '../database/models/tag.js';
import { MemberModel } from '../database/models/member.js';
import { GuildModel } from '../database/models/guild.js';
import { StreakModel } from '../database/models/streak.js';
import { createInfoEmbed, generateProgressBar } from '../utils/embeds.js';
import { formatRelative } from '../utils/time.js';
import { t } from '../locales/index.js';

export const data = new SlashCommandBuilder()
  .setName('istatistik')
  .setDescription('Tag sistemi istatistiklerini gösterir.');

export async function execute(interaction) {
  const guildId = interaction.guildId;

  const stats = StatsModel.findByGuild(guildId);
  const tags = TagModel.findByGuild(guildId);
  const config = GuildModel.findById(guildId);
  const tagged = MemberModel.getTaggedCount(guildId);
  const untagged = MemberModel.getUntaggedCount(guildId);
  const total = tagged + untagged;
  const percent = total > 0 ? Math.round((tagged / total) * 100) : 0;

  const topStreak = StreakModel.getTopStreaks(guildId, 1);

  const tagList = tags.length > 0
    ? tags.map(tg => `\`${tg.tag_name}\` → <@&${tg.role_id}>`).join('\n')
    : t(guildId, 'cmd.stats.tags.none');

  const lastCheck = stats.last_check
    ? formatRelative(new Date(stats.last_check + 'Z').getTime())
    : t(guildId, 'cmd.stats.lastcheck.none');

  // Requirements info
  let reqInfo = t(guildId, 'cmd.stats.req.none');
  if (config?.min_account_age > 0 || config?.min_server_time > 0) {
    const parts = [];
    if (config.min_account_age > 0) parts.push(t(guildId, 'cmd.stats.req.account', { days: Math.round(config.min_account_age / 24) }));
    if (config.min_server_time > 0) parts.push(t(guildId, 'cmd.stats.req.server', { days: Math.round(config.min_server_time / 24) }));
    reqInfo = parts.join('\n');
  }

  const fields = [
    { name: t(guildId, 'cmd.stats.total'), value: `${total}`, inline: true },
    { name: t(guildId, 'cmd.stats.tagged'), value: `${tagged}`, inline: true },
    { name: t(guildId, 'cmd.stats.untagged'), value: `${untagged}`, inline: true },
    { name: t(guildId, 'cmd.stats.checks'), value: `${stats.total_checks}`, inline: true },
    { name: t(guildId, 'cmd.stats.added'), value: `${stats.roles_added}`, inline: true },
    { name: t(guildId, 'cmd.stats.removed'), value: `${stats.roles_removed}`, inline: true },
    { name: t(guildId, 'cmd.stats.interval'), value: t(guildId, 'cmd.stats.interval.val', { min: (config?.check_interval || 300) / 60 }), inline: true },
    { name: t(guildId, 'cmd.stats.lastcheck'), value: lastCheck, inline: true },
    { name: t(guildId, 'cmd.stats.tags'), value: tagList, inline: false },
    { name: t(guildId, 'cmd.stats.requirements'), value: reqInfo, inline: false },
    { name: t(guildId, 'cmd.stats.ratio'), value: `\`\`\`\n${generateProgressBar(percent)} ${percent}%\n\`\`\``, inline: false },
  ];

  if (topStreak.length > 0) {
    fields.push({
      name: `\uD83D\uDD25 Top Streak`,
      value: `<@${topStreak[0].user_id}> — **${topStreak[0].days}** ${t(guildId, 'cmd.streak.days', { days: topStreak[0].days })}`,
      inline: false,
    });
  }

  await interaction.reply({
    embeds: [createInfoEmbed(
      t(guildId, 'cmd.stats.title'),
      t(guildId, 'cmd.stats.desc'),
      fields
    )],
  });
}
