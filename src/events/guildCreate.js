import { GuildModel } from '../database/models/guild.js';
import { StatsModel } from '../database/models/stats.js';
import { start as startScheduler } from '../services/scheduler.js';

export const name = 'guildCreate';
export const once = false;

export async function execute(guild, client) {
  console.log(`[Bot] Yeni sunucuya eklendi: ${guild.name} (${guild.id})`);

  GuildModel.upsert(guild.id, guild.name);
  StatsModel.create(guild.id);
  startScheduler(client, guild.id);
}
