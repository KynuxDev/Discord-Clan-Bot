import { SlashCommandBuilder, version as djsVersion } from 'discord.js';
import { createInfoEmbed } from '../utils/embeds.js';
import { formatDuration } from '../utils/time.js';

export const data = new SlashCommandBuilder()
  .setName('hakkinda')
  .setDescription('Bot hakkında bilgi gösterir.');

export async function execute(interaction, client) {
  const uptime = formatDuration(Date.now() - client.startedAt);
  const totalMembers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

  await interaction.reply({
    embeds: [createInfoEmbed(
      'Clan Bot v2.1',
      'Discord clan tag takip botu. Kullanıcıların clan taglarını otomatik olarak kontrol eder ve eşleşen rolleri yönetir.',
      [
        { name: 'Versiyon', value: '2.1.0', inline: true },
        { name: 'Discord.js', value: `v${djsVersion}`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'Sunucu Sayısı', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Toplam Üye', value: `${totalMembers}`, inline: true },
        { name: 'Uptime', value: uptime, inline: true },
        { name: 'Geliştirici', value: '[KynuxDev](https://github.com/KynuxDev)', inline: true },
        { name: 'GitHub', value: '[Discord-Clan-Bot](https://github.com/KynuxDev/Discord-Clan-Bot)', inline: true },
      ]
    )],
  });
}
