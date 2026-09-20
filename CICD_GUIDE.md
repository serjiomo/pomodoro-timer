# 🚀 Complete CI/CD Setup Guide

This document explains the complete GitHub Actions CI/CD pipeline for the Pomodoro Focus app.

## 📁 Workflow Structure

```
.github/
├── workflows/
│   ├── ci.yml                    # Pull request checks
│   ├── build-and-release.yml     # Multi-platform builds
│   └── release.yml               # Production releases
└── WORKFLOWS.md                  # Workflow documentation
```

## 🔄 Workflow Overview

### 1. CI Workflow (`ci.yml`)
**Triggers**: Pull requests to `main`

**Purpose**: Validate code quality before merging

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Build web app
5. Verify build output

**Status**: ✅ Required for PR merge

---

### 2. Build and Release (`build-and-release.yml`)
**Triggers**: 
- Push to `main`
- Version tags (`v*`)
- Manual dispatch

**Purpose**: Build all platforms and create releases

**Jobs**:
1. **build-web**: Build web application
2. **build-linux**: Build Linux packages (matrix: deb, appimage, rpm)
3. **release**: Create GitHub release (tags only)
4. **build-success**: Verify all builds passed

**Artifacts**:
- Web app (dist/)
- Linux .deb package
- Linux AppImage
- Linux .rpm package

---

### 3. Release (`release.yml`)
**Triggers**: Version tags only (`v[0-9]+.[0-9]+.[0-9]+`)

**Purpose**: Create production releases with detailed notes

**Features**:
- Automatic version extraction from tag
- Detailed release notes with installation instructions
- All packages attached to release
- Automatic changelog generation

---

## 🎯 Release Process

### Option 1: Automated Release Script (Recommended)

```bash
# Make script executable
chmod +x scripts/release.sh

# Create a patch release (1.0.0 → 1.0.1)
./scripts/release.sh patch

# Create a minor release (1.0.0 → 1.1.0)
./scripts/release.sh minor

# Create a major release (1.0.0 → 2.0.0)
./scripts/release.sh major

# Create specific version
./scripts/release.sh 1.2.3
```

**What the script does**:
1. ✅ Checks for uncommitted changes
2. ✅ Verifies you're on main branch
3. ✅ Updates version in package.json files
4. ✅ Commits version bump
5. ✅ Creates annotated tag
6. ✅ Shows next steps

### Option 2: Manual Release

```bash
# 1. Update version in package.json
npm version patch  # or minor, major

# 2. Push changes and tags
git push origin main --tags

# 3. GitHub Actions will automatically:
#    - Build all packages
#    - Create GitHub release
#    - Upload artifacts
```

---

## 📦 What Gets Built

### Web Application
- **Output**: `dist/` directory
- **Size**: ~230 KB (gzipped)
- **Deployable to**: Any static hosting

### Linux Desktop Packages

#### Debian Package (.deb)
- **File**: `pomodoro-focus_X.Y.Z_amd64.deb`
- **Size**: ~80-100 MB
- **Install**: `sudo dpkg -i pomodoro-focus_X.Y.Z_amd64.deb`
- **Platforms**: Debian, Ubuntu, Linux Mint

#### AppImage
- **File**: `Pomodoro Focus-X.Y.Z-x86_64.AppImage`
- **Size**: ~80-100 MB
- **Run**: `./Pomodoro\ Focus-X.Y.Z-x86_64.AppImage`
- **Platforms**: Any Linux distribution (no install needed)

#### RPM Package (.rpm)
- **File**: `pomodoro-focus-X.Y.Z.x86_64.rpm`
- **Size**: ~80-100 MB
- **Install**: `sudo rpm -i pomodoro-focus-X.Y.Z.x86_64.rpm`
- **Platforms**: Fedora, RHEL, CentOS, openSUSE

---

## 🔧 Workflow Configuration

### Environment Variables

The workflows use these GitHub-provided variables:
- `GITHUB_TOKEN`: Auto-generated token for releases
- `GITHUB_REF`: Git reference (branch or tag)
- `GITHUB_REPOSITORY`: Repository name

### Permissions

```yaml
permissions:
  contents: write    # Create releases
  packages: write    # Upload packages
```

### Caching

Node.js dependencies are cached to speed up builds:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### Matrix Strategy

Build multiple formats in parallel:
```yaml
strategy:
  matrix:
    format: [deb, appimage, rpm]
```

---

## 📊 Monitoring Builds

### View Build Status

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select a workflow run
4. View logs and artifacts

### Build Artifacts

Artifacts are available for 30 days:
1. Go to workflow run
2. Scroll to **Artifacts** section
3. Download desired artifact

### Build Logs

Each step shows detailed logs:
- ✅ Green checkmark: Success
- ❌ Red X: Failure
- ⚠️ Yellow warning: Non-critical issue

---

## 🐛 Troubleshooting

### Build Fails

**Common Issues**:

1. **Missing dependencies**
   ```bash
   # Check package.json
   cat package.json | grep dependencies
   
   # Update if needed
   npm install <package>
   ```

2. **TypeScript errors**
   ```bash
   # Run type check locally
   npx tsc --noEmit
   ```

3. **Icon size error**
   ```bash
   # Regenerate icon
   cd desktop
   node generate-icon.js
   ```

4. **Permission denied**
   ```bash
   # Make scripts executable
   chmod +x scripts/release.sh
   chmod +x desktop/package-linux.sh
   ```

### Release Not Created

**Check**:
1. Tag format: Must be `v[0-9]+.[0-9]+.[0-9]+`
2. Workflow has `contents: write` permission
3. `GITHUB_TOKEN` is valid (auto-generated)

### Artifacts Not Uploaded

**Check**:
1. File paths in workflow match actual output
2. Build directory exists
3. Artifact retention period (default: 30 days)

---

## 🎨 Customization

### Add Windows Build

Edit `.github/workflows/build-and-release.yml`:

```yaml
build-windows:
  runs-on: windows-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run build
    - run: |
        cd desktop
        npm ci
        npm run build:win
    - uses: actions/upload-artifact@v4
      with:
        name: windows-exe
        path: release/*.exe
```

### Add macOS Build

```yaml
build-macos:
  runs-on: macos-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run build
    - run: |
        cd desktop
        npm ci
        npm run build:mac
    - uses: actions/upload-artifact@v4
      with:
        name: macos-dmg
        path: release/*.dmg
```

### Add Testing

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npm test
```

### Add Deployment

```yaml
deploy:
  needs: build-web
  runs-on: ubuntu-latest
  steps:
    - uses: actions/download-artifact@v4
      with:
        name: web-build
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 📚 Resources

### Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Electron Builder](https://www.electron.build/)
- [electron-builder GitHub Actions](https://www.electron.build/multi-platform-build#github-actions)

### Tools
- [act](https://github.com/nektos/act) - Run GitHub Actions locally
- [actionlint](https://github.com/rhysd/actionlint) - Lint workflow files
- [workflow-dispatch](https://github.com/benc-uk/workflow-dispatch) - Trigger workflows

### Examples
- [Electron Builder Action](https://github.com/samuelmeuli/action-electron-builder)
- [Awesome Actions](https://github.com/sdras/awesome-actions)

---

## 💡 Best Practices

1. **Use semantic versioning**: `v1.2.3` format
2. **Test locally first**: Use `act` to run workflows locally
3. **Cache dependencies**: Speed up builds with caching
4. **Use matrix builds**: Build multiple targets in parallel
5. **Protect main branch**: Require CI checks before merge
6. **Use draft releases**: Review before publishing
7. **Monitor build times**: Optimize slow steps
8. **Keep workflows DRY**: Reuse steps with composite actions

---

## 🎉 You're All Set!

Your CI/CD pipeline is fully configured and ready to use.

**Quick Start**:
```bash
# Create your first release
./scripts/release.sh patch
git push origin main --tags
```

**Monitor**: Check the Actions tab on GitHub

**Celebrate**: 🍅 Your app is now automatically built and released!

---

**Happy coding! 🚀**
