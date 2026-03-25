import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { TagModel } from '../../database/models/tag.js';
import { AuditLogModel } from '../../database/models/auditLog.js';
import { LIMITS } from '../../utils/constants.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embeds.js';
import { requirePermission } from '../../utils/permissions.js';
import { t } from '../../locales/index.js';

export const data = new SlashCommandBuilder()
  .setName('tag-ekle')
  .setDescription('Yeni bir clan tag-rol eşlemesi ekler.')
  .addStringOption(opt =>
    opt.setName('tag')
      .setDescription('Clan tag adı (örn: OHIO)')
      .setRequired(true)
  )
  .addRoleOption(opt =>
    opt.setName('rol')
      .setDescription('Tag sahiplerine verilecek rol')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction) {
  if (!await requirePermission(interaction, PermissionFlagsBits.ManageRoles)) return;

  const tagName = interaction.options.getString('tag').toUpperCase().trim();
  const role = interaction.options.getRole('rol');

  if (!tagName) {
    return interaction.reply({
      embeds: [createErrorEmbed('Hata', 'Tag adı boş olamaz.')],
      ephemeral: true,
    });
  }

  const existing = TagModel.findByName(interaction.guildId, tagName);
  if (existing) {
    return interaction.reply({
      embeds: [createErrorEmbed('Hata', `**${tagName}** tagı zaten tanımlı — <@&${existing.role_id}> rolüne eşlenmiş.`)],
      ephemeral: true,
    });
  }

  const count = TagModel.count(interaction.guildId);
  if (count >= LIMITS.MAX_TAGS_PER_GUILD) {
    return interaction.reply({
      embeds: [createErrorEmbed('Hata', `Maksimum ${LIMITS.MAX_TAGS_PER_GUILD} tag eşlemesi tanımlayabilirsiniz.`)],
      ephemeral: true,
    });
  }

  TagModel.create(interaction.guildId, tagName, role.id, interaction.user.id);
  AuditLogModel.record(interaction.guildId, interaction.user.id, 'tag_add', `${tagName} → ${role.name}`);

  await interaction.reply({
    embeds: [createSuccessEmbed(
      t(interaction.guildId, 'cmd.tag.add.success.title'),
      t(interaction.guildId, 'cmd.tag.add.success.desc', { tag: tagName, role: `<@&${role.id}>` }),
      [
        { name: t(interaction.guildId, 'field.tag'), value: tagName, inline: true },
        { name: t(interaction.guildId, 'field.role'), value: `<@&${role.id}>`, inline: true },
        { name: t(interaction.guildId, 'field.added_by'), value: `<@${interaction.user.id}>`, inline: true },
      ]
    )],
  });
}
