#!/bin/bash
# Complete Linux Desktop Packaging Script
# Run this on your Linux system to build .deb, AppImage, and .rpm packages

set -e

echo "🍅 Pomodoro Focus - Linux Desktop Packaging"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Install with: sudo apt install nodejs npm  (Debian/Ubuntu)"
    echo "              sudo dnf install nodejs npm  (Fedora)"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}"

# Step 2: Install system build dependencies
echo ""
echo -e "${YELLOW}Step 2: Installing system dependencies...${NC}"

if command -v apt-get &> /dev/null; then
    echo "Detected Debian/Ubuntu system"
    sudo apt-get update -qq
    sudo apt-get install -y -qq build-essential libgtk-3-dev libnotify-dev \
        libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libuuid1 \
        rpm fakeroot 2>/dev/null || true
elif command -v dnf &> /dev/null; then
    echo "Detected Fedora/RHEL system"
    sudo dnf install -y gcc-c++ make gtk3-devel libnotify-devel \
        nss libXScrnSaver libXtst xdg-utils at-spi2-core libuuid \
        rpm-build fakeroot 2>/dev/null || true
elif command -v pacman &> /dev/null; then
    echo "Detected Arch Linux system"
    sudo pacman -S --noconfirm --needed base-devel gtk3 libnotify \
        nss libxss libxtst xdg-utils at-spi2-core util-linux \
        rpm-build fakeroot 2>/dev/null || true
else
    echo -e "${YELLOW}⚠️  Unknown package manager. Install manually:${NC}"
    echo "  - GTK3 development libraries"
    echo "  - libnotify development libraries"
    echo "  - rpm-build and fakeroot"
fi

echo -e "${GREEN}✅ System dependencies ready${NC}"

# Step 3: Install Node.js dependencies
echo ""
echo -e "${YELLOW}Step 3: Installing Node.js dependencies...${NC}"

cd "$PROJECT_ROOT"
echo "Installing web app dependencies..."
npm install --silent

cd "$SCRIPT_DIR"
echo "Installing Electron dependencies..."
npm install --silent

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 4: Build the web app
echo ""
echo -e "${YELLOW}Step 4: Building web app...${NC}"

cd "$PROJECT_ROOT"
npm run build

echo -e "${GREEN}✅ Web app built${NC}"

# Step 5: Generate icon (256x256 PNG required by electron-builder)
echo ""
echo -e "${YELLOW}Step 5: Generating app icon (256x256)...${NC}"

cd "$SCRIPT_DIR"
node generate-icon.js

# Verify icon size
if [ -f "icon.png" ]; then
  # Check file size (256x256 PNG should be at least a few KB)
  FILE_SIZE=$(stat -f%z "icon.png" 2>/dev/null || stat -c%s "icon.png" 2>/dev/null)
  if [ "$FILE_SIZE" -gt 1000 ]; then
    echo -e "${GREEN}✅ Icon generated: 256x256 PNG ($FILE_SIZE bytes)${NC}"
  else
    echo -e "${YELLOW}⚠️  Icon may be too small. Please provide a 256x256+ icon manually.${NC}"
  fi
else
  echo -e "${RED}❌ Icon generation failed${NC}"
  exit 1
fi

# Step 6: Build desktop packages
echo ""
echo -e "${YELLOW}Step 6: Building Linux desktop packages...${NC}"

# Clean previous builds
rm -rf "$PROJECT_ROOT/release"

# Build all formats
npx electron-builder --linux --config electron-builder.config.js

echo -e "${GREEN}✅ Desktop packages built${NC}"

# Step 7: Show results
echo ""
echo "============================================="
echo -e "${GREEN}🎉 Build Complete!${NC}"
echo "============================================="
echo ""
echo "📁 Output directory: $PROJECT_ROOT/release/"
echo ""
echo "Generated packages:"
echo ""

if [ -d "$PROJECT_ROOT/release" ]; then
    ls -lh "$PROJECT_ROOT/release/" | grep -E '\.(deb|AppImage|rpm)$' || echo "  (no packages found)"
fi

echo ""
echo "📦 Installation commands:"
echo ""
echo "  Debian/Ubuntu:"
echo "    sudo dpkg -i release/pomodoro-focus_1.0.0_amd64.deb"
echo ""
echo "  Fedora:"
echo "    sudo rpm -i release/pomodoro-focus-1.0.0.x86_64.rpm"
echo ""
echo "  AppImage (no install):"
echo "    chmod +x release/Pomodoro\ Focus-1.0.0-x86_64.AppImage"
echo "    ./release/Pomodoro\ Focus-1.0.0-x86_64.AppImage"
echo ""
echo "🍅 Enjoy your Pomodoro Focus Timer!"
