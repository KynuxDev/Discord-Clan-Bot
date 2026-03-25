import { PermissionFlagsBits } from 'discord.js';
import { createErrorEmbed } from './embeds.js';

export async function requirePermission(interaction, permission) {
  if (!interaction.memberPermissions.has(permission)) {
    const permName = Object.entries(PermissionFlagsBits)
      .find(([, v]) => v === permission)?.[0] || 'Gerekli Yetki';

    await interaction.reply({
      embeds: [createErrorEmbed(
        'Yetersiz Yetki',
        `Bu komutu kullanmak için **${permName}** yetkisine ihtiyacınız var.`
      )],
      ephemeral: true,
    });
    return false;
  }
  return true;
}

export function isAdmin(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator)
    || member.permissions.has(PermissionFlagsBits.ManageGuild);
}
