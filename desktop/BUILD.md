# 🍅 Linux Desktop Packaging - Complete Setup

## ✅ What's Ready

Your Pomodoro Focus app is fully configured for Linux desktop packaging with:

- **Electron main process** (`desktop/main.js`) - Window management, system tray
- **Preload script** (`desktop/preload.js`) - Secure context bridge
- **Build configuration** (`desktop/electron-builder.config.js`) - Package settings
- **Build scripts** - Automated packaging for .deb, AppImage, .rpm
- **Icon generator** - Creates placeholder app icon
- **Complete documentation** - Installation and usage guides

## 🚀 Run Linux Packaging

### Option 1: Automated Script (Recommended)

On your Linux system, run:

```bash
cd desktop
chmod +x package-linux.sh
./package-linux.sh
```

This will:
1. Check prerequisites (Node.js, npm)
2. Install system dependencies (GTK3, libnotify, etc.)
3. Install Node.js dependencies
4. Build the web app
5. Generate app icon
6. Create .deb, AppImage, and .rpm packages

### Option 2: Manual Steps

```bash
# 1. Install system dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install -y build-essential libgtk-3-dev libnotify-dev rpm fakeroot

# 2. Install Node.js dependencies
cd desktop
npm install

# 3. Generate icon
node generate-icon.js

# 4. Build all packages
npm run build:all

# Or build specific formats:
npm run build:deb        # Debian package only
npm run build:appimage   # AppImage only
npm run build:rpm        # RPM package only
```

### Option 3: Quick Build (Single Format)

```bash
cd desktop
npm install
node generate-icon.js
npm run build:deb        # or appimage or rpm
```

## 📦 Output

Packages will be created in the `release/` directory:

```
release/
├── pomodoro-focus_1.0.0_amd64.deb          # Debian/Ubuntu
├── Pomodoro Focus-1.0.0-x86_64.AppImage    # Universal Linux
└── pomodoro-focus-1.0.0.x86_64.rpm         # Fedora/RHEL
```

## 📥 Installation

### Debian/Ubuntu (.deb)
```bash
sudo dpkg -i release/pomodoro-focus_1.0.0_amd64.deb
# Launch from app menu or run:
pomodoro-focus
```

### Fedora/RHEL (.rpm)
```bash
sudo rpm -i release/pomodoro-focus-1.0.0.x86_64.rpm
# Launch from app menu or run:
pomodoro-focus
```

### AppImage (No Installation)
```bash
chmod +x release/Pomodoro\ Focus-1.0.0-x86_64.AppImage
./release/Pomodoro\ Focus-1.0.0-x86_64.AppImage
```

## 🔧 Development Mode

Run the app without packaging:

```bash
cd desktop
npm start
```

## 🎨 Custom Icon

Replace the placeholder icon:

1. Create or download a 512x512 PNG icon
2. Save it as `desktop/icon.png`
3. Rebuild: `npm run build`

## 📋 System Requirements

**Build Requirements:**
- Node.js 24+ and npm
- 500 MB free disk space
- GTK3 development libraries
- libnotify development libraries

**Runtime Requirements:**
- Linux 64-bit
- GTK3
- 150 MB disk space
- 100 MB RAM

## 🐛 Troubleshooting

### Build fails with missing dependencies
```bash
# Ubuntu/Debian
sudo apt install -f

# Fedora
sudo dnf install gtk3-devel libnotify-devel
```

### App won't launch
```bash
# Check dependencies
ldd /opt/Pomodoro\ Focus/pomodoro-focus | grep "not found"

# Install missing packages
sudo apt install <missing-package>
```

### No system tray icon
```bash
# Install tray support (GNOME)
sudo apt install gnome-shell-extension-appindicator
```

### Permission denied
```bash
chmod +x release/*.AppImage
chmod +x desktop/package-linux.sh
```

## 📊 Build Times

Approximate build times:
- **Dependencies install**: 1-2 minutes
- **Web app build**: 10-30 seconds
- **Package creation**: 2-5 minutes per format
- **Total**: 5-10 minutes for all formats

## 🎯 Next Steps

1. **Build the packages**: Run `./package-linux.sh`
2. **Test installation**: Install the .deb or AppImage
3. **Customize icon**: Replace placeholder with your own
4. **Distribute**: Share packages with users

## 📚 Additional Resources

- [desktop/README.md](README.md) - Complete documentation
- [desktop/QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [desktop/ICON.md](ICON.md) - Icon customization

## ✨ Features

The desktop app includes:
- ✅ System tray integration
- ✅ Background running
- ✅ Native window controls
- ✅ Custom app icon
- ✅ Desktop menu integration
- ✅ Auto-updates ready (optional)
- ✅ All web app features

---

**Ready to build! 🚀**

Run `./package-linux.sh` to create your Linux desktop packages.
