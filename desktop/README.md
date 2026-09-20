# Pomodoro Focus - Linux Desktop App

A clean, feature-rich Pomodoro timer packaged as a native Linux desktop application.

## Features

- **Three Timer Modes**: Focus (25 min), Short Break (5 min), Long Break (15 min)
- **Custom Durations**: Adjust timer lengths to your preference
- **Statistics Tracking**: Track daily focus sessions and minutes
- **System Tray**: Minimize to tray and run in background
- **Sound Notifications**: Pleasant chime when timer completes
- **Local Storage**: All data persists between sessions
- **Beautiful UI**: Smooth animations and color-coded modes

## Installation

### AppImage (Universal Linux)

```bash
chmod +x Pomodoro\ Focus-1.0.0-x86_64.AppImage
./Pomodoro\ Focus-1.0.0-x86_64.AppImage
```

## Building from Source

### Prerequisites

- Node.js 24+ and npm
- Linux build tools:
  ```bash
  # Debian/Ubuntu
  sudo apt install build-essential libgtk-3-dev libnotify-dev
  
  # Fedora
  sudo dnf install gcc-c++ make gtk3-devel libnotify-devel
  
  # Arch
  sudo pacman -S base-devel gtk3 libnotify
  ```

### Build Steps

1. **Clone or download the project**

2. **Install dependencies** (from project root):
   ```bash
   npm install
   ```

3. **Build the desktop app**:
   ```bash
   cd desktop
   chmod +x build.sh
   ./build.sh
   ```

4. **Find your AppImage** in the `release/` directory

### Manual Build (Alternative)

If you prefer not to use the build script:

```bash
# From project root
npm install
npm run build

# From desktop directory
cd desktop
npm install
npm run build
```

## Development

Run the app in development mode:

```bash
cd desktop
npm start
```

## Uninstall

Simply delete the AppImage file.

## Configuration

Settings are stored locally:
- **Web app**: Browser localStorage
- **Desktop app**: `~/.config/Pomodoro Focus/`

## System Requirements

- **OS**: Linux (64-bit)
- **Memory**: 100 MB RAM minimum
- **Disk Space**: 150 MB for installation
- **Display**: 1024x768 minimum resolution

## Dependencies

The AppImage includes all required dependencies:
- GTK3
- libnotify
- NSS
- libXScrnSaver
- libXtst
- xdg-utils
- at-spi2-core
- libuuid

## Troubleshooting

### App won't start
```bash
# Check if all dependencies are installed
ldd /opt/Pomodoro\ Focus/pomodoro-focus | grep "not found"

# Install missing dependencies
sudo apt install -f  # Debian/Ubuntu
sudo dnf install <package-name>  # Fedora
```

### Tray icon not showing
Some desktop environments don't support tray icons by default. Install an indicator applet:
```bash
sudo apt install gnome-shell-extension-appindicator  # GNOME
```

### Sound not playing
Ensure your system has audio output configured and volume is not muted.

## License

MIT

## Support

For issues and feature requests, please visit the project repository.
