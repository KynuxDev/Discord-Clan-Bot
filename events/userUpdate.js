const { checkUserTag } = require('../utils/tagManager');

module.exports = {
  name: 'userUpdate',
  async execute(oldUser, newUser, client) {
    try {
      if (!client.guild) return;
      
      const member = await client.guild.members.fetch(newUser.id).catch(() => null);
      if (!member) return;
      
      await checkUserTag(client, member, false);
    } catch (error) {
      console.error(`Kullanıcı güncellemesi sırasında bir hata oluştu (${newUser.tag}):`, error);
      client.sendErrorLog(`Kullanıcı güncellemesi sırasında bir hata oluştu (${newUser.tag})`, error);
    }
  }
};
