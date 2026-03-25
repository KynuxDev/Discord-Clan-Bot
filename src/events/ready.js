import { ActivityType } from 'discord.js';
import { GuildModel } from '../database/models/guild.js';
import { StatsModel } from '../database/models/stats.js';
import { start as startScheduler } from '../services/scheduler.js';
import { performBatchCheck } from '../services/tagChecker.js';

export const name = 'ready';
export const once = true;

export async function execute(client) {
  console.log(`[Bot] ${client.user.tag} olarak giriş yapıldı!`);

  client.user.setPresence({
    activities: [{ name: `${client.guilds.cache.size} sunucu`, type: ActivityType.Watching }],
    status: 'online',
  });

  for (const [guildId, guild] of client.guilds.cache) {
    GuildModel.upsert(guildId, guild.name);
    StatsModel.create(guildId);
    startScheduler(client, guildId);

    performBatchCheck(client, guild).catch(err => {
      console.error(`[Ready] ${guild.name} ilk kontrol hatası:`, err.message);
    });
  }

  console.log(`[Bot] ${client.guilds.cache.size} sunucuda aktif.`);
}
