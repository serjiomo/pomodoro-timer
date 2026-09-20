# App Icon Setup

## ✅ Automatic Icon Generation

The `generate-icon.js` script now creates a proper **256x256 PNG** icon automatically.

### Generate Icon

```bash
cd desktop
node generate-icon.js
```

This creates `desktop/icon.png` (256x256 pixels) with:
- Red tomato body
- Green stem and leaves
- White background
- Anti-aliased edges

**No external dependencies required** - uses only Node.js built-in modules.

## 📐 Icon Requirements

electron-builder requires icons to be **at least 256x256 pixels** for AppImage builds.

| Format | Minimum Size | Recommended |
|--------|--------------|-------------|
| AppImage | 256x256 | 512x512 |
| .deb | 256x256 | 512x512 |
| .rpm | 256x256 | 512x512 |

## 🎨 Custom Icon

To use your own icon:

1. Create a **256x256 or larger** PNG image
2. Save it as `desktop/icon.png`
3. Rebuild: `npm run build`

### Recommended Design

- **Subject**: Tomato or pomodoro shape
- **Colors**: Red body (#DC3232), green leaves (#64B450)
- **Style**: Flat, minimalist, recognizable at small sizes
- **Format**: PNG with or without transparency

### Tools for Creating Icons

- **GIMP**: Free, professional image editor
- **Inkscape**: Vector graphics editor (export to PNG)
- **Figma**: Web-based design tool
- **Icon generators**: https://favicon.io/, https://www.iconfinder.com/

## 🔧 Troubleshooting

### "image must be at least 256x256" Error

This error occurs when the icon is too small. Fix:

```bash
cd desktop
node generate-icon.js  # Regenerates 256x256 icon
```

Or provide your own 256x256+ icon as `icon.png`.

### Verify Icon Size

```bash
# Check icon dimensions (requires ImageMagick)
identify desktop/icon.png

# Or check file size (should be >1KB for 256x256)
ls -la desktop/icon.png
```

### Icon Not Updating

If the icon doesn't change after regeneration:

```bash
# Clear electron-builder cache
rm -rf ~/.cache/electron-builder/

# Rebuild
npm run build
```

## 📦 Icon in Packages

The icon is embedded in:
- **AppImage**: As the application icon
- **.deb**: In `/usr/share/icons/hicolor/256x256/apps/`
- **.rpm**: In `/usr/share/icons/hicolor/256x256/apps/`
- **Desktop entry**: Referenced as `pomodoro-focus`

## 🎯 Quick Fix

If you encounter the 256x256 error:

```bash
cd desktop
node generate-icon.js
npm run build
```

This will regenerate the icon at the correct size and rebuild the packages.
