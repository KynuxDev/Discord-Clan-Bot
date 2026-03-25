import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { checkSingleMember } from '../services/tagChecker.js';
import { createSuccessEmbed, createInfoEmbed, createErrorEmbed } from '../utils/embeds.js';
import { requirePermission } from '../utils/permissions.js';

export const data = new SlashCommandBuilder()
  .setName('kontrol')
  .setDescription('Bir kullanıcının tag durumunu kontrol eder.')
  .addUserOption(opt =>
    opt.setName('kullanici')
      .setDescription('Kontrol edilecek kullanıcı (boş bırakılırsa kendiniz)')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction, client) {
  if (!await requirePermission(interaction, PermissionFlagsBits.ManageRoles)) return;

  await interaction.deferReply({ ephemeral: true });

  const targetUser = interaction.options.getUser('kullanici') || interaction.user;
  const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

  if (!member) {
    return interaction.editReply({
      embeds: [createErrorEmbed('Hata', 'Kullanıcı bu sunucuda bulunamadı.')],
    });
  }

  const result = await checkSingleMember(client, member);

  const embed = result.hasTag
    ? createSuccessEmbed(
        'Tag Kontrolü',
        `<@${member.id}> kullanıcısı **${result.tagName}** tagına sahip.`,
        [
          { name: 'Tag', value: result.tagName || 'Yok', inline: true },
          { name: 'Rol Değişimi', value: result.roleChanged ? (result.action === 'added' ? 'Rol verildi' : 'Rol alındı') : 'Değişiklik yok', inline: true },
        ]
      )
    : createInfoEmbed(
        'Tag Kontrolü',
        `<@${member.id}> kullanıcısının eşleşen bir tagı yok.`,
        [
          { name: 'Mevcut Tag', value: result.tagName || 'Tag yok', inline: true },
          { name: 'Rol Değişimi', value: result.roleChanged ? 'Rol alındı' : 'Değişiklik yok', inline: true },
        ]
      );

  await interaction.editReply({ embeds: [embed] });
}
