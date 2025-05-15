const db = require('../db');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;
    
    const prefix = process.env.PREFIX || '!';
    
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.prefixCommands.get(commandName);
    
    if (!command) return;
    
    try {
      await command.execute(message, args, client);
      
      const commandStats = db.get('commandStats') || {};
      const cmdKey = `prefix_${commandName}`;
      
      if (!commandStats[cmdKey]) {
        commandStats[cmdKey] = { uses: 0, lastUsed: null };
      }
      
      commandStats[cmdKey].uses++;
      commandStats[cmdKey].lastUsed = Date.now();
      
      db.set('commandStats', commandStats);
      
    } catch (error) {
      console.error(`Prefix komut hatası (${commandName}):`, error);
      message.reply('Bu komutu çalıştırırken bir hata oluştu!').catch(console.error);
      client.sendErrorLog(`Prefix komut hatası (${commandName})`, error);
    }
  }
};
