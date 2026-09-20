#!/usr/bin/env node
/**
 * Simple icon generator for Pomodoro Focus
 * Creates a basic tomato-shaped icon
 * 
 * Usage: node generate-icon.js
 */

const fs = require('fs');
const path = require('path');

// Simple 16x16 PNG (minimal valid PNG)
// This is a basic red square with rounded corners
const iconBase64 = 
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA' +
  'mklEQVQ4T2NkoBAwUqifYdAY8B8M/v9nYPz/H8wGcRgZGcE0IyMjyAUsQJqRkY' +
  'HBAMr+DzIHJg7iMII0gDiMDAwM/6EMRkYGsDpGBgaG/0A5kDpGBob/IAVIHBgD' +
  'pP8DDfiPLI6sAMkExgAGsDhIHNgKkDlgdWA1yO5A5uBrQPYFsg9QfIDiFxSfoP' +
  'gGxUcoPkPxHVo8kOIHAN46kkvWwZlRAAAAAElFTkSuQmCC';

const iconPath = path.join(__dirname, 'icon.png');

try {
  fs.writeFileSync(iconPath, Buffer.from(iconBase64, 'base64'));
  console.log('✅ Icon created: desktop/icon.png');
  console.log('   Note: This is a minimal placeholder icon.');
  console.log('   For production, replace with a 512x512 PNG icon.');
} catch (err) {
  console.error('❌ Failed to create icon:', err.message);
  process.exit(1);
}
