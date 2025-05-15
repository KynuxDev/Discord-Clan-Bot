require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const { setupLogger } = require('./utils/logger');
const db = require('./db');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
client.rest = rest;

setupLogger(client);
client.commands = new Collection();
client.prefixCommands = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  
  console.log(`${event.name} eventi yüklendi.`);
}

// Slash komutlarını yükle
const slashCommandsPath = path.join(__dirname, 'commands', 'slash');
const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));

const slashCommands = [];

for (const file of slashCommandFiles) {
  const filePath = path.join(slashCommandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    slashCommands.push(command.data.toJSON());
    console.log(`Slash komut yüklendi: /${command.data.name}`);
  } else {
    console.warn(`${filePath} komutunda data veya execute eksik!`);
  }
}

const prefixCommandsPath = path.join(__dirname, 'commands', 'prefix');
const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));

for (const file of prefixCommandFiles) {
  const filePath = path.join(prefixCommandsPath, file);
  const command = require(filePath);
  
  if ('name' in command && 'execute' in command) {
    client.prefixCommands.set(command.name, command);
    console.log(`Prefix komut yüklendi: ${process.env.PREFIX || '!'}${command.name}`);
  } else {
    console.warn(`${filePath} komutunda name veya execute eksik!`);
  }
}
(async () => {
  try {
    console.log('Slash komutlar yükleniyor...');
    
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: slashCommands }
    );
    
    console.log('Slash komutlar başarıyla kaydedildi!');
  } catch (error) {
    console.error('Slash komutları yüklerken bir hata oluştu:', error);
  }
})();

client.login(process.env.BOT_TOKEN);
