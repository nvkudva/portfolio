/* Re-captures a screenshot for every project with status "live".
   Uses the Cloudflare Browser Rendering API — no local browser needed.
   Run: node scripts/shoot.mjs */
import { writeFileSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { projects } from '../assets/js/data.js';

const ACCOUNT = '2d75601049141cae45c6ac816a73e7d2';

function token() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  const cfg = join(homedir(), 'Library/Preferences/.wrangler/config/default.toml');
  const m = readFileSync(cfg, 'utf8').match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!m) throw new Error('No token: set CLOUDFLARE_API_TOKEN or run `wrangler login`.');
  return m[1];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot(url, out, auth) {
  /* The API caps concurrent browser sessions; 429 is expected under load. */
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/browser-rendering/screenshot`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          viewport: { width: 1280, height: 800 },
          gotoOptions: { waitUntil: 'networkidle0', timeout: 30000 },
          screenshotOptions: { type: 'png' },
        }),
      },
    );
    if (res.ok) {
      writeFileSync(out, Buffer.from(await res.arrayBuffer()));
      return true;
    }
    if (res.status !== 429) {
      console.error(`  ${res.status} ${(await res.text()).slice(0, 140)}`);
      return false;
    }
    await sleep(25000);
  }
  return false;
}

const auth = token();
const live = projects.filter((p) => p.status === 'live' && p.deployUrl && p.shot);

for (const [i, p] of live.entries()) {
  const out = `.${p.shot}`;
  process.stdout.write(`${p.title.padEnd(24)} ${p.deployUrl} ... `);
  console.log(await shoot(p.deployUrl, out, auth) ? 'ok' : 'FAILED');
  if (i < live.length - 1) await sleep(20000);
}
