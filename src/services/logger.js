import { GuildModel } from '../database/models/guild.js';
import { createSuccessEmbed, createErrorEmbed, createInfoEmbed, createWarningEmbed } from '../utils/embeds.js';
import { COLORS } from '../utils/constants.js';

export async function sendLog(client, guildId, options) {
  try {
    const guildConfig = GuildModel.findById(guildId);
    if (!guildConfig?.log_channel_id) return;

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    const channel = guild.channels.cache.get(guildConfig.log_channel_id);
    if (!channel) return;

    let embed;
    switch (options.type) {
      case 'success':
        embed = createSuccessEmbed(options.title, options.description, options.fields);
        break;
      case 'error':
        embed = createErrorEmbed(options.title, options.description);
        break;
      case 'warning':
        embed = createWarningEmbed(options.title, options.description, options.fields);
        break;
      default:
        embed = createInfoEmbed(options.title, options.description, options.fields);
    }

    if (options.thumbnail) embed.setThumbnail(options.thumbnail);

    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(`[Logger] Guild ${guildId} log gönderilemedi:`, error.message);
  }
}

export async function sendErrorLog(client, guildId, title, error) {
  await sendLog(client, guildId, {
    type: 'error',
    title: `\u26A0\uFE0F ${title}`,
    description: `\`\`\`js\n${error.message || error}\n\`\`\``,
  });
}
