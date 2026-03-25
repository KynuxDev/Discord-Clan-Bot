import { SlashCommandBuilder } from 'discord.js';
import { StreakModel } from '../database/models/streak.js';
import { createSuccessEmbed, createInfoEmbed } from '../utils/embeds.js';
import { t } from '../locales/index.js';

export const data = new SlashCommandBuilder()
  .setName('streak')
  .setDescription('Kullanıcının tag streak bilgisini gösterir.')
  .addUserOption(opt =>
    opt.setName('kullanici')
      .setDescription('Streak bilgisini görmek istediğiniz kullanıcı')
      .setRequired(false)
  );

export async function execute(interaction) {
  const guildId = interaction.guildId;
  const targetUser = interaction.options.getUser('kullanici') || interaction.user;

  const streak = StreakModel.getActive(guildId, targetUser.id);

  if (!streak) {
    return interaction.reply({
      embeds: [createInfoEmbed(
        t(guildId, 'cmd.streak.title'),
        t(guildId, 'cmd.streak.none', { userId: targetUser.id })
      )],
    });
  }

  await interaction.reply({
    embeds: [createSuccessEmbed(
      t(guildId, 'cmd.streak.title'),
      t(guildId, 'cmd.streak.active', { userId: targetUser.id }),
      [
        { name: t(guildId, 'cmd.streak.tag'), value: streak.tag_name, inline: true },
        { name: t(guildId, 'cmd.streak.days', { days: streak.days }), value: `${streak.days}`, inline: true },
        { name: t(guildId, 'cmd.streak.start'), value: streak.start_date, inline: true },
      ]
    )],
  });
}
