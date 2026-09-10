import * as consoleViews from './views.js';
import * as kineticViews from './views-kinetic.js';
import { mountShell, syncShell, ambient } from './shell.js';

const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');

const state = {
  layout: root.dataset.layout === 'kinetic' ? 'kinetic' : 'console',
  skin: root.dataset.skin === 'cyber' ? 'cyber' : 'pro',
  mode: root.dataset.mode === 'dark' ? 'dark' : 'light',
};

const ROUTES = ['/', '/resume', '/projects', '/building', '/contact'];
const TITLES = {
  '/': 'Vijay Krishna Kudva — Engineering Leader',
  '/projects': 'Projects — Vijay Krishna Kudva',
  '/building': 'Building — Vijay Krishna Kudva',
  '/resume': 'Résumé — Vijay Krishna Kudva',
  '/contact': 'Contact — Vijay Krishna Kudva',
};

const views = () => (state.layout === 'kinetic' ? kineticViews : consoleViews);

function viewFor(path) {
  const v = views();
  if (path === '/') return v.home;
  if (path === '/projects') return v.projectsView;
  if (path === '/building') return v.buildingView;
  if (path === '/resume') return v.resumeView;
  if (path === '/contact') return v.contactView;
  return v.notFound;
}

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
function paint(path) {
  document.getElementById('main').innerHTML = viewFor(path)();
  document.title = TITLES[path] || 'Not found — Vijay Krishna Kudva';
  document.querySelectorAll('[data-nav] a').forEach((a) => {
    if (new URL(a.href).pathname === path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  syncShell();
}

function remount() {
  mountShell(state.layout);
  paint(location.pathname);
  ambient();
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
  animate(() => { paint(path); window.scrollTo(0, 0); });
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
  if (path !== location.pathname) go(path);
});

addEventListener('popstate', () => go(location.pathname, false));

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
