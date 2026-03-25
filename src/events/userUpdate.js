import { checkSingleMember } from '../services/tagChecker.js';

export const name = 'userUpdate';
export const once = false;

export async function execute(oldUser, newUser, client) {
  try {
    for (const [guildId, guild] of client.guilds.cache) {
      const member = await guild.members.fetch(newUser.id).catch(() => null);
      if (!member) continue;

      await checkSingleMember(client, member);
    }
  } catch (error) {
    console.error(`[UserUpdate] ${newUser.tag} kontrolü hatası:`, error.message);
  }
}
