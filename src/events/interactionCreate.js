import { TagModel } from '../database/models/tag.js';

export const name = 'interactionCreate';
export const once = false;

export async function execute(interaction, client) {
  if (interaction.isAutocomplete()) {
    return handleAutocomplete(interaction);
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(`[Command] /${interaction.commandName} hatası:`, error);

    const reply = {
      content: 'Bu komutu çalıştırırken bir hata oluştu!',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
}

async function handleAutocomplete(interaction) {
  const focusedOption = interaction.options.getFocused(true);

  if (focusedOption.name === 'tag') {
    const tagNames = TagModel.getTagNames(interaction.guildId);
    const filtered = tagNames
      .filter(t => t.toLowerCase().includes(focusedOption.value.toLowerCase()))
      .slice(0, 25);

    await interaction.respond(
      filtered.map(t => ({ name: t, value: t }))
    ).catch(() => {});
  }
}
