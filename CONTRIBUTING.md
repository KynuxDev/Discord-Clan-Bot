# Contributing to Discord Clan Bot

First off, thanks for taking the time to contribute! 🎉

## How Can I Contribute?

### Reporting Bugs

- Use the [Bug Report](https://github.com/KynuxDev/Discord-Clan-Bot/issues/new?template=bug_report.md) template
- Include your Node.js version, OS, and steps to reproduce
- Add relevant console logs or screenshots

### Suggesting Features

- Use the [Feature Request](https://github.com/KynuxDev/Discord-Clan-Bot/issues/new?template=feature_request.md) template
- Explain why this feature would be useful
- Consider how it fits within the existing architecture

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Follow the existing code style (ESM modules, async/await)
3. Add appropriate comments for complex logic
4. Test your changes thoroughly with a real Discord bot
5. Update documentation if you changed any commands or features
6. Submit your PR using the pull request template

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/Discord-Clan-Bot.git
cd Discord-Clan-Bot
npm install
cp .env.example .env
# Add your test bot token to .env
# Set DEV_GUILD_ID for instant command registration
npm start
```

## Code Style

- **ESM modules** — use `import`/`export`, not `require`
- **Async/await** — no raw Promise chains
- **Descriptive naming** — `checkSingleMember` not `chk`
- **Error handling** — always catch and log errors gracefully
- Run `npm run lint` before committing

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new streak leaderboard command
fix: handle rate limit on batch check
docs: update README with Docker instructions
refactor: extract tag validation into utility
```

## Project Structure

```
src/
├── commands/      → Slash command definitions
├── database/      → SQLite models & migrations
├── events/        → Discord event handlers
├── services/      → Core business logic
├── locales/       → i18n translation files
└── utils/         → Shared helpers
```

## Questions?

Feel free to open an issue or reach out to [@KynuxDev](https://github.com/KynuxDev).
