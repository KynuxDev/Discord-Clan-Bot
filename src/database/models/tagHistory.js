import { getDb, save } from '../index.js';

export const TagHistoryModel = {
  record(guildId, userId, tagName, action) {
    const db = getDb();
    db.run(
      'INSERT INTO tag_history (guild_id, user_id, tag_name, action) VALUES (?, ?, ?, ?)',
      [guildId, userId, tagName, action]
    );
    save();
  },

  getLeaderboard(guildId, limit = 10) {
    const db = getDb();
    const result = db.exec(
      `SELECT user_id, tag_name, created_at,
              ROUND((julianday('now') - julianday(created_at)) * 24) as hours
       FROM tag_history
       WHERE guild_id = ? AND action = 'added'
         AND NOT EXISTS (
           SELECT 1 FROM tag_history h2
           WHERE h2.guild_id = tag_history.guild_id
             AND h2.user_id = tag_history.user_id
             AND h2.action = 'removed'
             AND h2.created_at > tag_history.created_at
         )
       ORDER BY created_at ASC
       LIMIT ?`,
      [guildId, limit]
    );
    if (result.length === 0) return [];
    return rowsToObjects(result[0]);
  },

  getUserHistory(guildId, userId, limit = 20) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM tag_history WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT ?',
      [guildId, userId, limit]
    );
    if (result.length === 0) return [];
    return rowsToObjects(result[0]);
  },

  closeActiveEntries(guildId, userId) {
    const db = getDb();
    const active = db.exec(
      `SELECT id, tag_name FROM tag_history
       WHERE guild_id = ? AND user_id = ? AND action = 'added'
         AND NOT EXISTS (
           SELECT 1 FROM tag_history h2
           WHERE h2.guild_id = tag_history.guild_id
             AND h2.user_id = tag_history.user_id
             AND h2.action = 'removed'
             AND h2.created_at > tag_history.created_at
         )`,
      [guildId, userId]
    );
    if (active.length > 0) {
      for (const row of active[0].values) {
        this.record(guildId, userId, row[1], 'removed');
      }
    }
  },
};

function rowsToObjects(result) {
  const columns = result.columns;
  return result.values.map(values => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = values[i]; });
    return obj;
  });
}
