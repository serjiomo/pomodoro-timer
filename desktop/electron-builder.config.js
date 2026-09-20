/**
 * Electron Builder Configuration
 * Builds Linux desktop packages (.deb, AppImage, .rpm)
 */
const path = require('path');

module.exports = {
  appId: 'com.pomodoro.focus',
  productName: 'Pomodoro Focus',
  directories: {
    output: path.join(__dirname, '..', 'release'),
    buildResources: path.join(__dirname, 'build'),
  },
  files: [
    'main.js',
    'preload.js',
    'icon.png',
    {
      from: path.join(__dirname, '..', 'dist'),
      to: 'dist',
      filter: ['**/*'],
    },
  ],
  asar: true,
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64'],
      },
    ],
    category: 'Utility',
    icon: path.join(__dirname, 'icon.png'),
    maintainer: 'Pomodoro App <pomodoro@example.com>',
    synopsis: 'A clean Pomodoro focus timer',
    description: 'A beautiful, feature-rich Pomodoro timer for Linux desktop with focus tracking, custom durations, and system tray support.',
    desktop: {
      Name: 'Pomodoro Focus',
      Comment: 'A clean Pomodoro focus timer',
      Categories: 'Utility;Productivity;',
      Terminal: 'false',
      Type: 'Application',
      Icon: 'pomodoro-focus',
    },
  },
  deb: {
    priority: 'optional',
    depends: [
      'libgtk-3-0',
      'libnotify4',
      'libnss3',
      'libxss1',
      'libxtst6',
      'xdg-utils',
      'libatspi2.0-0',
      'libuuid1',
    ],
  },
  appImage: {
    artifactName: '${productName}-${version}-${arch}.AppImage',
    category: 'Utility',
  },
  rpm: {
    depends: [
      'gtk3',
      'libnotify',
      'nss',
      'libXScrnSaver',
      'libXtst',
      'xdg-utils',
      'at-spi2-core',
      'libuuid',
    ],
  },
};
