import * as consoleViews from './views.js';
import * as kineticViews from './views-kinetic.js';
import { mountShell, syncShell, ambient } from './shell.js';

/* The app decides where a load lands (a deep link is a scroll position now),
   so the browser must not restore the previous one over the top of it. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');

const state = {
  layout: root.dataset.layout === 'kinetic' ? 'kinetic' : 'console',
  skin: root.dataset.skin === 'cyber' ? 'cyber' : 'pro',
  mode: root.dataset.mode === 'dark' ? 'dark' : 'light',
};

/* path <-> pane id. The site is one document; a route is a scroll position. */
const ROUTES = [
  ['/', 'overview'],
  ['/resume', 'resume'],
  ['/projects', 'projects'],
  ['/building', 'building'],
  ['/contact', 'contact'],
];
const idFor = (path) => (ROUTES.find(([p]) => p === path) || ROUTES[0])[1];
const pathFor = (id) => (ROUTES.find(([, i]) => i === id) || ROUTES[0])[0];

const TITLES = {
  '/': 'Vijay Krishna Kudva — Engineering Leader',
  '/projects': 'Projects — Vijay Krishna Kudva',
  '/building': 'Building — Vijay Krishna Kudva',
  '/resume': 'Résumé — Vijay Krishna Kudva',
  '/contact': 'Contact — Vijay Krishna Kudva',
};

const views = () => (state.layout === 'kinetic' ? kineticViews : consoleViews);


/* ---------------- persistence ---------------- */
function save() {
  try { localStorage.setItem('vk.theme', JSON.stringify(state)); } catch { /* private mode */ }
}
function stamp() {
  root.dataset.layout = state.layout;
  root.dataset.skin = state.skin;
  root.dataset.mode = state.mode;
  themeMeta.content = getComputedStyle(root)
    .getPropertyValue(state.layout === 'kinetic' ? '--void' : '--paper').trim();
  save();
}

/* ---------------- render ---------------- */
function markNav(path) {
  document.querySelectorAll('[data-nav] a').forEach((a) => {
    if (new URL(a.href).pathname === path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* The sticky rail (mobile) and the fixed kinetic header sit over the page,
   so panes need to stop below them. */
function stick() {
  const k = document.querySelector('.k-head');
  const rail = document.querySelector('.rail');
  let h = 0;
  if (k) h = k.getBoundingClientRect().height;
  else if (rail && matchMedia('(max-width:960px)').matches) h = rail.getBoundingClientRect().height;
  root.style.setProperty('--stick', `${Math.round(h)}px`);
}

/* Programmatic scrolls pass over every pane in between; the spy stays quiet
   until the scroll settles so the nav doesn't strobe. */
let locked = false;
let unlock;
function lock() {
  locked = true;
  clearTimeout(unlock);
  unlock = setTimeout(() => { locked = false; }, 700);
}

let spy;
function watchPanes() {
  spy?.disconnect();
  spy = new IntersectionObserver((entries) => {
    if (locked) return;
    const hit = entries.filter((e) => e.isIntersecting)[0];
    if (!hit) return;
    const path = pathFor(hit.target.id);
    if (path === location.pathname) return;
    history.replaceState({}, '', path);
    document.title = TITLES[path];
    markNav(path);
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  document.querySelectorAll('.pane').forEach((el) => spy.observe(el));
}

function paint() {
  document.getElementById('main').innerHTML = views().page();
  stick();
  watchPanes();
  markNav(location.pathname);
  document.title = TITLES[location.pathname] || TITLES['/'];
  syncShell();
}

function jump(path, smooth) {
  const el = document.getElementById(idFor(path));
  if (!el) return;
  const glide = smooth && !matchMedia('(prefers-reduced-motion:reduce)').matches;
  lock();
  snap(el, glide);
  settle(el, ++trip);
}

/* `html { scroll-behavior: smooth }` outranks a behavior:'auto' option in some
   engines, so an instant landing has to switch the CSS off around the scroll. */
function snap(el, glide) {
  if (glide) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  el.scrollIntoView({ block: 'start' });
  root.style.scrollBehavior = prev;
}

/* Webfonts and lazy screenshots change the height of everything above the
   target after the scroll has already landed, which leaves the section short
   of the top. Re-align while the page settles — but yield the moment the
   reader takes over. */
let trip = 0;
function settle(el, mine) {
  const want = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const events = ['wheel', 'touchstart', 'keydown'];
  let live = true;
  let last = -1;
  const stop = () => { live = false; };
  events.forEach((e) => addEventListener(e, stop, { passive: true }));

  (function tick(n) {
    /* A newer jump supersedes this one. */
    if (!live || mine !== trip || n > 12) { events.forEach((e) => removeEventListener(e, stop)); return; }
    const y = Math.round(scrollY);
    /* Only correct once the scroll has stopped moving, so a smooth glide
       isn't cut short. */
    if (y === last && Math.abs(el.getBoundingClientRect().top - want) > 2) {
      lock();
      snap(el, false);
    }
    last = y;
    setTimeout(() => tick(n + 1), 120);
  }(0));
}

function remount() {
  const here = location.pathname;
  mountShell(state.layout);
  paint();
  ambient();
  jump(here, false);
}

function animate(fn) {
  const ok = document.startViewTransition
    && !document.hidden
    && !matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (!ok) { fn(); return; }
  const t = document.startViewTransition(fn);
  /* A transition can be aborted (tab hidden, another one starts). That rejects
     these promises; swallow it so it never surfaces as an unhandled rejection. */
  t.ready.catch(() => {});
  t.finished.catch(() => {});
  t.updateCallbackDone.catch(() => {});
}

function go(path, push = true) {
  if (push) history.pushState({}, '', path);
  markNav(path);
  document.title = TITLES[path] || TITLES['/'];
  jump(path, push);
}

/* ---------------- interaction ---------------- */
document.addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]');
  if (act) {
    const [kind, val] = act.dataset.act.split(':');
    if (kind === 'skin') {
      state.skin = val === 'toggle' ? (state.skin === 'cyber' ? 'pro' : 'cyber') : val;
      /* each persona carries its own daylight; the mode control still overrides after */
      state.mode = state.skin === 'cyber' ? 'dark' : 'light';
      animate(() => { stamp(); syncShell(); });
    } else if (kind === 'mode') {
      state.mode = val === 'toggle' ? (state.mode === 'dark' ? 'light' : 'dark') : val;
      animate(() => { stamp(); syncShell(); });
    } else if (kind === 'layout') {
      const next = val === 'toggle' ? (state.layout === 'kinetic' ? 'console' : 'kinetic') : val;
      if (next === state.layout) return;
      state.layout = next;
      animate(() => { stamp(); remount(); });
    }
    return;
  }

  const a = e.target.closest('a[data-link]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const path = new URL(a.href).pathname;
  e.preventDefault();
  go(path);
});

addEventListener('popstate', () => go(location.pathname, false));
addEventListener('resize', stick);

stamp();
remount();

/* ---------------- pwa + update flow ---------------- */
function showUpdateToast(waiting) {
  if (document.querySelector('.toast')) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `
    <span>A new version is available.</span>
    <button class="toast-go">Reload</button>
    <button class="toast-x" aria-label="Dismiss">✕</button>`;
  document.body.append(el);
  setTimeout(() => el.classList.add('in'), 30);

  el.querySelector('.toast-go').onclick = () => {
    el.querySelector('.toast-go').textContent = 'Reloading…';
    waiting.postMessage('SKIP_WAITING');
  };
  el.querySelector('.toast-x').onclick = () => el.classList.remove('in');
}

if ('serviceWorker' in navigator) {
  addEventListener('load', async () => {
    let reg;
    try { reg = await navigator.serviceWorker.register('/sw.js'); } catch { return; }

    if (reg.waiting && navigator.serviceWorker.controller) showUpdateToast(reg.waiting);

    reg.addEventListener('updatefound', () => {
      const fresh = reg.installing;
      if (!fresh) return;
      fresh.addEventListener('statechange', () => {
        /* `controller` is null on a first install — no prompt for a first visit. */
        if (fresh.state === 'installed' && navigator.serviceWorker.controller) showUpdateToast(fresh);
      });
    });

    const check = () => { if (navigator.onLine) reg.update().catch(() => {}); };
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    setInterval(check, 60 * 60 * 1000);
  });

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
}
