export const version = 1;

export function up(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS guilds (
      guild_id           TEXT PRIMARY KEY,
      guild_name         TEXT NOT NULL,
      log_channel_id     TEXT,
      check_interval     INTEGER DEFAULT 300,
      dm_notify          INTEGER DEFAULT 0,
      welcome_channel_id TEXT,
      welcome_enabled    INTEGER DEFAULT 0,
      created_at         TEXT DEFAULT (datetime('now')),
      updated_at         TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id   TEXT NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
      tag_name   TEXT NOT NULL,
      role_id    TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(guild_id, tag_name)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id     TEXT NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
      user_id      TEXT NOT NULL,
      current_tag  TEXT,
      has_role     INTEGER DEFAULT 0,
      last_checked TEXT,
      UNIQUE(guild_id, user_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tag_history (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id   TEXT NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
      user_id    TEXT NOT NULL,
      tag_name   TEXT NOT NULL,
      action     TEXT NOT NULL CHECK(action IN ('added','removed')),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stats (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id      TEXT NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
      total_checks  INTEGER DEFAULT 0,
      roles_added   INTEGER DEFAULT 0,
      roles_removed INTEGER DEFAULT 0,
      last_check    TEXT,
      UNIQUE(guild_id)
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_tags_guild ON tags(guild_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_members_guild_user ON members(guild_id, user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tag_history_guild_user ON tag_history(guild_id, user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tag_history_created ON tag_history(created_at)`);
}
