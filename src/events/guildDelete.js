import { stop as stopScheduler } from '../services/scheduler.js';

export const name = 'guildDelete';
export const once = false;

export async function execute(guild, client) {
  console.log(`[Bot] Sunucudan çıkarıldı: ${guild.name} (${guild.id})`);
  stopScheduler(guild.id);
}
