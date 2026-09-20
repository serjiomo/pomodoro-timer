# Icon Setup Instructions

The desktop app requires an icon.png file (512x512 pixels recommended).

## Option 1: Use Generated Icon

If you have a generated icon, save it as:
```
desktop/icon.png
```

## Option 2: Create Simple Icon

You can use any image editor to create a 512x512 PNG icon, or use online tools like:
- https://favicon.io/
- https://www.iconfinder.com/
- https://www.flaticon.com/

## Option 3: Use Default Icon

If no icon.png is provided, Electron will use a default icon. The app will still work, but the tray icon and window icon will be generic.

## Icon Requirements

- Format: PNG
- Size: 512x512 pixels (recommended)
- Transparency: Supported
- Color depth: 32-bit RGBA

## After Adding Icon

Rebuild the desktop app:
```bash
cd desktop
npm run build
```

The icon will be embedded in the .deb, .rpm, and AppImage packages.
