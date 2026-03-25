import initSqlJs from 'sql.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'clan-bot.db');

let db = null;

export async function initDatabase() {
  const SQL = await initSqlJs();

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA journal_mode = WAL');

  await runMigrations();
  save();

  return db;
}

async function runMigrations() {
  db.run('CREATE TABLE IF NOT EXISTS _migrations (version INTEGER PRIMARY KEY, applied_at TEXT DEFAULT (datetime(\'now\')))');

  const result = db.exec('SELECT COALESCE(MAX(version), 0) as v FROM _migrations');
  const currentVersion = result.length > 0 ? result[0].values[0][0] : 0;

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js')).sort();

  for (const file of files) {
    const migration = await import(pathToFileURL(path.join(migrationsDir, file)).href);
    if (migration.version > currentVersion) {
      console.log(`Migration ${migration.version} uygulanıyor...`);
      migration.up(db);
      db.run('INSERT INTO _migrations (version) VALUES (?)', [migration.version]);
      console.log(`Migration ${migration.version} tamamlandı.`);
    }
  }
}

export function save() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function getDb() {
  if (!db) throw new Error('Veritabanı henüz başlatılmadı. initDatabase() çağırın.');
  return db;
}

export function closeDatabase() {
  if (db) {
    save();
    db.close();
    db = null;
  }
}
