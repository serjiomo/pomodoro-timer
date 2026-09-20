#!/bin/bash
# Build script for Pomodoro Focus Linux Desktop App
# Usage: ./build.sh

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
echo "📦 Step 3: Building AppImage package..."

echo "Building AppImage..."
npm run build:appimage

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Output directory: $PROJECT_ROOT/release/"
echo ""
echo "Available packages:"
ls -lh "$PROJECT_ROOT/release/" 2>/dev/null || echo "  (check $PROJECT_ROOT/release/ for output)"
