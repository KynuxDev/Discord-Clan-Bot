const { EmbedBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
  name: 'stats',
  description: 'Tag sistemi hakkında istatistikler gösterir.',
  
  async execute(message, args, client) {
    const loadingMessage = await message.channel.send('İstatistikler alınıyor...');
    
    try {
      const stats = db.get('stats') || {
        totalChecks: 0,
        roleAdded: 0,
        roleRemoved: 0,
        lastCheck: null,
        taggedUsers: 0,
        untaggedUsers: 0,
        totalMembersJoined: 0
      };
      
      const commandStats = db.get('commandStats') || {};
      
      let topCommands = [];
      for (const cmd in commandStats) {
        topCommands.push({
          name: cmd.startsWith('prefix_') ? `!${cmd.slice(7)}` : `/${cmd}`,
          uses: commandStats[cmd].uses
        });
      }
      
      topCommands.sort((a, b) => b.uses - a.uses);
      topCommands = topCommands.slice(0, 3);
      
      const statsEmbed = new EmbedBuilder()
        .setTitle('📊 Tag Sistemi İstatistikleri')
        .setColor(client.colors.INFO)
        .setDescription(`**${process.env.TARGET_TAG}** tagını kontrol eden bot istatistikleri.`)
        .addFields(
          { name: '👥 Toplam Üye', value: `${stats.taggedUsers + stats.untaggedUsers}`, inline: true },
          { name: '✅ Taglı Üyeler', value: `${stats.taggedUsers}`, inline: true },
          { name: '❌ Tagsız Üyeler', value: `${stats.untaggedUsers}`, inline: true },
          
          { name: '🔍 Toplam Tarama', value: `${stats.totalChecks}`, inline: true },
          { name: '➕ Rol Ekleme', value: `${stats.roleAdded}`, inline: true },
          { name: '➖ Rol Çıkarma', value: `${stats.roleRemoved}`, inline: true },
          
          { name: '📈 Sunucuya Katılan Üye', value: `${stats.totalMembersJoined || 0}`, inline: true },
          { name: '⏰ Son Kontrol', value: stats.lastCheck ? `<t:${Math.floor(stats.lastCheck / 1000)}:R>` : 'Henüz yok', inline: true },
          { name: '🎯 Kontrol Edilen Tag', value: `${process.env.TARGET_TAG}`, inline: true }
        )
        .setFooter({ text: `[KynuxCloud Tag Kontrol Bot](https://github.com/kynuxdev) • v1.0` })
        .setTimestamp();
      
      if (topCommands.length > 0) {
        let commandsText = '';
        topCommands.forEach((cmd, index) => {
          commandsText += `**${index + 1}.** ${cmd.name}: ${cmd.uses} kullanım\n`;
        });
        
        statsEmbed.addFields({ name: '🔝 En Çok Kullanılan Komutlar', value: commandsText });
      }
      
      const taglıYüzde = stats.taggedUsers > 0 ? 
        Math.round((stats.taggedUsers / (stats.taggedUsers + stats.untaggedUsers)) * 100) : 0;
      
      const progressBar = generateProgressBar(taglıYüzde);
      
      statsEmbed.addFields({ 
        name: '📊 Taglı Üye Oranı', 
        value: `\`\`\`\n${progressBar} ${taglıYüzde}%\n\`\`\``,
        inline: false
      });
      
      await loadingMessage.edit({ content: null, embeds: [statsEmbed] });
      
    } catch (error) {
      console.error('İstatistik komutu hatası:', error);
      await loadingMessage.edit('İstatistikler alınırken bir hata oluştu!');
      
      client.sendErrorLog('İstatistik komutu hatası', error);
    }
  }
};

function generateProgressBar(percent) {
  const filledChar = '█';
  const emptyChar = '░';
  const totalChars = 20;
  
  const filledCount = Math.round((percent / 100) * totalChars);
  const emptyCount = totalChars - filledCount;
  
  return filledChar.repeat(filledCount) + emptyChar.repeat(emptyCount);
}
