const db = require('../db');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    
    if (!command) return;
    
    try {
      await command.execute(interaction, client);
      
      const commandStats = db.get('commandStats') || {};
      const cmdName = interaction.commandName;
      
      if (!commandStats[cmdName]) {
        commandStats[cmdName] = { uses: 0, lastUsed: null };
      }
      
      commandStats[cmdName].uses++;
      commandStats[cmdName].lastUsed = Date.now();
      
      db.set('commandStats', commandStats);
      
    } catch (error) {
      console.error(`Slash komut hatası (${interaction.commandName}):`, error);
      
      const errorMessage = {
        content: 'Bu komutu işlerken bir hata oluştu!',
        ephemeral: true
      };
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
      
      client.sendErrorLog(`Slash komut hatası (${interaction.commandName})`, error);
    }
  }
};
