# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-03-25

### Added
- **Streak System** — Track how long users have been wearing a clan tag
- **Live Dashboard** — Auto-updating embed with stats, tags, and top streaks
- **Audit Log** — Records all admin actions with `/audit` command
- **i18n Support** — Turkish and English language options per server
- **Security Requirements** — Minimum account age and server membership duration
- **Docker Support** — Dockerfile and docker-compose for easy deployment
- Database migration system (automatic schema versioning)

### Changed
- Upgraded from v2.0 architecture with new service layer
- Added `002-v21-features` migration for new tables

## [2.0.0] - 2025-03-20

### Added
- **Multi-Tag Support** — Up to 25 tag-role mappings per server
- **Multi-Guild** — Independent operation across unlimited servers
- **15 Slash Commands** — Full command suite for management
- **SQLite Database** — Replaced JSON file storage
- **Welcome System** — Separate embeds for tagged/untagged members
- **Leaderboard** — Top 10 users by tag duration
- **Rate Limit Protection** — Batch processing with automatic retry
- **Graceful Shutdown** — Clean exit with zero data loss
- ESM module system

### Changed
- Complete rewrite from v1.0
- Switched from 10-second brute-force to smart batch checking
- Migrated from CommonJS to ESM modules

## [1.0.0] - 2025-01-01

### Added
- Initial release
- Single tag tracking
- Single guild support
- Basic role management
