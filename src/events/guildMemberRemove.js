import { MemberModel } from '../database/models/member.js';
import { TagHistoryModel } from '../database/models/tagHistory.js';

export const name = 'guildMemberRemove';
export const once = false;

export async function execute(member, client) {
  if (member.user.bot) return;

  try {
    TagHistoryModel.closeActiveEntries(member.guild.id, member.id);
    MemberModel.removeByGuildAndUser(member.guild.id, member.id);
  } catch (error) {
    console.error(`[GuildMemberRemove] ${member.user.tag} temizlik hatası:`, error.message);
  }
}
