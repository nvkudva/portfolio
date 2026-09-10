import { profile } from './data.js';

const NAV = [
  ['/', 'Overview'],
  ['/resume', 'Résumé'],
  ['/projects', 'Projects'],
  ['/building', 'Building'],
  ['/contact', 'Contact'],
];

/* Reachable from every page, in one tap: mail client or dialer. */
const tel = (n) => n.replace(/\s/g, '');
const hail = (cls) => `
  <div class="${cls}">
    <a href="mailto:${profile.email}">${profile.email}</a>
    ${profile.phones.map((n) => `<a href="tel:${tel(n)}">${n}</a>`).join('')}
  </div>`;

/* The quiet layout switch that lives in the footer of every page. */
const switcher = () => `
  <span class="swap">
    <button data-act="layout:console" class="swap-b">Console</button>
    <i>·</i>
    <button data-act="layout:kinetic" class="swap-b">Kinetic</button>
  </span>`;

const foot = () => `
  <footer class="sitefoot">
    <span>Built as a PWA · offline ready · no framework</span>
    ${switcher()}
    <span>© ${new Date().getFullYear()} ${profile.name}</span>
  </footer>`;

/* ---------------------------------------------------------- console */
const console_ = () => `
  <div class="shell">
    <nav class="rail" aria-label="Primary">
      <a class="brand" href="/" data-link>
        <span>${profile.name}<small>Engineering Leader</small></span>
      </a>

      ${hail('hail')}

      <div class="nav" data-nav>
        ${NAV.map(([h, t]) => `<a href="${h}" data-link>${t}</a>`).join('')}
      </div>

      <div class="ctl">
        <div class="skin" role="group" aria-label="Persona">
          <button data-act="skin:pro">EXECUTIVE</button>
          <button data-act="skin:cyber">OVERDRIVE</button>
        </div>
        <button class="tsw" data-act="mode:toggle" role="switch" title="Toggle dark mode" aria-label="Dark mode"><svg class="sun" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6"/><path d="M10 1.6v2.2M10 16.2v2.2M18.4 10h-2.2M3.8 10H1.6M15.94 4.06l-1.56 1.56M5.62 14.38l-1.56 1.56M15.94 15.94l-1.56-1.56M5.62 5.62L4.06 4.06"/></svg><svg class="moon" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.2 12.4A7 7 0 017.6 3.8a6.6 6.6 0 108.6 8.6z"/></svg></button>
      </div>

      <div class="railfoot">
        <b>●</b> Open to leadership roles<br>
        Bangalore · UTC+5:30
      </div>
    </nav>

    <main id="main"></main>
  </div>
  <div class="footwrap">${foot()}</div>`;

/* ---------------------------------------------------------- kinetic */
const kinetic = () => `
  <div id="spot" aria-hidden="true"></div>
  <div id="grain" aria-hidden="true"></div>

  <header class="k-head">
    <div class="k-nav">
      <a class="k-mark" href="/" data-link>VK<em>.</em></a>
      <ul data-nav>
        ${NAV.map(([h, t]) => `<li><a href="${h}" data-link>${t}</a></li>`).join('')}
      </ul>
      ${hail('k-hail')}
      <button class="tsw" data-act="mode:toggle" role="switch" title="Toggle dark mode" aria-label="Dark mode"><svg class="sun" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6"/><path d="M10 1.6v2.2M10 16.2v2.2M18.4 10h-2.2M3.8 10H1.6M15.94 4.06l-1.56 1.56M5.62 14.38l-1.56 1.56M15.94 15.94l-1.56-1.56M5.62 5.62L4.06 4.06"/></svg><svg class="moon" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.2 12.4A7 7 0 017.6 3.8a6.6 6.6 0 108.6 8.6z"/></svg></button>
      <button class="k-switch" data-act="skin:toggle"><span data-skin-name>Executive</span><span class="k-orb"></span></button>
    </div>
  </header>

  <div class="k-wrap z">
    <main id="main"></main>
    ${foot()}
  </div>`;

export function mountShell(layout) {
  document.getElementById('app').innerHTML = layout === 'kinetic' ? kinetic() : console_();
}

export function syncShell() {
  const r = document.documentElement;
  const cyber = r.dataset.skin === 'cyber';
  const dark = r.dataset.mode === 'dark';

  document.querySelectorAll('[data-act]').forEach((b) => {
    const act = b.dataset.act;
    if (act === 'skin:pro') b.setAttribute('aria-pressed', String(!cyber));
    if (act === 'skin:cyber') b.setAttribute('aria-pressed', String(cyber));
    if (act === 'mode:toggle') b.setAttribute('aria-checked', String(dark));
    if (act === 'layout:console') b.setAttribute('aria-pressed', String(r.dataset.layout !== 'kinetic'));
    if (act === 'layout:kinetic') b.setAttribute('aria-pressed', String(r.dataset.layout === 'kinetic'));
  });

  const sn = document.querySelector('[data-skin-name]');
  if (sn) sn.textContent = cyber ? 'Overdrive' : 'Executive';
}

/* Kinetic's cursor halo. Pointer-fine only, and never for reduced motion. */
export function ambient() {
  const spot = document.getElementById('spot');
  if (!spot) return;
  if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let tx = innerWidth / 2, ty = innerHeight * 0.3, cx = tx, cy = ty, live = true;
  const move = (e) => { tx = e.clientX; ty = e.clientY; };
  addEventListener('pointermove', move);
  (function loop() {
    if (!document.getElementById('spot')) { live = false; removeEventListener('pointermove', move); return; }
    cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
    spot.style.left = `${cx}px`; spot.style.top = `${cy}px`;
    if (live) requestAnimationFrame(loop);
  }());
}
