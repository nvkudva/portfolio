import {
  profile, stats, tenets, platforms, projects,
  experience, strengths, speaking, writing, education, socials, icons,
} from './data.js';
import { qr } from './qr.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const svg = (k) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${icons[k]}"/></svg>`;
const ext = (u) => (u.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '');

const portrait = () => `
  <div class="rise" style="animation-delay:.2s">
    <div class="portrait">
      <i class="tick tl"></i><i class="tick tr"></i><i class="tick bl"></i><i class="tick br"></i>
      <img src="/assets/img/portrait.jpg" alt="Vijay Krishna Kudva" width="1200" height="1600" fetchpriority="high">
    </div>
    <div class="portcap">Bangalore, 2026</div>
  </div>`;

const STATUS = {
  live: ['Live', 'ok'],
  'broken-deployment': ['Deploy broken', 'warn'],
  'no-deployment': ['Not deployed', 'off'],
  'not-web': ['Android app', 'off'],
};

/* Two destinations per project, as one split control: the running app on the
   left, the code on the right. A half that has nowhere to go is disabled and
   says why, rather than being hidden. */
function actions(p, repo) {
  const liveOn = p.status === 'live' && p.deployUrl;
  const liveWhy = p.status === 'broken-deployment' ? 'Deploy 404'
    : p.status === 'not-web' ? 'Android app' : 'Not deployed';

  const live = liveOn
    ? `<a class="pact" href="${p.deployUrl}" target="_blank" rel="noopener noreferrer">${svg('live')}Live site</a>`
    : `<span class="pact off" aria-disabled="true">${svg('live')}${esc(liveWhy)}</span>`;

  const source = p.private
    ? `<span class="pact off" aria-disabled="true">${svg('github')}Private</span>`
    : `<a class="pact" href="${repo}" target="_blank" rel="noopener noreferrer">${svg('github')}Source</a>`;

  return `<div class="pacts">${live}${source}</div>`;
}

/* Project card: screenshot, copy, and a QR to the live URL. */
function card(p, i) {
  const [label, tone] = STATUS[p.status] || STATUS['no-deployment'];
  const repo = `https://github.com/nvkudva/${p.name}`;
  const shot = p.shot
    ? `<img src="${p.shot}" alt="Screenshot of ${esc(p.title)}" loading="lazy" decoding="async" width="1100" height="688">`
    : `<div class="noshot"><span>${esc(p.title)}</span><small>${esc(label)}</small></div>`;

  return `
    <article class="pcard">
      <div class="pshot">${shot}<span class="pno">${String(i + 1).padStart(2, '0')}</span></div>
      <div class="pbody">
        <div class="phead">
          <h3>${esc(p.title)}</h3>
          <span class="pstat ${tone}">${esc(label)}</span>
        </div>
        <p>${esc(p.desc)}</p>
        <div class="tags">
          ${p.lang ? `<span class="tag lang">${esc(p.lang)}</span>` : ''}
          ${p.license ? `<span class="tag">${esc(p.license)}</span>` : ''}
          ${p.private ? '<span class="tag lock">private repo</span>' : ''}
          ${p.draft ? '<span class="tag draft">description draft</span>' : ''}
        </div>
        <div class="pfoot">
          ${p.status === 'live' && p.deployUrl
            ? `<a class="pqr" href="${p.deployUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(p.title)} on your phone" title="Scan or click to open ${esc(p.title)}">${qr[p.name] || ''}</a>`
            : ''}
          <div class="pstack">
            ${actions(p, repo)}
            <small class="phost">${p.deployUrl
              ? esc(p.deployUrl.replace(/^https:\/\//, '').replace(/\/$/, '')) + (p.host ? ` · ${esc(p.host)}` : '')
              : `github.com/nvkudva/${esc(p.name)}`}</small>
          </div>
        </div>
      </div>
    </article>`;
}

const socialRow = () => `
  <div class="links">
    ${socials.map((s) => `
      <a class="link" href="${s.u}"${ext(s.u)}>
        ${svg(s.i)}
        <span>${esc(s.n)}<small>${esc(s.h)}</small></span>
      </a>`).join('')}
  </div>`;

/* ------------------------------------------------------------------ */

export const home = () => `
  <section class="hero">
    <div>
      <div class="statusline rise">
        <span>${esc(profile.location)}</span><span class="sep">·</span>
        <span><b>●</b> ${esc(profile.status)}</span><span class="sep">·</span>
        <span>${esc(profile.pedigree)}</span>
      </div>
      <h1 class="rise" style="animation-delay:.05s">${esc(profile.name)}</h1>
      <p class="lede rise" style="animation-delay:.1s">${profile.lede[0]}</p>
      <p class="lede rise" style="animation-delay:.14s" >${profile.lede[1]}</p>
      <div class="cta rise" style="animation-delay:.18s">
        <a class="btn primary" href="${profile.resume}" download>Download résumé ↓</a>
        <a class="btn" href="https://www.linkedin.com/in/nvkudva/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  </section>

  <section>
    <div class="eyebrow">By the numbers</div>
    <div class="stats" style="margin-top:0">
      ${stats.map((s) => `<div class="stat"><b>${esc(s.v)}</b><span>${esc(s.k)}</span></div>`).join('')}
    </div>
  </section>

  <section>
    <div class="eyebrow">How I run an engineering org in the AI era</div>
    <h2>Four tenets I actually operate by</h2>
    <p class="sublede" style="margin-bottom:28px">Not predictions. These are the rules I use to decide where humans spend attention.</p>
    <div class="tenets">
      ${tenets.map((t, i) => `
        <div class="tenet">
          <span class="n">0${i + 1}</span>
          <h3>${esc(t.t)}</h3>
          <p>${esc(t.d)}</p>
        </div>`).join('')}
    </div>
  </section>

  <section>
    <div class="eyebrow">Off the clock</div>
    <p style="font-size:17px">${esc(profile.personal)}</p>
  </section>`;

/* ------------------------------------------------------------------ */

export const projectsView = () => `
  <section style="padding-top:24px">
    <div class="eyebrow">Platforms · shipped at scale</div>
    <h1 style="font-size:clamp(28px,4vw,44px)">Things I built, not things I approved</h1>
    <p class="sublede" style="margin-bottom:22px">Six platforms that carried real traffic, real agents and real revenue.</p>
    <div style="margin-top:24px">
      ${platforms.map((p) => `
        <article class="plat">
          <div>
            <div class="org">${esc(p.org)} <span>${esc(p.years)}</span></div>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.body)}</p>
          </div>
          <div class="mx">
            <div class="mxh">Impact</div>
            ${p.metrics.map(([v, k]) => `<div><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join('')}
          </div>
        </article>`).join('')}
    </div>
    <div class="cta">
      <a class="btn" href="/building" data-link>What I'm building now →</a>
    </div>
  </section>`;

/* ------------------------------------------------------------------ */

export const buildingView = () => `
  <section style="padding-top:24px">
    <div class="eyebrow">Personal projects · built since May 2025</div>
    <h1 style="font-size:clamp(28px,4vw,44px)">What I'm building now</h1>
    <p class="sublede" style="margin-bottom:22px">Hands-on applied AI, shipped on evenings and weekends. Scan a code to open the live app on your phone.</p>
  </section>

  <section style="padding-top:0">
    <div class="pgrid">
      ${projects.map((p, i) => card(p, i)).join('')}
    </div>
    <div class="cta">
      <a class="btn" href="https://github.com/nvkudva?tab=repositories" target="_blank" rel="noopener noreferrer">All repositories on GitHub ↗</a>
    </div>
  </section>`;

/* ------------------------------------------------------------------ */

export const resumeView = () => `
  <section style="padding-top:24px">
    <div class="eyebrow">Résumé</div>
    <h1 style="font-size:clamp(28px,4vw,44px)">Seventeen years, and still in the editor</h1>
  </section>

  <section>
    <div class="eyebrow">Experience</div>
    ${experience.map((e) => `
      <article class="job">
        <div><div class="when">${esc(e.years)}</div><div class="where">${esc(e.where)}</div></div>
        <div>
          <h3>${esc(e.title)}</h3>
          <div class="org">${esc(e.org)}</div>
          <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </div>
      </article>`).join('')}
  </section>

  <section>
    <div class="eyebrow">Core strengths</div>
    ${Object.entries(strengths).map(([k, v]) => `
      <h3 style="margin-top:18px">${esc(k)}</h3>
      <div class="chips">${v.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>`).join('')}
  </section>

  <section>
    <div class="eyebrow">Speaking &amp; recognition</div>
    <div class="rows">
      ${speaking.map((s) => `
        <div class="row"><span class="y">${esc(s.y)}</span><span class="t">${esc(s.t)}</span><span class="badge">${esc(s.tag)}</span></div>`).join('')}
    </div>
  </section>

  <section>
    <div class="eyebrow">Writing · medium.com/@nvkudva</div>
    <div class="rows">
      ${writing.map((w) => `
        <a class="row" href="${w.u}" target="_blank" rel="noopener noreferrer"><span class="y">${esc(w.d.split(' ')[1])}</span><span class="t">${esc(w.t)}</span><span class="badge">Read ↗</span></a>`).join('')}
    </div>
  </section>

  <section>
    <div class="eyebrow">Education</div>
    <div class="rows">
      ${education.map((e) => `
        <div class="row"><span class="y">${esc(e.y.slice(0, 4))}</span><span class="t"><b style="color:var(--ink)">${esc(e.d)}</b> — ${esc(e.o)}</span><span class="badge">${esc(e.y)}</span></div>`).join('')}
    </div>
  </section>`;

/* ------------------------------------------------------------------ */

export const contactView = () => `
  <section style="padding-top:24px">
    <div class="eyebrow">Contact</div>
    <h1 style="font-size:clamp(28px,4vw,44px)">Let's talk</h1>
    <p class="lede" style="margin-top:18px">
      I'm open to senior engineering leadership roles driving AI-forward platform and product engineering at scale.
      Fastest route is email — I reply within a day.
    </p>
    <div class="cta">
      <a class="btn primary" href="mailto:${profile.email}">${esc(profile.email)}</a>
      ${profile.phones.map((p) => `<a class="btn" href="tel:${p.replace(/\s/g, '')}">${esc(p)}</a>`).join('')}
    </div>
  </section>

  <section>
    <div class="eyebrow">Everywhere else</div>
    ${socialRow()}
  </section>`;

export const notFound = () => `
  <section style="padding-top:24px">
    <div class="eyebrow">404</div>
    <h1>That page doesn't exist</h1>
    <p class="lede">The link may be old, or I may have moved things around.</p>
    <div class="cta"><a class="btn primary" href="/" data-link>Back to overview</a></div>
  </section>`;

/* ------------------------------------------------------------------ */

/* One scrollable document. Each pane is a scroll target for the nav. */
export const page = () => `
  <div class="pane" id="overview">${home()}</div>
  <div class="pane" id="resume">${resumeView()}</div>
  <div class="pane" id="projects">${projectsView()}</div>
  <div class="pane" id="building">${buildingView()}</div>
  <div class="pane" id="contact">${contactView()}</div>`;
