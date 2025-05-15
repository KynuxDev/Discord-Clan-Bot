const { ActivityType } = require('discord.js');
const db = require('../db');
const { performFullCheck } = require('../utils/tagManager');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    
    // Bot durumunu ayarla
    client.user.setPresence({
      activities: [{ name: 'OHIO IS ALWAYS THE BEST', type: ActivityType.Watching }],
      status: 'online',
    });
    
    try {
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      if (!guild) {
        console.error('Belirtilen sunucu bulunamadı!');
        return;
      }
      
      const logChannel = guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
      if (!logChannel) {
        console.error('Belirtilen log kanalı bulunamadı!');
      } else {
        client.logChannel = logChannel;
        
        if (!db.has('stats')) {
          db.set('stats', {
            totalChecks: 0,
            roleAdded: 0,
            roleRemoved: 0,
            lastCheck: null,
            taggedUsers: 0,
            untaggedUsers: 0
          });
        }
        
        client.sendLogEmbed({
          title: '📡 Tag Bot Aktif',
          description: `Bot aktif ve düzgün çalışıyor.\nHedef tag: **${process.env.TARGET_TAG}**`,
          color: client.colors.INFO,
          fields: [
            { name: '⏰ Kontrol Sıklığı', value: '10 saniye', inline: true },
            { name: '📊 Kontrol Edilen Sunucu', value: guild.name, inline: true },
            { name: '📈 İstatistik', value: 'Kullanmak için: `/stats` veya `!stats`', inline: true }
          ]
        });
      }
      
      client.guild = guild;
      
      await performFullCheck(client);
      
      setInterval(() => performFullCheck(client), 10000);
      
    } catch (error) {
      console.error('Başlangıç işlemleri sırasında bir hata oluştu:', error);
      client.sendErrorLog('Başlangıç işlemleri sırasında bir hata oluştu', error);
    }
  }
};
