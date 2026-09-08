/* Captures a desktop screenshot of each live project, driving past demo
   sign-in screens so the card shows the actual product rather than a login box.
   Uses the system Chrome via puppeteer-core — nothing is downloaded.

   Run: node scripts/shoot.mjs [projectName ...]  */
import puppeteer from 'puppeteer-core';
import { projects } from '../assets/js/data.js';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 2 };

/* Per-project recipes for getting past a demo gate to a real screen.
   `url` overrides data.js when the production URL isn't the screenshotable one. */
const FLOWS = {
  SmartFin: { click: ['Continue as Priya'], settle: 3500 },
  'AI-Doctor': { click: ['Alex Kumar'], settle: 4000 },
  AgentOS: { url: 'https://8e153e2b.agentos-cx9.pages.dev', settle: 3000 },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Clicks the first element whose visible text matches — works regardless of
   whether the app renders a <button>, an <a> or a clickable <div>. */
async function clickText(page, text) {
  const handle = await page.evaluateHandle((t) => {
    const els = [...document.querySelectorAll('button,a,[role="button"],div,li,span')];
    return els.reverse().find((e) => {
      const own = e.textContent?.trim();
      if (!own || own.length > 80 || !own.includes(t)) return false;
      const r = e.getBoundingClientRect();
      return r.width > 40 && r.height > 20;
    }) || null;
  }, text);
  const el = handle.asElement();
  if (!el) return false;
  await el.click();
  return true;
}

const wanted = process.argv.slice(2);
const targets = projects.filter(
  (p) => p.shot && (wanted.length ? wanted.includes(p.name) : p.status === 'live' || FLOWS[p.name]),
);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
});

for (const p of targets) {
  const flow = FLOWS[p.name] || {};
  const url = flow.url || p.deployUrl;
  if (!url) continue;

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  process.stdout.write(`${p.title.padEnd(24)} ${url} ... `);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(1500);

    for (const label of flow.click || []) {
      const hit = await clickText(page, label);
      process.stdout.write(hit ? `[clicked "${label}"] ` : `[MISS "${label}"] `);
      await sleep(flow.settle ?? 2500);
    }
    await sleep(flow.click ? 500 : (flow.settle ?? 1200));

    await page.screenshot({ path: `.${p.shot.replace(/\.jpg$/, '.png')}`, type: 'png' });
    console.log('ok');
  } catch (e) {
    console.log(`FAILED — ${e.message.split('\n')[0]}`);
  }
  await page.close();
}

await browser.close();
console.log('\nNow compress:  npm run shots:compress');
