import { performBatchCheck } from './tagChecker.js';
import { GuildModel } from '../database/models/guild.js';
import { LIMITS } from '../utils/constants.js';

const intervals = new Map();

export function start(client, guildId) {
  stop(guildId);

  const config = GuildModel.findById(guildId);
  const intervalMs = (config?.check_interval || LIMITS.DEFAULT_CHECK_INTERVAL) * 1000;

  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;

  const id = setInterval(() => {
    performBatchCheck(client, guild).catch(err => {
      console.error(`[Scheduler] ${guildId} batch kontrolü hatası:`, err.message);
    });
  }, intervalMs);

  intervals.set(guildId, id);
  console.log(`[Scheduler] ${guild.name} — ${intervalMs / 1000}s aralıkla kontrol başlatıldı.`);
}

export function stop(guildId) {
  const id = intervals.get(guildId);
  if (id) {
    clearInterval(id);
    intervals.delete(guildId);
  }
}

export function restart(client, guildId) {
  stop(guildId);
  start(client, guildId);
}

export function stopAll() {
  for (const [guildId, id] of intervals) {
    clearInterval(id);
  }
  intervals.clear();
  console.log('[Scheduler] Tüm zamanlayıcılar durduruldu.');
}
