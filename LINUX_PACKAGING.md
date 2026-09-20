# 🍅 Pomodoro Focus - Linux Desktop Packaging Guide

## ✅ Setup Complete!

Your Pomodoro Focus app is fully configured for Linux desktop packaging. All necessary files are in place and ready to build.

## 📁 Project Structure

```
pomodoro-focus/
├── src/                          # React web app source
├── dist/                         # Built web app ✅
├── desktop/                      # Linux desktop packaging
│   ├── main.js                  # Electron main process
│   ├── preload.js               # Security preload
│   ├── package.json             # Electron dependencies
│   ├── electron-builder.config.js  # Build configuration
│   ├── package-linux.sh         # Automated build script
│   ├── build.sh                 # Alternative build script
│   ├── generate-icon.js         # Icon generator
│   ├── BUILD.md                 # Complete build guide
│   ├── QUICKSTART.md            # Quick start guide
│   └── README.md                # Documentation
└── release/                      # Output directory (created during build)
```

## 🚀 Quick Start - Build Linux Packages

### On Your Linux System:

```bash
# 1. Navigate to desktop directory
cd desktop

# 2. Make build script executable
chmod +x package-linux.sh

# 3. Run the automated build
./package-linux.sh
```

This single command will:
- ✅ Check and install system dependencies
- ✅ Install Node.js packages
- ✅ Build the web app
- ✅ Generate app icon
- ✅ Create .deb, AppImage, and .rpm packages

**Build time**: ~5-10 minutes

## 📦 Generated Package

After building, you'll find:

```
release/
└── Pomodoro Focus-1.0.0-x86_64.AppImage    # Universal Linux
```

## 📥 Install & Run

### AppImage (No Install)
```bash
chmod +x release/Pomodoro\ Focus-1.0.0-x86_64.AppImage
./release/Pomodoro\ Focus-1.0.0-x86_64.AppImage
```

## 🔧 Alternative Build Methods

### Build Specific Format Only

```bash
cd desktop
npm install
node generate-icon.js

# Build only .deb
npm run build:deb

# Build only AppImage
npm run build:appimage

# Build only .rpm
npm run build:rpm
```

### Development Mode (No Packaging)

```bash
cd desktop
npm install
npm start
```

## 📋 System Requirements

### To Build:
- **OS**: Linux (Ubuntu 20.04+, Fedora 33+, Debian 11+, Arch)
- **Node.js**: 18 or higher
- **npm**: 8 or higher
- **Disk Space**: 500 MB free
- **RAM**: 2 GB recommended

### System Dependencies (Auto-installed by script):
- GTK3 development libraries
- libnotify development libraries
- build-essential (gcc, make)
- rpm-build, fakeroot

### To Run:
- **OS**: Linux 64-bit
- **Disk Space**: 150 MB
- **RAM**: 100 MB
- **Display**: 1024x768 minimum

## 🎨 Customization

### Replace App Icon

1. Create a 512x512 PNG icon (tomato/pomodoro themed)
2. Save as `desktop/icon.png`
3. Rebuild: `npm run build`

### Modify Timer Defaults

Edit `src/App.tsx`:
```typescript
const DEFAULT_SETTINGS: Settings = {
  focus: 25,      // Change focus duration
  shortBreak: 5,  // Change short break
  longBreak: 15,  // Change long break
};
```

Then rebuild: `npm run build`

## 📚 Documentation

- **[desktop/BUILD.md](desktop/BUILD.md)** - Complete build guide with troubleshooting
- **[desktop/QUICKSTART.md](desktop/QUICKSTART.md)** - Quick start instructions
- **[desktop/README.md](desktop/README.md)** - Full documentation
- **[desktop/ICON.md](desktop/ICON.md)** - Icon customization guide

## 🐛 Troubleshooting

### Common Issues

**"electron not found"**
```bash
cd desktop
npm install
```

**"build-essential not found"**
```bash
# Ubuntu/Debian
sudo apt install build-essential

# Fedora
sudo dnf install gcc-c++ make
```

**"App won't start after install"**
```bash
# Check dependencies
ldd /opt/Pomodoro\ Focus/pomodoro-focus | grep "not found"

# Fix missing dependencies
sudo apt install -f  # Ubuntu/Debian
```

**"No system tray icon"**
```bash
# Install tray support
sudo apt install gnome-shell-extension-appindicator
```

### Build Fails

1. Clean previous builds: `rm -rf release/`
2. Clear node_modules: `rm -rf node_modules/`
3. Reinstall: `npm install`
4. Try again: `./package-linux.sh`

## ✨ Desktop App Features

The packaged app includes:
- ✅ System tray integration
- ✅ Minimize to background
- ✅ Native window controls
- ✅ Desktop menu entry
- ✅ Auto-start capability (optional)
- ✅ All web app features:
  - Focus/Short Break/Long Break modes
  - Custom durations
  - Sound notifications
  - Statistics tracking
  - Local data persistence

## 🎯 What Happens During Build

1. **Web App Build** (10-30 seconds)
   - Vite compiles React app
   - Creates optimized dist/ folder

2. **Electron Packaging** (2-5 minutes per format)
   - Bundles web app with Electron
   - Creates platform-specific packages
   - Generates desktop entries
   - Packages dependencies

3. **Output** (instant)
   - .deb package for Debian/Ubuntu
   - AppImage for universal Linux
   - .rpm package for Fedora/RHEL

## 📊 Build Statistics

- **Web app size**: ~230 KB (gzipped)
- **Desktop app size**: ~80-100 MB per package
- **Build time**: 5-10 minutes total
- **Output formats**: 3 (deb, AppImage, rpm)

## 🔗 Next Steps

1. **Build the packages**: `cd desktop && ./package-linux.sh`
2. **Test installation**: Install and run the .deb or AppImage
3. **Customize**: Replace icon, adjust settings
4. **Distribute**: Share with users or publish

## 💡 Tips

- **AppImage** is easiest to test (no installation needed)
- **.deb** is best for Debian/Ubuntu distribution
- **.rpm** is best for Fedora/RHEL distribution
- Test on multiple Linux distributions if distributing widely
- Consider code signing for production distribution

## 🆘 Need Help?

1. Check [desktop/BUILD.md](desktop/BUILD.md) for detailed troubleshooting
2. Review build logs in the terminal output
3. Ensure all system dependencies are installed
4. Try building individual formats to isolate issues

---

## 🎉 Ready to Build!

Everything is set up and ready. Just run:

```bash
cd desktop
chmod +x package-linux.sh
./package-linux.sh
```

**Happy building! 🍅**
