import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { AuditLogModel } from '../database/models/auditLog.js';
import { createInfoEmbed } from '../utils/embeds.js';
import { requirePermission } from '../utils/permissions.js';
import { t } from '../locales/index.js';

export const data = new SlashCommandBuilder()
  .setName('audit')
  .setDescription('Son admin işlemlerini gösterir.')
  .addIntegerOption(opt =>
    opt.setName('sayi')
      .setDescription('Gösterilecek kayıt sayısı (varsayılan: 10)')
      .setMinValue(1)
      .setMaxValue(25)
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  if (!await requirePermission(interaction, PermissionFlagsBits.ManageGuild)) return;

  const guildId = interaction.guildId;
  const count = interaction.options.getInteger('sayi') || 10;
  const records = AuditLogModel.getRecent(guildId, count);

  if (records.length === 0) {
    return interaction.reply({
      embeds: [createInfoEmbed(
        t(guildId, 'cmd.audit.title'),
        t(guildId, 'cmd.audit.empty')
      )],
      ephemeral: true,
    });
  }

  const list = records.map(r => {
    const actionName = t(guildId, `audit.${r.action_type}`);
    const time = r.created_at ? `<t:${Math.floor(new Date(r.created_at + 'Z').getTime() / 1000)}:R>` : '?';
    const detail = r.details ? ` — ${r.details}` : '';
    return `${time} <@${r.user_id}> **${actionName}**${detail}`;
  }).join('\n');

  await interaction.reply({
    embeds: [createInfoEmbed(
      t(guildId, 'cmd.audit.title'),
      `${t(guildId, 'cmd.audit.desc', { count: records.length })}\n\n${list}`
    )],
    ephemeral: true,
  });
}
