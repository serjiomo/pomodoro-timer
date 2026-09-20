# 🚀 GitHub Actions Workflows

This project includes automated CI/CD workflows for building, testing, and releasing the Pomodoro Focus app.

## 📋 Available Workflows

### 1. **CI Workflow** (`.github/workflows/ci.yml`)
- **Trigger**: Pull requests to `main` branch
- **Purpose**: Validate code quality and build success
- **Actions**:
  - Lint and type-check code
  - Build web app
  - Verify build output

### 2. **Build and Release** (`.github/workflows/build-and-release.yml`)
- **Trigger**: 
  - Push to `main` branch
  - Version tags (`v*`)
  - Manual dispatch
- **Purpose**: Build all platforms and create releases
- **Actions**:
  - Build web app
  - Build Linux packages (deb, AppImage, rpm)
  - Create GitHub release with artifacts

### 3. **Release** (`.github/workflows/release.yml`)
- **Trigger**: Version tags only (`v[0-9]+.[0-9]+.[0-9]+`)
- **Purpose**: Create production releases
- **Actions**:
  - Build all packages
  - Create GitHub release with detailed notes
  - Upload installation instructions

## 🎯 How to Use

### Creating a New Release

1. **Update version** in `package.json` (if needed):
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. **Create and push a tag**:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

3. **GitHub Actions will automatically**:
   - Build all packages
   - Create a GitHub release
   - Upload artifacts
   - Generate release notes

### Manual Trigger

You can manually trigger the build workflow:

1. Go to **Actions** tab in GitHub
2. Select **"Build and Release"** workflow
3. Click **"Run workflow"**
4. Choose branch and click **"Run workflow"**

## 📦 Build Artifacts

After a successful build, you'll find:

### Web App
- `dist/` - Built web application
- Deployable to any static hosting (Netlify, Vercel, GitHub Pages)

### Linux Desktop Packages
- `pomodoro-focus_X.Y.Z_amd64.deb` - Debian/Ubuntu
- `Pomodoro Focus-X.Y.Z-x86_64.AppImage` - Universal Linux
- `pomodoro-focus-X.Y.Z.x86_64.rpm` - Fedora/RHEL

## 🔧 Workflow Configuration

### Environment Variables

The workflows use these GitHub secrets (automatically provided):
- `GITHUB_TOKEN` - For creating releases (auto-generated)

### Build Matrix

The build workflow uses a matrix strategy to build multiple formats in parallel:
```yaml
strategy:
  matrix:
    format: [deb, appimage, rpm]
```

### Caching

Node.js dependencies are cached to speed up builds:
```yaml
cache: 'npm'
```

## 🐛 Troubleshooting

### Build Fails

1. **Check logs**: Go to Actions tab → Failed workflow → View logs
2. **Common issues**:
   - Missing dependencies: Update `package.json`
   - Build errors: Check TypeScript/ESLint errors
   - Icon size: Ensure icon is 256x256+

### Release Not Created

- Ensure tag format matches: `v[0-9]+.[0-9]+.[0-9]+`
- Check that workflow has `contents: write` permission
- Verify `GITHUB_TOKEN` has release permissions

### Artifacts Not Uploaded

- Check artifact retention days (default: 30 days)
- Verify file paths in workflow
- Check build output directory

## 📊 Workflow Status Badges

Add these badges to your README:

```markdown
![Build Status](https://github.com/YOUR_USERNAME/pomodoro-focus/workflows/Build%20and%20Release/badge.svg)
![CI](https://github.com/YOUR_USERNAME/pomodoro-focus/workflows/CI/badge.svg)
```

## 🔐 Permissions

The workflows require these permissions:
- `contents: write` - Create releases
- `packages: write` - Upload packages (if using GitHub Packages)

These are set in the workflow files:
```yaml
permissions:
  contents: write
  packages: write
```

## 🎨 Customization

### Add Windows/macOS Builds

Edit `.github/workflows/build-and-release.yml`:

```yaml
jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      # ... Windows build steps
      
  build-macos:
    runs-on: macos-latest
    steps:
      # ... macOS build steps
```

### Add Testing

Add a test job before building:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
```

### Deploy to Web

Add deployment after build:

```yaml
  deploy:
    needs: build-web
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
```

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Electron Builder GitHub Actions](https://www.electron.build/multi-platform-build#github-actions)

## 💡 Tips

1. **Test workflows locally**: Use [act](https://github.com/nektos/act) to run workflows locally
2. **Monitor build times**: Check Actions tab for performance metrics
3. **Use draft releases**: Set `draft: true` to review before publishing
4. **Cache dependencies**: Speed up builds with proper caching
5. **Matrix builds**: Build multiple targets in parallel

---

**Your CI/CD pipeline is ready! 🎉**
