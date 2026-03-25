import { checkSingleMember } from '../services/tagChecker.js';
import { sendWelcome } from '../services/welcomer.js';

export const name = 'guildMemberAdd';
export const once = false;

export async function execute(member, client) {
  if (member.user.bot) return;

  try {
    const result = await checkSingleMember(client, member);
    await sendWelcome(client, member, result.hasTag, result.tagName);
  } catch (error) {
    console.error(`[GuildMemberAdd] ${member.user.tag} kontrolü hatası:`, error.message);
  }
}
