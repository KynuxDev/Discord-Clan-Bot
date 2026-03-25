export const version = 2;

export function up(db) {
  // i18n
  db.run(`ALTER TABLE guilds ADD COLUMN language TEXT DEFAULT 'tr'`);

  // Tag gereksinimleri
  db.run(`ALTER TABLE guilds ADD COLUMN min_account_age INTEGER DEFAULT 0`);
  db.run(`ALTER TABLE guilds ADD COLUMN min_server_time INTEGER DEFAULT 0`);

  // Dashboard
  db.run(`ALTER TABLE guilds ADD COLUMN dashboard_channel_id TEXT`);
  db.run(`ALTER TABLE guilds ADD COLUMN dashboard_message_id TEXT`);

  // Streaks
  db.run(`
    CREATE TABLE IF NOT EXISTS streaks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id   TEXT NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
      user_id    TEXT NOT NULL,
      tag_name   TEXT NOT NULL,
      start_date TEXT NOT NULL DEFAULT (date('now')),
      last_seen  TEXT NOT NULL DEFAULT (date('now')),
      days       INTEGER DEFAULT 1,
      is_active  INTEGER DEFAULT 1
    )
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_streaks_guild_active ON streaks(guild_id, is_active)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_streaks_guild_user ON streaks(guild_id, user_id)`);

  // Audit log
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id    TEXT NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
      user_id     TEXT NOT NULL,
      action_type TEXT NOT NULL,
      details     TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    )
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_audit_guild ON audit_log(guild_id, created_at)`);
}
