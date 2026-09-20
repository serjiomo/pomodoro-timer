const fs = require('fs');
const path = require('path');

// Create a simple 16x16 red square icon (minimal placeholder)
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
  console.log('   This is a minimal placeholder icon.');
  console.log('   For production, replace with a 512x512 PNG icon.');
} catch (err) {
  console.error('❌ Failed to create icon:', err.message);
  process.exit(1);
}
