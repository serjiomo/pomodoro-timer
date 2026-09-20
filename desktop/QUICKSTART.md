# Quick Start Guide - Pomodoro Focus Desktop

## Fast Build (5 minutes)

### 1. Install System Dependencies

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y build-essential libgtk-3-dev libnotify-dev nodejs npm
```

**Fedora:**
```bash
sudo dnf install -y gcc-c++ make gtk3-devel libnotify-devel nodejs npm
```

**Arch:**
```bash
sudo pacman -S base-devel gtk3 libnotify nodejs npm
```

### 2. Build the App

```bash
# From project root
npm install
cd desktop
chmod +x build.sh
node generate-icon.js  # Create placeholder icon
./build.sh
```

### 3. Install the Package

**Debian/Ubuntu:**
```bash
sudo dpkg -i ../release/pomodoro-focus_1.0.0_amd64.deb
```

**Fedora:**
```bash
sudo rpm -i ../release/pomodoro-focus-1.0.0.x86_64.rpm
```

**AppImage (no install needed):**
```bash
chmod +x ../release/Pomodoro\ Focus-1.0.0-x86_64.AppImage
../release/Pomodoro\ Focus-1.0.0-x86_64.AppImage
```

### 4. Launch

```bash
pomodoro-focus  # Or find "Pomodoro Focus" in your app menu
```

## Development Mode

To run without building:

```bash
cd desktop
npm install
npm start
```

## Custom Icon

Replace the placeholder icon:

1. Get a 512x512 PNG icon (tomato/pomodoro themed)
2. Save it as `desktop/icon.png`
3. Rebuild: `./build.sh`

## Troubleshooting

**Build fails with "electron not found":**
```bash
cd desktop
npm install
```

**App won't launch:**
```bash
# Check dependencies
ldd /opt/Pomodoro\ Focus/pomodoro-focus | grep "not found"
sudo apt install -f  # Fix missing dependencies
```

**No sound:**
Check system volume and ensure audio output is configured.

## Uninstall

```bash
# Debian/Ubuntu
sudo apt remove pomodoro-focus

# Fedora
sudo rpm -e pomodoro-focus

# AppImage
rm Pomodoro\ Focus-1.0.0-x86_64.AppImage
```

## File Locations

- **Config**: `~/.config/Pomodoro Focus/`
- **Cache**: `~/.cache/Pomodoro Focus/`
- **Data**: Browser localStorage (in app data directory)

## Next Steps

- Customize timer durations in app settings
- Enable/disable sound notifications
- Track your daily focus statistics
- Minimize to system tray for background use

Enjoy your focused productivity! 🍅
