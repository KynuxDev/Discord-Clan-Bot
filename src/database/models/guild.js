import { getDb, save } from '../index.js';

export const GuildModel = {
  findById(guildId) {
    const db = getDb();
    const result = db.exec('SELECT * FROM guilds WHERE guild_id = ?', [guildId]);
    if (result.length === 0 || result[0].values.length === 0) return null;
    return rowToObject(result[0]);
  },

  upsert(guildId, guildName) {
    const db = getDb();
    db.run(
      `INSERT INTO guilds (guild_id, guild_name) VALUES (?, ?)
       ON CONFLICT(guild_id) DO UPDATE SET guild_name = ?, updated_at = datetime('now')`,
      [guildId, guildName, guildName]
    );
    save();
    return this.findById(guildId);
  },

  updateLogChannel(guildId, channelId) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET log_channel_id = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [channelId, guildId]
    );
    save();
  },

  updateCheckInterval(guildId, seconds) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET check_interval = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [seconds, guildId]
    );
    save();
  },

  updateDmNotify(guildId, enabled) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET dm_notify = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [enabled ? 1 : 0, guildId]
    );
    save();
  },

  updateWelcomeChannel(guildId, channelId) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET welcome_channel_id = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [channelId, guildId]
    );
    save();
  },

  updateWelcomeEnabled(guildId, enabled) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET welcome_enabled = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [enabled ? 1 : 0, guildId]
    );
    save();
  },

  updateLanguage(guildId, language) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET language = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [language, guildId]
    );
    save();
  },

  updateMinAccountAge(guildId, hours) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET min_account_age = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [hours, guildId]
    );
    save();
  },

  updateMinServerTime(guildId, hours) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET min_server_time = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [hours, guildId]
    );
    save();
  },

  updateDashboardChannel(guildId, channelId) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET dashboard_channel_id = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [channelId, guildId]
    );
    save();
  },

  updateDashboardMessage(guildId, messageId) {
    const db = getDb();
    db.run(
      `UPDATE guilds SET dashboard_message_id = ?, updated_at = datetime('now') WHERE guild_id = ?`,
      [messageId, guildId]
    );
    save();
  },

  remove(guildId) {
    const db = getDb();
    db.run('DELETE FROM guilds WHERE guild_id = ?', [guildId]);
    save();
  },
};

function rowToObject(result) {
  const columns = result.columns;
  const values = result.values[0];
  const obj = {};
  columns.forEach((col, i) => { obj[col] = values[i]; });
  return obj;
}
