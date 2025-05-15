<h1 align="center">Discord Clan Tag Role Bot</h1>

<p align="center">
  <img src="https://img.shields.io/badge/node.js-v18+-green.svg" alt="Node.js Version">
  <img src="https://img.shields.io/badge/discord.js-v14-blue.svg" alt="Discord.js Version">
  <img src="https://img.shields.io/badge/license-All%20Rights%20Reserved-red.svg" alt="License">
  <a href="README.md"><img src="https://img.shields.io/badge/Türkçe-Dokümantasyon-red.svg" alt="Turkish Documentation"></a>
</p>

<p align="center">
  <b>A modern Discord bot that detects users with Discord's new clan tag feature and automatically assigns them roles.</b>
</p>
<img src="https://i.postimg.cc/xT5bnVXG/image.png" alt="Görsel 1">
<img src="https://i.postimg.cc/d0k7274n/image.png" alt="Görsel 2">
## 📋 Features

- ✅ **Automatic Tag Checking**: Checks users' clan tags every 10 seconds
- 🔄 **Real-time Updates**: Automatically adds/removes roles when users add/change their tags
- 🔔 **Detailed Notifications**: Reports all actions to a log channel using modern embeds
- 📊 **Statistics System**: Visualizes role changes, tagged member ratios, and other data
- 💬 **Dual Command System**: Supports both slash commands (`/stats`) and prefix commands (`!stats`)
- 💾 **Database Integration**: Permanently stores all statistics
- 🔒 **Secure**: Protects sensitive data by storing it in the .env file

## 🚀 Installation

### Requirements

- Node.js (v18.0.0 or higher)
- Discord Bot Token

### Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/kynuxdev/discord-tag-bot.git
   cd discord-tag-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the `.env.example` file to `.env` and add the necessary information:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file:
   ```
   BOT_TOKEN=your_discord_bot_token
   CLIENT_ID=your_client_id
   GUILD_ID=your_server_id
   TAG_ROLE_ID=role_id_to_assign
   TARGET_TAG=OHIO
   LOG_CHANNEL_ID=log_channel_id
   PREFIX=!
   ```

5. Start the bot:
   ```bash
   node index.js
   ```

## 🤖 Creating a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and enter a name for your bot
3. Go to the "Bot" tab and click "Add Bot"
4. Create a token with "Reset Token" and copy it
5. Enable the following permissions in bot settings:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
6. In the "OAuth2 > URL Generator" section:
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Manage Roles`, `Read Messages/View Channels`, `Send Messages`
7. Add the bot to your server using the generated URL

## 📈 Statistics

The bot tracks the following statistics, which you can view with the `/stats` or `!stats` commands:

- Number of tagged and untagged members
- Total number of checks
- Role addition/removal counts
- Number of members who joined the server
- Tagged member ratio (with visual graph)
- Most used commands

## 🔧 Customization

To change the target tag, update the `TARGET_TAG` value in the `.env` file. Many other settings can be customized directly in the code.

## 🌎 Language Support

This bot was originally developed for Turkish users, but you can use it internationally with these English instructions. If you want to translate the bot interface and commands to a different language, you can adapt the relevant files to your language.

## 📝 Notes

- Since Discord's clan tag feature is new, there may be changes in the API usage. In this case, the code may need to be updated.
- Make sure the bot has a role with "Manage Roles" permission for it to work most efficiently.
- The bot interface is currently in Turkish. You can translate the messages in the code files if needed.

## 📄 License

All Rights Reserved &copy; 2025 [KynuxDev](https://github.com/kynuxdev)

This code and associated documentation files cannot be used, copied, modified, distributed, or sold without the express permission of the software owner. For more information, please see the `LICENSE` file.

---

*Note: This bot was originally developed for Turkish users. If you need to use it in another language, you can modify the code to suit your needs or use translation tools to understand the interface.*
