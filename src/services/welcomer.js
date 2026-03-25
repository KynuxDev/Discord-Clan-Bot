import { EmbedBuilder } from 'discord.js';
import { GuildModel } from '../database/models/guild.js';
import { COLORS } from '../utils/constants.js';

export async function sendWelcome(client, member, hasTag, tagName) {
  const guildId = member.guild.id;
  const config = GuildModel.findById(guildId);

  if (!config?.welcome_enabled || !config?.welcome_channel_id) return;

  const channel = member.guild.channels.cache.get(config.welcome_channel_id);
  if (!channel) return;

  const memberCount = member.guild.memberCount;

  const embed = hasTag
    ? new EmbedBuilder()
        .setTitle('Hoş Geldin!')
        .setColor(COLORS.SUCCESS)
        .setDescription(
          `<@${member.id}> sunucumuza katıldı!\n\n` +
          `**${tagName}** tagına sahip olduğun için otomatik olarak rolün verildi. ` +
          `Aramıza hoş geldin!`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          { name: 'Üye', value: `<@${member.id}>`, inline: true },
          { name: 'Tag', value: tagName, inline: true },
          { name: 'Üye Sayısı', value: `${memberCount}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: `Clan Bot v2.0` })
    : new EmbedBuilder()
        .setTitle('Hoş Geldin!')
        .setColor(COLORS.INFO)
        .setDescription(
          `<@${member.id}> sunucumuza katıldı!\n\n` +
          `Clan tagını ekleyerek özel role sahip olabilirsin!`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          { name: 'Üye', value: `<@${member.id}>`, inline: true },
          { name: 'Üye Sayısı', value: `${memberCount}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: `Clan Bot v2.0` });

  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(`[Welcomer] Hoşgeldin mesajı gönderilemedi:`, error.message);
  }
}
