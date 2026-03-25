import { getDb, save } from '../index.js';

export const MemberModel = {
  findByGuildAndUser(guildId, userId) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM members WHERE guild_id = ? AND user_id = ?',
      [guildId, userId]
    );
    if (result.length === 0 || result[0].values.length === 0) return null;
    return rowToObject(result[0]);
  },

  upsert(guildId, userId, currentTag, hasRole) {
    const db = getDb();
    db.run(
      `INSERT INTO members (guild_id, user_id, current_tag, has_role, last_checked)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(guild_id, user_id) DO UPDATE SET
         current_tag = ?, has_role = ?, last_checked = datetime('now')`,
      [guildId, userId, currentTag, hasRole ? 1 : 0, currentTag, hasRole ? 1 : 0]
    );
    save();
  },

  getTaggedCount(guildId) {
    const db = getDb();
    const result = db.exec(
      'SELECT COUNT(*) FROM members WHERE guild_id = ? AND has_role = 1',
      [guildId]
    );
    return result.length > 0 ? result[0].values[0][0] : 0;
  },

  getUntaggedCount(guildId) {
    const db = getDb();
    const result = db.exec(
      'SELECT COUNT(*) FROM members WHERE guild_id = ? AND has_role = 0',
      [guildId]
    );
    return result.length > 0 ? result[0].values[0][0] : 0;
  },

  removeByGuildAndUser(guildId, userId) {
    const db = getDb();
    db.run('DELETE FROM members WHERE guild_id = ? AND user_id = ?', [guildId, userId]);
    save();
  },

  removeByGuild(guildId) {
    const db = getDb();
    db.run('DELETE FROM members WHERE guild_id = ?', [guildId]);
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
