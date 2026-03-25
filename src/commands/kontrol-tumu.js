import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { performBatchCheck } from '../services/tagChecker.js';
import { AuditLogModel } from '../database/models/auditLog.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embeds.js';
import { requirePermission } from '../utils/permissions.js';
import { LIMITS } from '../utils/constants.js';
import { t } from '../locales/index.js';

const cooldowns = new Map();

export const data = new SlashCommandBuilder()
  .setName('kontrol-tumu')
  .setDescription('Tüm sunucu üyelerinin tag kontrolünü başlatır.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction, client) {
  if (!await requirePermission(interaction, PermissionFlagsBits.Administrator)) return;

  const now = Date.now();
  const lastUsed = cooldowns.get(interaction.guildId) || 0;
  const remaining = LIMITS.COOLDOWN_FULL_CHECK * 1000 - (now - lastUsed);

  if (remaining > 0) {
    const seconds = Math.ceil(remaining / 1000);
    return interaction.reply({
      embeds: [createErrorEmbed(
        'Bekleme Süresi',
        `Bu komut ${seconds} saniye sonra tekrar kullanılabilir.`
      )],
      ephemeral: true,
    });
  }

  cooldowns.set(interaction.guildId, now);

  AuditLogModel.record(interaction.guildId, interaction.user.id, 'full_check', null);

  await interaction.reply({
    embeds: [createInfoEmbed(
      t(interaction.guildId, 'cmd.fullcheck.started'),
      t(interaction.guildId, 'cmd.fullcheck.started.desc')
    )],
    ephemeral: true,
  });

  try {
    await performBatchCheck(client, interaction.guild);
  } catch (error) {
    console.error(`[KontrolTumu] Hata:`, error);
  }
}
