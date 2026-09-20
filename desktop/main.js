const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 720,
    minWidth: 380,
    minHeight: 600,
    resizable: true,
    title: 'Pomodoro Focus',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#fff5f5',
  });

  // Load the built Vite app
  // In development: __dirname is /desktop, so we go up one level to find /dist
  // In production: __dirname is /resources/app, so dist is a sibling directory
  const indexPath = app.isPackaged
    ? path.join(__dirname, 'dist', 'index.html')
    : path.join(__dirname, '..', 'dist', 'index.html');
  mainWindow.loadFile(indexPath);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // Create a simple tray icon (16x16 tomato emoji style)
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA' +
    'mklEQVQ4T2NkoBAwUqifYdAY8B8M/v9nYPz/H8wGcRgZGcE0IyMjyAUsQJqRkY' +
    'HBAMr+DzIHJg7iMII0gDiMDAwM/6EMRkYGsDpGBgaG/0A5kDpGBob/IAVIHBgD' +
    'pP8DDfiPLI6sAMkExgAGsDhIHNgKkDlgdWA1yO5A5uBrQPYFsg9QfIDiFxSfoP' +
    'gGxUcoPkPxHVo8kOIHAN46kkvWwZlRAAAAAElFTkSuQmCC'
  );

  tray = new Tray(icon);
  tray.setToolTip('Pomodoro Focus Timer');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Timer',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
