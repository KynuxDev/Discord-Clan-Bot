import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { TagModel } from '../../database/models/tag.js';
import { AuditLogModel } from '../../database/models/auditLog.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embeds.js';
import { requirePermission } from '../../utils/permissions.js';

export const data = new SlashCommandBuilder()
  .setName('tag-sil')
  .setDescription('Bir clan tag-rol eşlemesini kaldırır.')
  .addStringOption(opt =>
    opt.setName('tag')
      .setDescription('Silinecek tag adı')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction) {
  if (!await requirePermission(interaction, PermissionFlagsBits.ManageRoles)) return;

  const tagName = interaction.options.getString('tag').toUpperCase().trim();

  const existing = TagModel.findByName(interaction.guildId, tagName);
  if (!existing) {
    return interaction.reply({
      embeds: [createErrorEmbed('Hata', `**${tagName}** adında bir tag eşlemesi bulunamadı.`)],
      ephemeral: true,
    });
  }

  TagModel.remove(interaction.guildId, tagName);
  AuditLogModel.record(interaction.guildId, interaction.user.id, 'tag_remove', tagName);

  await interaction.reply({
    embeds: [createSuccessEmbed(
      'Tag Eşlemesi Silindi',
      `**${tagName}** → <@&${existing.role_id}> eşlemesi kaldırıldı.\n\nMevcut rollere dokunulmadı, bir sonraki kontrolde güncellenecek.`
    )],
    ephemeral: true,
  });
}
