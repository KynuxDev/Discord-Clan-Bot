const { checkUserTag } = require('../utils/tagManager');
const db = require('../db');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    try {
      if (member.guild.id !== process.env.GUILD_ID) return;
      
      const result = await checkUserTag(client, member, false);
      
      db.add('stats.totalMembersJoined', 1);
      
      if (result.hasTag) {
        client.sendLogEmbed({
          title: '👋 Yeni Üye (Taglı)',
          description: `${member.user.tag} sunucuya katıldı ve **${process.env.TARGET_TAG}** tagına sahip!`,
          color: client.colors.SUCCESS,
          thumbnail: member.user.displayAvatarURL({ dynamic: true }),
          fields: [
            { name: '🏷️ Kullanıcı', value: `<@${member.id}>`, inline: true },
            { name: '🔖 Tag', value: process.env.TARGET_TAG, inline: true },
            { name: '📅 Katılma Tarihi', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
          ]
        });
      } else {
        client.sendLogEmbed({
          title: '👋 Yeni Üye (Tagsız)',
          description: `${member.user.tag} sunucuya katıldı fakat tagı bulunmuyor.`,
          color: client.colors.INFO,
          thumbnail: member.user.displayAvatarURL({ dynamic: true }),
          fields: [
            { name: '🏷️ Kullanıcı', value: `<@${member.id}>`, inline: true },
            { name: '📅 Katılma Tarihi', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
          ]
        });
      }
    } catch (error) {
      console.error(`Üye katılımı kontrolü sırasında bir hata oluştu (${member.user.tag}):`, error);
      client.sendErrorLog(`Üye katılımı kontrolü sırasında bir hata oluştu (${member.user.tag})`, error);
    }
  }
};
