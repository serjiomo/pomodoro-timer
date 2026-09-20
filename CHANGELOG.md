# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Pomodoro timer with focus, short break, and long break modes
- Customizable timer durations
- Daily statistics tracking
- Sound notifications with mute toggle
- Local storage persistence
- Linux desktop packaging (deb, AppImage, rpm)
- GitHub Actions CI/CD workflows
- System tray integration for desktop app

### Changed
- N/A

### Fixed
- N/A

## [1.0.0] - 2024-01-XX

### Added
- 🎯 Focus mode with customizable duration (default: 25 minutes)
- ☕ Short break mode (default: 5 minutes)
- 🌿 Long break mode (default: 15 minutes)
- 📊 Daily statistics tracking (sessions, minutes, progress)
- 🔔 Sound notifications with three-tone chime
- 🔕 Sound mute/unmute toggle
- ⚙️ Custom duration settings (1-120 minutes)
- 💾 Local storage for settings and statistics
- 🎨 Beautiful UI with color-coded modes
- 📱 Responsive design
- 🖥️ Linux desktop app with Electron
- 📦 System tray integration
- 🚀 GitHub Actions for automated builds and releases
- 📝 Comprehensive documentation

### Features
- Circular progress indicator
- Start, pause, resume, and reset controls
- Mode switching with smooth transitions
- Real-time document title updates
- Today's focus statistics dashboard
- Progress bar toward daily goal
- Session history tracking

### Technical
- Built with React 19 and TypeScript
- Styled with Tailwind CSS 4
- Bundled with Vite 8
- Desktop app powered by Electron 28
- Automated packaging with electron-builder
- CI/CD with GitHub Actions

---

## Release Notes Template

When creating a new release, use this template:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Modified feature description

### Fixed
- Bug fix description

### Removed
- Removed feature description
```

## Versioning

- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backwards compatible
- **Patch** (0.0.X): Bug fixes, backwards compatible

## Release Process

1. Update CHANGELOG.md with changes
2. Run `./scripts/release.sh [major|minor|patch]`
3. Push changes: `git push origin main --tags`
4. GitHub Actions will build and release automatically
