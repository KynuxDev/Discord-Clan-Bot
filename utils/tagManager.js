const { Routes } = require('discord.js');
const db = require('../db');

async function checkUserTag(client, member, silent = true) {
  try {
    const result = {
      hasTag: false,
      roleChanged: false,
      error: null
    };
    
    const tagRole = member.guild.roles.cache.get(process.env.TAG_ROLE_ID);
    if (!tagRole) {
      console.error('Tag rolü bulunamadı!');
      result.error = 'Tag rolü bulunamadı';
      return result;
    }
    
    try {
      const userData = await client.rest.get(Routes.user(member.id));
      
      if (userData.clan && userData.clan.tag) {
        const targetTag = process.env.TARGET_TAG;
        
        if (userData.clan.tag === targetTag) {
          result.hasTag = true;
          
          if (!member.roles.cache.has(tagRole.id)) {
            await member.roles.add(tagRole.id);
            result.roleChanged = true;
            
            db.add('stats.roleAdded', 1);
            
            if (!silent) {
              client.sendLogEmbed({
                title: '✅ Tag Rolü Eklendi',
                description: `${member.user.tag} kullanıcısı **${targetTag}** tagına sahip olduğu için <@&${tagRole.id}> rolü verildi.`,
                color: client.colors.SUCCESS,
                thumbnail: member.user.displayAvatarURL({ dynamic: true }),
                fields: [
                  { name: '🏷️ Kullanıcı', value: `<@${member.id}>`, inline: true },
                  { name: '🔖 Tag', value: targetTag, inline: true },
                  { name: '⏰ İşlem Zamanı', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                ]
              });
            }
            
            console.log(`${member.user.tag} kullanıcısına ${tagRole.name} rolü verildi.`);
          }
        } else {
          if (member.roles.cache.has(tagRole.id)) {
            await member.roles.remove(tagRole.id);
            result.roleChanged = true;
            
            db.add('stats.roleRemoved', 1);
            
            if (!silent) {
              client.sendLogEmbed({
                title: '❌ Tag Rolü Kaldırıldı',
                description: `${member.user.tag} kullanıcısının farklı bir tag'i olduğu için (${userData.clan.tag}) <@&${tagRole.id}> rolü alındı.`,
                color: client.colors.WARNING,
                thumbnail: member.user.displayAvatarURL({ dynamic: true }),
                fields: [
                  { name: '🏷️ Kullanıcı', value: `<@${member.id}>`, inline: true },
                  { name: '🔖 Mevcut Tag', value: userData.clan.tag, inline: true },
                  { name: '🎯 Hedef Tag', value: targetTag, inline: true },
                  { name: '⏰ İşlem Zamanı', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                ]
              });
            }
            
            console.log(`${member.user.tag} kullanıcısından ${tagRole.name} rolü alındı.`);
          }
        }
      } else {
        if (member.roles.cache.has(tagRole.id)) {
          await member.roles.remove(tagRole.id);
          result.roleChanged = true;
          
          db.add('stats.roleRemoved', 1);
          
          if (!silent) {
            client.sendLogEmbed({
              title: '❌ Tag Rolü Kaldırıldı',
              description: `${member.user.tag} kullanıcısının clan tag'i bulunmadığı için <@&${tagRole.id}> rolü alındı.`,
              color: client.colors.WARNING,
              thumbnail: member.user.displayAvatarURL({ dynamic: true }),
              fields: [
                { name: '🏷️ Kullanıcı', value: `<@${member.id}>`, inline: true },
                { name: '⏰ İşlem Zamanı', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
              ]
            });
          }
          
          console.log(`${member.user.tag} kullanıcısından ${tagRole.name} rolü alındı (tag yok).`);
        }
      }
    } catch (apiError) {
      console.error(`API hatası (${member.user.tag}):`, apiError);
      result.error = `API hatası: ${apiError.message}`;
    }
    
    return result;
  } catch (error) {
    console.error(`Kullanıcı tag kontrolü sırasında bir hata oluştu (${member.user.tag}):`, error);
    client.sendErrorLog(`Kullanıcı tag kontrolü sırasında bir hata oluştu (${member.user.tag})`, error);
    return { hasTag: false, roleChanged: false, error: error.message };
  }
}

async function performFullCheck(client) {
  try {
    if (!client.guild) return;
    
    console.log(`${client.guild.name} sunucusunda periyodik tag kontrolü başlatılıyor...`);
    
    db.add('stats.totalChecks', 1);
    db.set('stats.lastCheck', Date.now());
    
    await client.guild.members.fetch();
    
    let taggedUsers = 0;
    let untaggedUsers = 0;
    let changedRoles = 0;
    
    for (const [memberId, member] of client.guild.members.cache) {
      if (member.user.bot) continue;
      
      const result = await checkUserTag(client, member, true); 
      
      if (result.hasTag) {
        taggedUsers++;
        if (result.roleChanged) changedRoles++;
      } else {
        untaggedUsers++;
        if (result.roleChanged) changedRoles++;
      }
    }
    
    db.set('stats.taggedUsers', taggedUsers);
    db.set('stats.untaggedUsers', untaggedUsers);
    if (changedRoles > 0) {
      client.sendLogEmbed({
        title: '🔄 Periyodik Kontrol Tamamlandı',
        description: `10 saniyelik kontrol tamamlandı. ${changedRoles} üyenin rol durumu güncellendi.`,
        color: client.colors.INFO,
        fields: [
          { name: '👥 Toplam Kontrol Edilen', value: `${taggedUsers + untaggedUsers}`, inline: true },
          { name: '✅ Taglı Üyeler', value: `${taggedUsers}`, inline: true },
          { name: '❌ Tagsız Üyeler', value: `${untaggedUsers}`, inline: true },
          { name: '🔄 Rol Değişiklikleri', value: `${changedRoles}`, inline: true },
          { name: '⏰ Kontrol Zamanı', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
        ]
      });
    }
    
    console.log(`Periyodik tag kontrolü tamamlandı! Taglı: ${taggedUsers}, Tagsız: ${untaggedUsers}, Değişen: ${changedRoles}`);
  } catch (error) {
    console.error('Periyodik tag kontrolü sırasında bir hata oluştu:', error);
    client.sendErrorLog('Periyodik tag kontrolü sırasında bir hata oluştu', error);
  }
}

module.exports = {
  checkUserTag,
  performFullCheck
};
