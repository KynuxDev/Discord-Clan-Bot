import { getDb, save } from '../index.js';

export const StatsModel = {
  findByGuild(guildId) {
    const db = getDb();
    const result = db.exec('SELECT * FROM stats WHERE guild_id = ?', [guildId]);
    if (result.length === 0 || result[0].values.length === 0) {
      this.create(guildId);
      return { guild_id: guildId, total_checks: 0, roles_added: 0, roles_removed: 0, last_check: null };
    }
    return rowToObject(result[0]);
  },

  create(guildId) {
    const db = getDb();
    db.run(
      'INSERT OR IGNORE INTO stats (guild_id) VALUES (?)',
      [guildId]
    );
    save();
  },

  incrementChecks(guildId) {
    const db = getDb();
    db.run(
      `UPDATE stats SET total_checks = total_checks + 1, last_check = datetime('now') WHERE guild_id = ?`,
      [guildId]
    );
    save();
  },

  incrementRolesAdded(guildId, count = 1) {
    const db = getDb();
    db.run(
      'UPDATE stats SET roles_added = roles_added + ? WHERE guild_id = ?',
      [count, guildId]
    );
    save();
  },

  incrementRolesRemoved(guildId, count = 1) {
    const db = getDb();
    db.run(
      'UPDATE stats SET roles_removed = roles_removed + ? WHERE guild_id = ?',
      [count, guildId]
    );
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
