<div align="center">

<!-- BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:5865F2,100:57F287&height=220&section=header&text=Discord%20Clan%20Bot&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Smart%20Tag%20Tracking%20%26%20Automatic%20Role%20Management&descAlignY=55&descSize=18" width="100%" alt="Discord Clan Bot Banner"/>

<br/>

<!-- BADGES -->
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-docker-setup)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.1.0-brightgreen?style=for-the-badge)](#)

<br/>

[![Stars](https://img.shields.io/github/stars/KynuxDev/Discord-Clan-Bot?style=social)](https://github.com/KynuxDev/Discord-Clan-Bot/stargazers)
[![Forks](https://img.shields.io/github/forks/KynuxDev/Discord-Clan-Bot?style=social)](https://github.com/KynuxDev/Discord-Clan-Bot/network/members)
[![Issues](https://img.shields.io/github/issues/KynuxDev/Discord-Clan-Bot?style=social)](https://github.com/KynuxDev/Discord-Clan-Bot/issues)

<br/>

**A modern Discord bot that automatically tracks clan tags, manages roles intelligently,**
**offers a streak system, and provides a live dashboard.**

[🇹🇷 Türkçe](README.md) · [📖 Documentation](#-setup) · [🐛 Bug Report](https://github.com/KynuxDev/Discord-Clan-Bot/issues/new?template=bug_report.md) · [💡 Feature Request](https://github.com/KynuxDev/Discord-Clan-Bot/issues/new?template=feature_request.md)

</div>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🏷️ Smart Tag System
Event-driven + periodic batch checking tracks clan tags in real time. Define up to **25 different** tag-role mappings per server.

</td>
<td width="50%">

### 🔥 Streak Tracking
Tracks how long users have been wearing a tag. Reward your most loyal members with streak leaderboards.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Live Dashboard
View tag statistics, member ratios, and top streaks in a single channel with an auto-updating embed dashboard.

</td>
<td width="50%">

### 🌍 Multi-Language & Multi-Guild
Turkish and English language support. Each server runs with independent settings — one bot, unlimited servers.

</td>
</tr>
<tr>
<td width="50%">

### 🛡️ Security Requirements
Filter bot accounts and freshly created accounts with minimum account age and server membership duration requirements.

</td>
<td width="50%">

### 📋 Audit Log
Logs all admin actions. Who did what, and when — full transparency.

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
Discord-Clan-Bot/
├── src/
│   ├── commands/          # 15+ Slash commands
│   │   ├── tag/           #   Tag CRUD operations
│   │   ├── audit.js       #   Admin audit log
│   │   ├── streak.js      #   Streak info
│   │   ├── istatistik.js  #   Detailed statistics
│   │   ├── siralama.js    #   Leaderboard
│   │   └── ...
│   ├── database/
│   │   ├── models/        # 7 database models
│   │   └── migrations/    # Automatic schema migrations
│   ├── events/            # Discord event handlers
│   ├── services/          # Business logic layer
│   │   ├── tagChecker.js  #   Smart tag checking engine
│   │   ├── scheduler.js   #   Scheduling service
│   │   ├── dashboard.js   #   Live dashboard
│   │   ├── welcomer.js    #   Welcome system
│   │   └── logger.js      #   Logging service
│   ├── locales/           # i18n (TR/EN)
│   ├── utils/             # Helper functions
│   └── index.js           # Entry point
├── scripts/               # Migration tools
├── Dockerfile             # Container support
├── docker-compose.yml     # One-command deploy
└── package.json
```

---

## 🚀 Setup

### Requirements

- **Node.js** v18.0.0 or higher
- **Discord Bot Token** ([Developer Portal](https://discord.com/developers/applications))

### Quick Start

```bash
# 1. Clone
git clone https://github.com/KynuxDev/Discord-Clan-Bot.git
cd Discord-Clan-Bot

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env:
#   BOT_TOKEN=your_discord_bot_token
#   DEV_GUILD_ID=test_guild_id  (optional)

# 4. Start the bot
npm start
```

### 🐳 Docker Setup

```bash
# With Docker Compose (recommended)
docker compose up -d

# Or with Docker directly
docker build -t clan-bot .
docker run -d --name clan-bot --env-file .env -v ./data:/app/data clan-bot
```

### Discord Bot Configuration

1. [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**
2. **Bot** tab → Copy Token → Paste into `.env`
3. **Privileged Gateway Intents** → ✅ `SERVER MEMBERS INTENT`
4. **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Manage Roles`, `Send Messages`, `View Channels`
5. Add the bot to your server using the generated URL

### First Use

```
1. /ayarlar log-kanal #bot-log          → Set log channel
2. /tag-ekle OHIO @ClanMember           → Add first tag mapping
3. /ayarlar hosgeldin-kanal #general    → Set welcome channel
4. /ayarlar hosgeldin aç                → Enable welcome messages
5. /ayarlar dashboard #clan-dashboard   → Create live dashboard
6. The bot starts working automatically! 🎉
```

---

## ⚙️ Technical Details

| Feature | Detail |
|:--------|:-------|
| **Runtime** | Node.js 18+ (ESM Modules) |
| **Framework** | discord.js v14 |
| **Database** | SQLite (sql.js) — zero configuration |
| **Architecture** | Event-driven + Service Layer |
| **Tag Checking** | Batch processing + rate limit protection |
| **i18n** | Turkish & English |
| **Migrations** | Automatic schema versioning |
| **Shutdown** | Graceful — zero data loss |

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. **Fork** this repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'feat: add awesome feature'`)
4. Push to your branch (`git push origin feature/awesome-feature`)
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for details.

---

## 💖 Support

If you like this project, don't forget to give it a ⭐!

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=KynuxDev/Discord-Clan-Bot&type=Date)](https://star-history.com/#KynuxDev/Discord-Clan-Bot&Date)

Made with ❤️ by **[KynuxDev](https://github.com/KynuxDev)**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:5865F2,100:57F287&height=100&section=footer" width="100%" alt="Footer"/>

</div>
