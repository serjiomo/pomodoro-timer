# Pomodoro Focus Timer

[![Build and Release](https://github.com/OWNER/pomodoro-focus/workflows/Build%20and%20Release/badge.svg)](https://github.com/OWNER/pomodoro-focus/actions)
[![CI](https://github.com/OWNER/pomodoro-focus/workflows/CI/badge.svg)](https://github.com/OWNER/pomodoro-focus/actions)

A clean, modern Pomodoro timer web application with optional Linux desktop packaging.

## 🌟 Features

- **Three Timer Modes**: Focus, Short Break, Long Break
- **Custom Durations**: Adjust timer lengths (1-120 minutes)
- **Progress Tracking**: Daily statistics and session history
- **Sound Notifications**: Pleasant chime when timer completes
- **Local Storage**: All data persists automatically
- **Beautiful UI**: Smooth animations and color-coded modes
- **System Tray**: Desktop app minimizes to tray (Linux)

## 🚀 Quick Start (Web App)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🖥️ Linux Desktop App

Package the app as a native Linux desktop application with system tray support.

### Supported Formats
- **.deb** - Debian/Ubuntu
- **AppImage** - Universal Linux (no install required)
- **.rpm** - Fedora/RHEL/openSUSE

### Build Desktop App

```bash
# 1. Build the web app
npm run build

# 2. Setup desktop packaging
cd desktop
npm install
node generate-icon.js  # Create placeholder icon

# 3. Build packages
chmod +x build.sh
./build.sh              # Build all formats
./build.sh deb          # Debian package only
./build.sh appimage     # AppImage only
./build.sh rpm          # RPM package only
```

Packages will be created in the `release/` directory.

### Install Desktop App

**Debian/Ubuntu:**
```bash
sudo dpkg -i release/pomodoro-focus_1.0.0_amd64.deb
```

**Fedora:**
```bash
sudo rpm -i release/pomodoro-focus-1.0.0.x86_64.rpm
```

**AppImage:**
```bash
chmod +x release/Pomodoro\ Focus-1.0.0-x86_64.AppImage
./release/Pomodoro\ Focus-1.0.0-x86_64.AppImage
```

### Run in Development Mode

```bash
cd desktop
npm start
```

## 📖 Documentation

- **[desktop/QUICKSTART.md](desktop/QUICKSTART.md)** - Quick build and install guide
- **[desktop/README.md](desktop/README.md)** - Complete desktop app documentation
- **[desktop/ICON.md](desktop/ICON.md)** - Custom icon instructions

## 🎨 Customization

### Timer Settings
- Focus: 1-120 minutes (default: 25)
- Short Break: 1-30 minutes (default: 5)
- Long Break: 1-60 minutes (default: 15)

### Sound Notifications
- Toggle sound on/off with the 🔔/🔕 button
- Sound preference saved in localStorage
- Pleasant three-tone chime (C5 → E5 → G5)

### Desktop App Features
- System tray integration
- Minimize to background
- Custom window icon
- Native menu bar (auto-hidden)

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 8
- **Desktop**: Electron 28
- **Packaging**: electron-builder 24

## 📦 Project Structure

```
pomodoro-focus/
├── src/                    # React source code
│   ├── App.tsx            # Main application
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── dist/                   # Built web app
├── desktop/               # Linux desktop packaging
│   ├── main.js           # Electron main process
│   ├── preload.js        # Preload script
│   ├── package.json      # Electron dependencies
│   ├── build.sh          # Build script
│   └── README.md         # Desktop docs
└── release/              # Built desktop packages
```

## 🔧 Requirements

### Web App
- Node.js 24+
- Modern web browser

### Desktop App
- Node.js 24+
- Linux build tools (GTK3, libnotify)
- 150 MB disk space

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## 🙏 Acknowledgments

Built with modern web technologies for a delightful productivity experience.

## 🚀 CI/CD & Releases

This project uses GitHub Actions for automated building and releasing:

- **CI**: Runs on pull requests to validate builds
- **Release**: Automatically builds and publishes when version tags are pushed

### Creating a Release

```bash
# Tag a new version
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions will automatically:
1. Build the web app
2. Build Linux AppImage package
3. Create a GitHub release with the AppImage artifact

See [`.github/WORKFLOWS.md`](.github/WORKFLOWS.md) for detailed workflow documentation.

---

**Enjoy your focused productivity! 🍅**
