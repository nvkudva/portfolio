/* Stamps sw.js with a new cache version so deployed clients see the update prompt.
   Run before every deploy:  node scripts/release.mjs */
import { readFileSync, writeFileSync } from 'node:fs';

const path = 'sw.js';
const src = readFileSync(path, 'utf8');
const match = src.match(/^const VERSION = '(.+)';$/m);
if (!match) {
  console.error('Could not find the VERSION line in sw.js');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const prev = match[1];
/* Same day as the last release: increment the counter. Otherwise start at 1. */
const n = prev.startsWith(`vk-${today}-`) ? Number(prev.split('-').pop()) + 1 : 1;
const next = `vk-${today}-${n}`;

writeFileSync(path, src.replace(match[0], `const VERSION = '${next}';`));
console.log(`${prev}  ->  ${next}`);
