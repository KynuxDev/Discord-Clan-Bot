import { getDb, save } from '../index.js';

export const TagModel = {
  findByGuild(guildId) {
    const db = getDb();
    const result = db.exec('SELECT * FROM tags WHERE guild_id = ? ORDER BY created_at', [guildId]);
    if (result.length === 0) return [];
    return rowsToObjects(result[0]);
  },

  findByName(guildId, tagName) {
    const db = getDb();
    const result = db.exec(
      'SELECT * FROM tags WHERE guild_id = ? AND tag_name = ?',
      [guildId, tagName]
    );
    if (result.length === 0 || result[0].values.length === 0) return null;
    return rowToObject(result[0]);
  },

  create(guildId, tagName, roleId, createdBy) {
    const db = getDb();
    db.run(
      'INSERT INTO tags (guild_id, tag_name, role_id, created_by) VALUES (?, ?, ?, ?)',
      [guildId, tagName, roleId, createdBy]
    );
    save();
    return this.findByName(guildId, tagName);
  },

  remove(guildId, tagName) {
    const db = getDb();
    db.run('DELETE FROM tags WHERE guild_id = ? AND tag_name = ?', [guildId, tagName]);
    save();
  },

  getTagNames(guildId) {
    const db = getDb();
    const result = db.exec('SELECT tag_name FROM tags WHERE guild_id = ?', [guildId]);
    if (result.length === 0) return [];
    return result[0].values.map(row => row[0]);
  },

  count(guildId) {
    const db = getDb();
    const result = db.exec('SELECT COUNT(*) FROM tags WHERE guild_id = ?', [guildId]);
    return result.length > 0 ? result[0].values[0][0] : 0;
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
