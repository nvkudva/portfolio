/* Rasterises the VK mark to PNG without any dependency.
   Run: node scripts/make-icons.mjs */
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const INK = [0x12, 0x15, 0x1b];
const PAPER = [0xf1, 0xf2, 0xf5];
const ACCENT = [0x1f, 0x4f, 0xd8];

/* Signed area test for a filled polygon, sampled 3x3 per pixel for cheap AA. */
const inPoly = (pts, x, y) => {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

/* The two glyph strokes, in a 512-unit design space. */
const V = [[132, 150], [184, 150], [210, 258], [236, 150], [288, 150], [220, 362], [200, 362]];
const K = [[300, 150], [348, 150], [348, 242], [416, 150], [472, 150], [388, 258], [476, 362], [418, 362], [348, 274], [348, 362], [300, 362]];

function render(size, maskable) {
  const s = size / 512;
  const pad = maskable ? 0.78 : 1;          // maskable art must survive a circular crop
  const radius = maskable ? size / 2 : size * 0.219;
  const px = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bg = 0, v = 0, k = 0;
      for (let sy = 0; sy < 3; sy++) {
        for (let sx = 0; sx < 3; sx++) {
          const px0 = x + (sx + 0.5) / 3;
          const py0 = y + (sy + 0.5) / 3;

          /* rounded-square background */
          const cx = Math.min(Math.max(px0, radius), size - radius);
          const cy = Math.min(Math.max(py0, radius), size - radius);
          if (Math.hypot(px0 - cx, py0 - cy) <= radius) bg++;

          /* glyph, scaled about the centre for maskable padding */
          const gx = ((px0 - size / 2) / (s * pad)) + 256;
          const gy = ((py0 - size / 2) / (s * pad)) + 256;
          if (inPoly(V, gx, gy)) v++;
          if (inPoly(K, gx, gy)) k++;
        }
      }
      const i = (y * size + x) * 4;
      const bgA = bg / 9;
      let col = INK;
      if (k) col = ACCENT.map((c, n) => Math.round((c * k + INK[n] * (9 - k)) / 9));
      else if (v) col = PAPER.map((c, n) => Math.round((c * v + INK[n] * (9 - v)) / 9));
      px[i] = col[0]; px[i + 1] = col[1]; px[i + 2] = col[2];
      px[i + 3] = Math.round(bgA * 255);
    }
  }
  return png(px, size, size);
}

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = c ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(px, w, h) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    Buffer.from(px.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

writeFileSync('assets/img/icon-192.png', render(192, false));
writeFileSync('assets/img/icon-512.png', render(512, false));
writeFileSync('assets/img/icon-maskable.png', render(512, true));
console.log('icons written');
