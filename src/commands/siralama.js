import { SlashCommandBuilder } from 'discord.js';
import { TagHistoryModel } from '../database/models/tagHistory.js';
import { StreakModel } from '../database/models/streak.js';
import { createInfoEmbed } from '../utils/embeds.js';
import { formatDuration } from '../utils/time.js';
import { t } from '../locales/index.js';

export const data = new SlashCommandBuilder()
  .setName('siralama')
  .setDescription('Tag sıralamasını gösterir.')
  .addStringOption(opt =>
    opt.setName('tip')
      .setDescription('Sıralama tipi')
      .setRequired(false)
      .addChoices(
        { name: 'Tag Süresi', value: 'sure' },
        { name: 'Streak', value: 'streak' },
      )
  );

export async function execute(interaction) {
  const guildId = interaction.guildId;
  const type = interaction.options.getString('tip') || 'sure';

  if (type === 'streak') {
    return showStreakLeaderboard(interaction, guildId);
  }

  return showDurationLeaderboard(interaction, guildId);
}

async function showDurationLeaderboard(interaction, guildId) {
  const leaderboard = TagHistoryModel.getLeaderboard(guildId);

  if (leaderboard.length === 0) {
    return interaction.reply({
      embeds: [createInfoEmbed(
        t(guildId, 'cmd.leaderboard.title'),
        t(guildId, 'cmd.leaderboard.empty')
      )],
    });
  }

  const medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
  const list = leaderboard.map((entry, i) => {
    const prefix = medals[i] || `**${i + 1}.**`;
    const hours = entry.hours || 0;
    const duration = formatDuration(hours * 3600 * 1000);
    return `${prefix} <@${entry.user_id}> — \`${entry.tag_name}\` — ${duration}`;
  }).join('\n');

  await interaction.reply({
    embeds: [createInfoEmbed(
      t(guildId, 'cmd.leaderboard.title'),
      `${t(guildId, 'cmd.leaderboard.desc')}\n\n${list}`
    )],
  });
}

async function showStreakLeaderboard(interaction, guildId) {
  const streaks = StreakModel.getTopStreaks(guildId);

  if (streaks.length === 0) {
    return interaction.reply({
      embeds: [createInfoEmbed(
        t(guildId, 'cmd.leaderboard.title.streak'),
        t(guildId, 'cmd.leaderboard.empty')
      )],
    });
  }

  const medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
  const list = streaks.map((s, i) => {
    const prefix = medals[i] || `**${i + 1}.**`;
    return `${prefix} <@${s.user_id}> — \`${s.tag_name}\` — **${s.days}** ${t(guildId, 'cmd.streak.days', { days: '' }).trim()}`;
  }).join('\n');

  await interaction.reply({
    embeds: [createInfoEmbed(
      t(guildId, 'cmd.leaderboard.title.streak'),
      `${t(guildId, 'cmd.leaderboard.desc.streak')}\n\n${list}`
    )],
  });
}
