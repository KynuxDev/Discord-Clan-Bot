/**
 * v1.0 JSON veritabanını v2.0 SQLite'a aktarır.
 *
 * Kullanım:
 *   1. .env dosyasına eski v1.0 değerlerini ekleyin:
 *      V1_GUILD_ID, V1_TARGET_TAG, V1_TAG_ROLE_ID, V1_LOG_CHANNEL_ID
 *   2. Eski database/data.json dosyasını bu projenin kök dizinine kopyalayın.
 *   3. Çalıştırın: node scripts/migrate-v1.js
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDatabase, getDb, save, closeDatabase } from '../src/database/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const jsonPath = path.join(__dirname, '..', 'database', 'data.json');

  if (!fs.existsSync(jsonPath)) {
    console.log('database/data.json bulunamadı. Migrasyon atlanıyor.');
    console.log('Eski v1.0 veritabanını bu dizine kopyalayın: database/data.json');
    return;
  }

  const guildId = process.env.V1_GUILD_ID;
  const targetTag = process.env.V1_TARGET_TAG;
  const tagRoleId = process.env.V1_TAG_ROLE_ID;
  const logChannelId = process.env.V1_LOG_CHANNEL_ID;

  if (!guildId || !targetTag || !tagRoleId) {
    console.error('.env dosyasında V1_GUILD_ID, V1_TARGET_TAG, V1_TAG_ROLE_ID gerekli.');
    process.exit(1);
  }

  await initDatabase();
  const db = getDb();

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const stats = data.stats || {};

  // Guild kaydı
  db.run(
    `INSERT OR IGNORE INTO guilds (guild_id, guild_name, log_channel_id) VALUES (?, ?, ?)`,
    [guildId, 'Migrated Guild', logChannelId || null]
  );

  // Tag eşlemesi
  db.run(
    `INSERT OR IGNORE INTO tags (guild_id, tag_name, role_id, created_by) VALUES (?, ?, ?, ?)`,
    [guildId, targetTag, tagRoleId, 'migration']
  );

  // İstatistikler
  db.run(
    `INSERT OR IGNORE INTO stats (guild_id, total_checks, roles_added, roles_removed) VALUES (?, ?, ?, ?)`,
    [guildId, stats.totalChecks || 0, stats.roleAdded || 0, stats.roleRemoved || 0]
  );

  save();
  closeDatabase();

  console.log('Migrasyon tamamlandı!');
  console.log(`  Guild: ${guildId}`);
  console.log(`  Tag: ${targetTag} → Rol: ${tagRoleId}`);
  console.log(`  İstatistikler: ${stats.totalChecks || 0} kontrol, ${stats.roleAdded || 0} ekleme, ${stats.roleRemoved || 0} kaldırma`);
}

migrate().catch(err => {
  console.error('Migrasyon hatası:', err);
  process.exit(1);
});
