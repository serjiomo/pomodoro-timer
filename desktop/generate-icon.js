#!/usr/bin/env node
/**
 * Icon generator for Pomodoro Focus
 * Creates a 256x256 PNG icon with a simple tomato design
 * Uses only Node.js built-in modules (no external dependencies)
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 256;

// Create RGBA pixel buffer
const pixels = Buffer.alloc(SIZE * SIZE * 4);

// Helper to set pixel color
function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
  const idx = (y * SIZE + x) * 4;
  pixels[idx] = r;
  pixels[idx + 1] = g;
  pixels[idx + 2] = b;
  pixels[idx + 3] = a;
}

// Helper to draw filled circle with anti-aliasing
function drawCircle(cx, cy, radius, r, g, b, a = 255) {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist <= radius) {
        // Anti-aliasing at edges
        const edgeDist = radius - dist;
        const alpha = edgeDist < 1 ? Math.floor(a * edgeDist) : a;
        setPixel(x, y, r, g, b, alpha);
      }
    }
  }
}

// Helper to draw ellipse
function drawEllipse(cx, cy, rx, ry, r, g, b, a = 255) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist <= 1) {
        const edgeDist = 1 - dist;
        const alpha = edgeDist < 0.1 ? Math.floor(a * edgeDist * 10) : a;
        setPixel(x, y, r, g, b, alpha);
      }
    }
  }
}

// Fill background with white
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    setPixel(x, y, 255, 255, 255, 255);
  }
}

// Draw tomato body (red circle)
const centerX = SIZE / 2;
const centerY = SIZE / 2 + 10;
const radius = SIZE * 0.35;

drawCircle(centerX, centerY, radius, 220, 50, 50);

// Add highlight (lighter spot)
drawCircle(centerX - 20, centerY - 25, radius * 0.3, 255, 100, 100, 180);

// Draw stem (green rectangle)
for (let y = centerY - radius - 20; y < centerY - radius + 5; y++) {
  for (let x = centerX - 3; x <= centerX + 3; x++) {
    setPixel(x, y, 80, 140, 60);
  }
}

// Draw leaf (green ellipse)
drawEllipse(centerX + 15, centerY - radius - 5, 20, 8, 100, 180, 80);

// Draw second leaf
drawEllipse(centerX - 15, centerY - radius - 5, 18, 7, 90, 160, 70);

// Convert to PNG format
function createPNG() {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk (image header)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(SIZE, 0);  // width
  ihdrData.writeUInt32BE(SIZE, 4);  // height
  ihdrData.writeUInt8(8, 8);        // bit depth
  ihdrData.writeUInt8(6, 9);        // color type (RGBA)
  ihdrData.writeUInt8(0, 10);       // compression method
  ihdrData.writeUInt8(0, 11);       // filter method
  ihdrData.writeUInt8(0, 12);       // interlace method
  
  const ihdr = createChunk('IHDR', ihdrData);
  
  // IDAT chunk (image data)
  // Add filter byte (0 = none) before each row
  const rawData = Buffer.alloc(SIZE * (SIZE * 4 + 1));
  for (let y = 0; y < SIZE; y++) {
    rawData[y * (SIZE * 4 + 1)] = 0; // filter type
    pixels.copy(rawData, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
  }
  
  const compressedData = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressedData);
  
  // IEND chunk (image end)
  const iend = createChunk('IEND', Buffer.alloc(0));
  
  // Combine all chunks
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate and save icon
const iconPath = path.join(__dirname, 'icon.png');

try {
  const pngData = createPNG();
  fs.writeFileSync(iconPath, pngData);
  
  console.log('✅ Icon created: desktop/icon.png');
  console.log(`   Size: ${SIZE}x${SIZE} pixels`);
  console.log('   Format: PNG with transparency');
  console.log('   Design: Red tomato with green leaves');
} catch (err) {
  console.error('❌ Failed to create icon:', err.message);
  process.exit(1);
}
