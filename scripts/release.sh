#!/bin/bash
# Release Helper Script
# Usage: ./release.sh [major|minor|patch|version]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version: $CURRENT_VERSION${NC}"

# Parse version bump type
BUMP_TYPE=${1:-patch}

if [[ "$BUMP_TYPE" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  # Explicit version provided
  NEW_VERSION="$BUMP_TYPE"
else
  # Calculate new version based on bump type
  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
  
  case "$BUMP_TYPE" in
    major)
      NEW_VERSION="$((MAJOR + 1)).0.0"
      ;;
    minor)
      NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
      ;;
    patch)
      NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
      ;;
    *)
      echo -e "${RED}❌ Invalid version bump type: $BUMP_TYPE${NC}"
      echo "Usage: $0 [major|minor|patch|x.y.z]"
      exit 1
      ;;
  esac
fi

echo ""
echo -e "${YELLOW}📦 Preparing release v$NEW_VERSION${NC}"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo -e "${RED}❌ You have uncommitted changes. Please commit or stash them first.${NC}"
  exit 1
fi

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${YELLOW}⚠️  Warning: You're on '$CURRENT_BRANCH' branch, not 'main'${NC}"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Update version in package.json
echo -e "${BLUE}Updating version in package.json...${NC}"
node -e "
const fs = require('fs');
const pkg = require('./package.json');
pkg.version = '$NEW_VERSION';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Update version in desktop/package.json
echo -e "${BLUE}Updating version in desktop/package.json...${NC}"
node -e "
const fs = require('fs');
const pkg = require('./desktop/package.json');
pkg.version = '$NEW_VERSION';
fs.writeFileSync('desktop/package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Commit version bump
echo -e "${BLUE}Committing version bump...${NC}"
git add package.json desktop/package.json
git commit -m "chore: bump version to $NEW_VERSION"

# Create tag
echo -e "${BLUE}Creating tag v$NEW_VERSION...${NC}"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

echo ""
echo -e "${GREEN}✅ Release v$NEW_VERSION prepared!${NC}"
echo ""
echo "Next steps:"
echo -e "  ${YELLOW}1.${NC} Push changes and tag:"
echo -e "     ${BLUE}git push origin main --tags${NC}"
echo ""
echo -e "  ${YELLOW}2.${NC} GitHub Actions will automatically:"
echo -e "     ${BLUE}• Build web app${NC}"
echo -e "     ${BLUE}• Build Linux packages${NC}"
echo -e "     ${BLUE}• Create GitHub release${NC}"
echo ""
echo -e "  ${YELLOW}3.${NC} View the release at:"
echo -e "     ${BLUE}https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/releases/tag/v$NEW_VERSION${NC}"
echo ""
echo -e "${GREEN}🍅 Happy releasing!${NC}"
