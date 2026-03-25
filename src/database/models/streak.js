import { getDb, save } from '../index.js';

export const StreakModel = {
  getActive(guildId, userId) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM streaks WHERE guild_id = ? AND user_id = ? AND is_active = 1',
      [guildId, userId]
    );
    if (result.length === 0 || result[0].values.length === 0) return null;
    return rowToObject(result[0]);
  },

  startOrContinue(guildId, userId, tagName) {
    const db = getDb();
    const active = this.getActive(guildId, userId);
    const today = new Date().toISOString().split('T')[0];

    if (active) {
      if (active.last_seen === today) return active;

      const startDate = new Date(active.start_date);
      const days = Math.floor((new Date(today) - startDate) / 86400000) + 1;

      db.run(
        'UPDATE streaks SET last_seen = ?, days = ?, tag_name = ? WHERE id = ?',
        [today, days, tagName, active.id]
      );
      save();
      return { ...active, last_seen: today, days, tag_name: tagName };
    }

    db.run(
      'INSERT INTO streaks (guild_id, user_id, tag_name, start_date, last_seen, days, is_active) VALUES (?, ?, ?, ?, ?, 1, 1)',
      [guildId, userId, tagName, today, today]
    );
    save();
    return this.getActive(guildId, userId);
  },

  breakStreak(guildId, userId) {
    const db = getDb();
    const active = this.getActive(guildId, userId);
    if (!active) return null;

    db.run(
      'UPDATE streaks SET is_active = 0 WHERE guild_id = ? AND user_id = ? AND is_active = 1',
      [guildId, userId]
    );
    save();
    return active;
  },

  getTopStreaks(guildId, limit = 10) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM streaks WHERE guild_id = ? AND is_active = 1 ORDER BY days DESC LIMIT ?',
      [guildId, limit]
    );
    if (result.length === 0) return [];
    return rowsToObjects(result[0]);
  },

  getBestEver(guildId, limit = 10) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM streaks WHERE guild_id = ? ORDER BY days DESC LIMIT ?',
      [guildId, limit]
    );
    if (result.length === 0) return [];
    return rowsToObjects(result[0]);
  },
};

function rowToObject(result) {
  const columns = result.columns;
  const values = result.values[0];
  const obj = {};
  columns.forEach((col, i) => { obj[col] = values[i]; });
  return obj;
}

function rowsToObjects(result) {
  const columns = result.columns;
  return result.values.map(values => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = values[i]; });
    return obj;
  });
}
