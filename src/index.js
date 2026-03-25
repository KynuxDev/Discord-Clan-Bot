import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { REST, Routes } from 'discord.js';
import { createClient } from './bot.js';
import { initDatabase, closeDatabase } from './database/index.js';
import { stopAll as stopAllSchedulers } from './services/scheduler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // 1. Veritabanını başlat
  await initDatabase();
  console.log('[DB] Veritabanı hazır.');

  // 2. Client oluştur
  const client = createClient();

  // 3. Komutları yükle
  const slashCommands = [];
  await loadCommands(client, slashCommands, path.join(__dirname, 'commands'));

  // 4. Event'leri yükle
  await loadEvents(client, path.join(__dirname, 'events'));

  // 5. Slash komutlarını Discord'a register et
  await registerCommands(slashCommands);

  // 6. Graceful shutdown
  const shutdown = () => {
    console.log('\n[Bot] Kapatılıyor...');
    stopAllSchedulers();
    closeDatabase();
    client.destroy();
    console.log('[Bot] Kapatıldı.');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // 7. Giriş yap
  await client.login(process.env.BOT_TOKEN);
}

async function loadCommands(client, slashCommands, dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await loadCommands(client, slashCommands, fullPath);
      continue;
    }

    if (!entry.name.endsWith('.js')) continue;

    const fileUrl = pathToFileURL(fullPath).href;
    const command = await import(fileUrl);

    if (!command.data || !command.execute) {
      console.warn(`[Loader] ${entry.name} — data veya execute eksik, atlanıyor.`);
      continue;
    }

    client.commands.set(command.data.name, command);
    slashCommands.push(command.data.toJSON());
    console.log(`[Loader] Komut yüklendi: /${command.data.name}`);
  }
}

async function loadEvents(client, dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const fileUrl = pathToFileURL(fullPath).href;
    const event = await import(fileUrl);

    if (!event.name || !event.execute) {
      console.warn(`[Loader] ${file} — name veya execute eksik, atlanıyor.`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    console.log(`[Loader] Event yüklendi: ${event.name}`);
  }
}

async function registerCommands(slashCommands) {
  if (!process.env.BOT_TOKEN) {
    console.error('[Register] BOT_TOKEN ayarlanmamış!');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

  try {
    console.log(`[Register] ${slashCommands.length} komut kaydediliyor...`);

    if (process.env.DEV_GUILD_ID) {
      // Geliştirme: Guild-specific (anında aktif)
      const clientId = Buffer.from(process.env.BOT_TOKEN.split('.')[0], 'base64').toString();
      await rest.put(
        Routes.applicationGuildCommands(clientId, process.env.DEV_GUILD_ID),
        { body: slashCommands }
      );
      console.log(`[Register] Komutlar dev sunucusuna kaydedildi (anında aktif).`);
    } else {
      // Production: Global (1 saate kadar yayılır)
      const clientId = Buffer.from(process.env.BOT_TOKEN.split('.')[0], 'base64').toString();
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: slashCommands }
      );
      console.log(`[Register] Komutlar global olarak kaydedildi (yayılması ~1 saat).`);
    }
  } catch (error) {
    console.error('[Register] Komut kaydı hatası:', error);
  }
}

main().catch(error => {
  console.error('[Fatal]', error);
  process.exit(1);
});
