import { getDb, save } from '../index.js';

export const AuditLogModel = {
  record(guildId, userId, actionType, details = null) {
    const db = getDb();
    db.run(
      'INSERT INTO audit_log (guild_id, user_id, action_type, details) VALUES (?, ?, ?, ?)',
      [guildId, userId, actionType, details]
    );
    save();
  },

  getRecent(guildId, limit = 10) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM audit_log WHERE guild_id = ? ORDER BY created_at DESC LIMIT ?',
      [guildId, limit]
    );
    if (result.length === 0) return [];
    return rowsToObjects(result[0]);
  },

  getByUser(guildId, userId, limit = 10) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM audit_log WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT ?',
      [guildId, userId, limit]
    );
    if (result.length === 0) return [];
    return rowsToObjects(result[0]);
  },

  getByType(guildId, actionType, limit = 10) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM audit_log WHERE guild_id = ? AND action_type = ? ORDER BY created_at DESC LIMIT ?',
      [guildId, actionType, limit]
    );
    if (result.length === 0) return [];
    return rowsToObjects(result[0]);
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
