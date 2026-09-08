/* Removes every APPn metadata segment from a JPEG except APP0/JFIF.
   That drops the EXIF block — which carries GPS coordinates, the device model
   and the orientation flag that makes browsers re-rotate an already-rotated
   image. Pixels are untouched.

   Run: node scripts/strip-exif.mjs <in.jpg> [out.jpg] */
import { readFileSync, writeFileSync } from 'node:fs';

const [, , input, output = input] = process.argv;
if (!input) {
  console.error('usage: node scripts/strip-exif.mjs <in.jpg> [out.jpg]');
  process.exit(1);
}

const buf = readFileSync(input);
if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('Not a JPEG');

const keep = [buf.subarray(0, 2)]; // SOI
let i = 2;
const dropped = [];

while (i < buf.length - 1) {
  if (buf[i] !== 0xff) { i++; continue; }
  const marker = buf[i + 1];

  /* Start of scan — the rest is entropy-coded image data, copy verbatim. */
  if (marker === 0xda) { keep.push(buf.subarray(i)); break; }
  /* Standalone markers carry no length. */
  if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9) || marker === 0x01) {
    keep.push(buf.subarray(i, i + 2)); i += 2; continue;
  }

  const len = buf.readUInt16BE(i + 2);
  const seg = buf.subarray(i, i + 2 + len);
  /* APP1..APP15 are metadata (Exif, XMP, Photoshop). APP0 is JFIF — keep it. */
  if (marker >= 0xe1 && marker <= 0xef) dropped.push(`APP${marker - 0xe0} (${len} bytes)`);
  else keep.push(seg);
  i += 2 + len;
}

writeFileSync(output, Buffer.concat(keep));
console.log(`${input} -> ${output}`);
console.log(dropped.length ? `  removed: ${dropped.join(', ')}` : '  nothing to remove');
