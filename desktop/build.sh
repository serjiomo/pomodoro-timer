#!/bin/bash
# Build script for Pomodoro Focus Linux Desktop App
# Usage: ./build.sh [deb|appimage|rpm|all]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🍅 Building Pomodoro Focus Desktop App"
echo "======================================="

# Step 1: Build the web app with Vite
echo ""
echo "📦 Step 1: Building web app..."
cd "$PROJECT_ROOT"
npm run build
echo "✅ Web app built successfully"

# Step 2: Install Electron dependencies (if needed)
echo ""
echo "📦 Step 2: Checking Electron dependencies..."
cd "$SCRIPT_DIR"
if [ ! -d "node_modules" ]; then
  echo "Installing Electron and electron-builder..."
  npm install
fi
echo "✅ Dependencies ready"

# Step 3: Build the desktop app
echo ""
echo "📦 Step 3: Building desktop packages..."

case "${1:-all}" in
  deb)
    echo "Building .deb package..."
    npm run build:deb
    ;;
  appimage)
    echo "Building AppImage..."
    npm run build:appimage
    ;;
  rpm)
    echo "Building .rpm package..."
    npm run build:rpm
    ;;
  all|*)
    echo "Building all Linux packages (deb, AppImage, rpm)..."
    npm run build:all
    ;;
esac

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Output directory: $PROJECT_ROOT/release/"
echo ""
echo "Available packages:"
ls -lh "$PROJECT_ROOT/release/" 2>/dev/null || echo "  (check $PROJECT_ROOT/release/ for output)"
