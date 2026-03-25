import { EmbedBuilder } from 'discord.js';
import { COLORS } from './constants.js';

export function createSuccessEmbed(title, description, fields = []) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(COLORS.SUCCESS)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: 'Clan Bot v2.0' });

  if (fields.length > 0) embed.addFields(fields);
  return embed;
}

export function createErrorEmbed(title, description) {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor(COLORS.ERROR)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: 'Clan Bot v2.0' });
}

export function createInfoEmbed(title, description, fields = []) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(COLORS.INFO)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: 'Clan Bot v2.0' });

  if (fields.length > 0) embed.addFields(fields);
  return embed;
}

export function createWarningEmbed(title, description, fields = []) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(COLORS.WARNING)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: 'Clan Bot v2.0' });

  if (fields.length > 0) embed.addFields(fields);
  return embed;
}

export function generateProgressBar(percent, length = 20) {
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty);
}
