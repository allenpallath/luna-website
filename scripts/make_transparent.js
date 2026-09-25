import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

async function removeBackground(inputPath, outputPath, tolerance = 25) {
  console.log(`Processing: ${inputPath} -> ${outputPath}`);
  const image = await Jimp.read(inputPath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  const visited = new Uint8Array(width * height);
  const queue = [];

  function isWhite(x, y) {
    const idx = (y * width + x) * 4;
    const r = image.bitmap.data[idx];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    return r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance;
  }

  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) {
      queue.push(x, 0);
      visited[x] = 1;
    }
    if (isWhite(x, height - 1)) {
      queue.push(x, height - 1);
      visited[(height - 1) * width + x] = 1;
    }
  }

  for (let y = 0; y < height; y++) {
    if (isWhite(0, y) && !visited[y * width + 0]) {
      queue.push(0, y);
      visited[y * width + 0] = 1;
    }
    if (isWhite(width - 1, y) && !visited[y * width + (width - 1)]) {
      queue.push(width - 1, y);
      visited[y * width + (width - 1)] = 1;
    }
  }

  let head = 0;
  const dx = [0, 0, 1, -1];
  const dy = [1, -1, 0, 0];

  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];

    const pIdx = (cy * width + cx) * 4;
    image.bitmap.data[pIdx + 3] = 0;

    for (let i = 0; i < 4; i++) {
      const nx = cx + dx[i];
      const ny = cy + dy[i];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const vIdx = ny * width + nx;
        if (!visited[vIdx] && isWhite(nx, ny)) {
          visited[vIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  await image.write(outputPath);
  console.log(`Saved transparent image to: ${outputPath}`);
}

async function run() {
  const publicImages = path.resolve('public/images');

  const files = [
    { in: 'luna_sniffing.jpg', out: 'luna_sniffing_transparent.png' },
    { in: 'luna_paw_top.jpg', out: 'luna_paw_top_transparent.png' },
    { in: 'luna_portrait.jpg', out: 'luna_portrait_transparent.png' },
    { in: 'luna_game_open_mouth.jpg', out: 'luna_game_open_mouth_transparent.png' },
    { in: 'luna_vacuum.jpg', out: 'luna_vacuum_transparent.png' }
  ];

  for (const f of files) {
    const inPath = path.join(publicImages, f.in);
    const outPath = path.join(publicImages, f.out);
    if (fs.existsSync(inPath)) {
      await removeBackground(inPath, outPath, 25);
    }
  }
}

run().catch(console.error);
