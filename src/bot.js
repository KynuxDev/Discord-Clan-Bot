import { Client, Collection, GatewayIntentBits } from 'discord.js';

export function createClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.commands = new Collection();
  client.startedAt = Date.now();

  return client;
}
