import { SlashCommandBuilder } from 'discord.js';
import { TagModel } from '../../database/models/tag.js';
import { createInfoEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
  .setName('tag-liste')
  .setDescription('Tanımlı tüm tag-rol eşlemelerini gösterir.');

export async function execute(interaction) {
  const tags = TagModel.findByGuild(interaction.guildId);

  if (tags.length === 0) {
    return interaction.reply({
      embeds: [createInfoEmbed(
        'Tag Listesi',
        'Henüz tanımlı bir tag eşlemesi yok.\n\n`/tag-ekle` komutu ile yeni bir eşleme ekleyebilirsiniz.'
      )],
    });
  }

  const list = tags
    .map((t, i) => `**${i + 1}.** \`${t.tag_name}\` → <@&${t.role_id}>`)
    .join('\n');

  await interaction.reply({
    embeds: [createInfoEmbed(
      'Tag Listesi',
      `Bu sunucuda **${tags.length}** tag eşlemesi tanımlı:\n\n${list}`
    )],
  });
}
