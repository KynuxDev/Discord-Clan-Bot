import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../utils/embeds.js';
import { t } from '../locales/index.js';

export const data = new SlashCommandBuilder()
  .setName('yardim')
  .setDescription('Tüm komutları ve kullanımlarını gösterir.');

export async function execute(interaction) {
  const guildId = interaction.guildId;

  await interaction.reply({
    embeds: [createInfoEmbed(
      t(guildId, 'cmd.help.title'),
      t(guildId, 'cmd.help.desc'),
      [
        {
          name: t(guildId, 'cmd.help.tag_mgmt'),
          value: [
            '`/tag-ekle <tag> <rol>` — Tag-rol mapping',
            '`/tag-sil <tag>` — Remove mapping',
            '`/tag-liste` — List all mappings',
          ].join('\n'),
          inline: false,
        },
        {
          name: t(guildId, 'cmd.help.control'),
          value: [
            '`/kontrol [user]` — Check single user',
            '`/kontrol-tumu` — Full server scan',
          ].join('\n'),
          inline: false,
        },
        {
          name: t(guildId, 'cmd.help.info'),
          value: [
            '`/istatistik` — Statistics',
            '`/siralama [tip]` — Leaderboard (sure/streak)',
            '`/streak [user]` — Tag streak info',
            '`/audit [count]` — Audit log',
            '`/hakkinda` — About',
          ].join('\n'),
          inline: false,
        },
        {
          name: t(guildId, 'cmd.help.settings'),
          value: [
            '`/ayarlar goster` — Show settings',
            '`/ayarlar log-kanal` — Log channel',
            '`/ayarlar kontrol-araligi` — Check interval',
            '`/ayarlar bildirim` — DM notifications',
            '`/ayarlar hosgeldin-kanal` — Welcome channel',
            '`/ayarlar hosgeldin` — Welcome messages',
            '`/ayarlar dil` — Language (TR/EN)',
            '`/ayarlar gereksinim-hesap` — Account age req',
            '`/ayarlar gereksinim-sunucu` — Server time req',
            '`/ayarlar dashboard` — Live dashboard',
            '`/ayarlar dashboard-kapat` — Disable dashboard',
          ].join('\n'),
          inline: false,
        },
      ]
    )],
  });
}
