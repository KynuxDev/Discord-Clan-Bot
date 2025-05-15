const { EmbedBuilder } = require('discord.js');

const COLORS = {
  SUCCESS: 0x00FF00, // Yeşil
  ERROR: 0xFF0000,   // Kırmızı
  INFO: 0x0099FF,    // Mavi
  WARNING: 0xFFAA00  // Turuncu
};

function sendLogEmbed(client, options) {
  if (!client.logChannel) return;
  
  const embed = new EmbedBuilder()
    .setTitle(options.title || 'Log Mesajı')
    .setColor(options.color || COLORS.INFO)
    .setDescription(options.description || '')
    .setTimestamp();
  
  if (options.thumbnail) {
    embed.setThumbnail(options.thumbnail);
  }
  
  if (options.fields && Array.isArray(options.fields)) {
    options.fields.forEach(field => {
      embed.addFields({ name: field.name, value: field.value, inline: !!field.inline });
    });
  }
  
  if (options.footer) {
    embed.setFooter({ text: options.footer });
  } else {
    embed.setFooter({ text: `Discord Tag Rol Botu • v1.0` });
  }
  
  client.logChannel.send({ embeds: [embed] }).catch(error => {
    console.error('Log mesajı gönderilirken hata oluştu:', error);
  });
}

// Hata logları için özel fonksiyon
function sendErrorLog(client, title, error) {
  if (!client.logChannel) return;
  
  const embed = new EmbedBuilder()
    .setTitle(`⚠️ ${title}`)
    .setColor(COLORS.ERROR)
    .setDescription(`\`\`\`js\n${error.message || error}\n\`\`\``)
    .addFields(
      { name: '⏰ Hata Zamanı', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
    )
    .setFooter({ text: `Discord Tag Rol Botu • v1.0 • Hata Raporu` })
    .setTimestamp();
  
  client.logChannel.send({ embeds: [embed] }).catch(console.error);
}

function setupLogger(client) {
  client.colors = COLORS;
  
  client.sendLogEmbed = (options) => sendLogEmbed(client, options);
  client.sendErrorLog = (title, error) => sendErrorLog(client, title, error);
  
  return client;
}

module.exports = {
  COLORS,
  sendLogEmbed,
  sendErrorLog,
  setupLogger
};
