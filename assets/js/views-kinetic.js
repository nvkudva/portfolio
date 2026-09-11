import {
  profile, stats, tenets, platforms, projects,
  experience, strengths, speaking, writing, education, socials, icons,
} from './data.js';
import { qr } from './qr.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const svg = (k) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${icons[k]}"/></svg>`;
const ext = (u) => (u.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '');

const head = (title, note) => `
  <div class="k-sechead">
    <h2>${title}</h2>
    ${note ? `<div class="k-note">${note}</div>` : ''}
  </div>`;

/* ------------------------------------------------------------------ */

export const home = () => `
  <section class="k-hero">
    <div class="k-tagline">${esc(profile.role)}</div>
    <h1>
      <span class="k-slide"><span>The</span></span>
      <span class="k-slide"><span class="k-out" style="animation-delay:.08s">Hands on</span></span>
      <span class="k-slide"><span class="k-fill" style="animation-delay:.16s">AI Leader</span></span>
    </h1>

    <div class="k-herofoot" style="grid-template-columns:minmax(0,1fr)">
      <div class="k-up" style="animation-delay:.5s">
        <p class="k-blurb">
          <b>${esc(profile.name)} — 17+ years in technology, 6+ leading engineering orgs.</b>
          I scaled a platform org from 3 to 24+ engineers across the US, India and Brazil,
          led Uber's first GenAI support bot for business customers, and architected platforms
          serving 30,000+ agents and 14M+ consumers.
        </p>
        <div class="k-acts">
          <a class="k-mag solid" href="${profile.resume}" download>Résumé ↓</a>
          <a class="k-mag" href="https://www.linkedin.com/in/nvkudva/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </div>

    <div class="k-ticker">
      <div class="k-track">
        ${[0, 1].map((i) => `
          <span${i ? ' aria-hidden="true"' : ''}>
            ${stats.map((s) => `${esc(s.v)} <b>${esc(s.k)}</b>`).join(' &nbsp;·&nbsp; ')} &nbsp;·&nbsp;
          </span>`).join('')}
      </div>
    </div>
  </section>

  <section>
    ${head('How I run<br>an AI-era org', 'Four tenets<br>I operate by')}
    <div class="k-tenets">
      ${tenets.map((t, i) => `
        <article class="k-card">
          <span class="k-no">0${i + 1}</span>
          <h3>${esc(t.t)}</h3>
          <p>${esc(t.d)}</p>
        </article>`).join('')}
    </div>
  </section>

  <section>
    ${head('Off the<br>clock')}
    <p class="k-blurb" style="max-width:56ch">${esc(profile.personal)}</p>
  </section>`;

/* ------------------------------------------------------------------ */

export const projectsView = () => `
  <section class="k-hero" style="padding-bottom:20px">
    <div class="k-tagline">Platforms · shipped at scale</div>
    <h1 style="font-size:clamp(46px,9vw,124px)">Things I built,<br>not things<br>I <span class="k-fill">approved</span>.</h1>
  </section>

  <section>
    ${head('Platform<br>work', 'Six systems that<br>carried real traffic')}
    <div>
      ${platforms.map((p) => `
        <article class="k-line">
          <div class="k-yr">${esc(p.years)}</div>
          <div>
            <h4>${esc(p.name)}</h4>
            <div class="k-org">${esc(p.org)}</div>
            <p>${esc(p.body)}</p>
            <div class="k-mx">
              ${p.metrics.map(([v, k]) => `<div><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join('')}
            </div>
          </div>
        </article>`).join('')}
    </div>
    <div class="k-acts" style="margin-top:34px">
      <a class="k-mag" href="/building" data-link>What I'm building now →</a>
    </div>
  </section>`;

/* ------------------------------------------------------------------ */

export const buildingView = () => `
  <section class="k-hero" style="padding-bottom:20px">
    <div class="k-tagline">Personal projects · since May 2025</div>
    <h1 style="font-size:clamp(46px,9vw,124px)">What I'm<br><span class="k-fill">building</span> now.</h1>
  </section>

  <section>
    ${head('Selected<br>repositories', 'github.com/nvkudva<br>drag or scroll →')}
    <div class="k-rail">
      ${projects.map((p, i) => {
        const st = { live:['Live','ok'], 'broken-deployment':['Deploy broken','warn'],
                     'no-deployment':['Not deployed','off'], 'not-web':['Android app','off'],
                     'closed-source':['Closed source','off'] }[p.status]
                   || ['Not deployed','off'];
        return `
        <article class="k-repo"${p.deployUrl || p.site ? ` data-open="${p.deployUrl || p.site}"` : ''}>
          <div class="k-shot">
            ${p.shot
              ? `<img src="${p.shot}" alt="Screenshot of ${esc(p.title)}" loading="lazy" decoding="async" width="1100" height="688">`
              : `<div class="k-noshot">${esc(p.title)}</div>`}
          </div>
          <span class="k-no">${String(i + 1).padStart(2, '0')} / ${esc((p.lang || 'REPO').toUpperCase())}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="k-stack">
            <i class="${st[1]}">${esc(st[0])}</i>
            ${p.wip ? '<i class="wip">in progress</i>' : ''}
            ${p.private ? '<i>\u{1F512} closed source</i>' : ''}
          </div>
          <div class="k-foot">
            ${(p.deployUrl || p.site) && qr[p.name]
              ? `<a class="k-qr" href="${p.deployUrl || p.site}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(p.title)} on your phone">${qr[p.name]}</a>`
              : ''}
            <div class="k-acts2">
              ${p.status === 'live' && p.deployUrl
                ? `<a class="k-act live" href="${p.deployUrl}" target="_blank" rel="noopener noreferrer">${svg('live')}Live</a>`
                : `<span class="k-act off">${svg('live')}${esc(p.status === 'broken-deployment' ? 'Deploy 404' : p.status === 'not-web' ? 'Android' : p.status === 'closed-source' ? 'Private app' : 'Not live')}</span>`}
              ${p.private
                ? `<span class="k-act off">${svg('github')}Closed source</span>`
                : `<a class="k-act" href="https://github.com/nvkudva/${p.name}" target="_blank" rel="noopener noreferrer">${svg('github')}Source</a>`}
            </div>
          </div>
        </article>`;
      }).join('')}
    </div>
  </section>`;

/* ------------------------------------------------------------------ */

export const resumeView = () => `
  <section class="k-hero" style="padding-bottom:20px">
    <div class="k-tagline">Résumé · ${esc(profile.resumeMeta.updated)}</div>
    <h1 style="font-size:clamp(46px,9vw,124px)">Seventeen years,<br>still in the <span class="k-fill">editor</span>.</h1>
    <div class="k-acts" style="margin-top:34px">
      <a class="k-mag solid" href="${profile.resume}" download>Download PDF ↓</a>
      <a class="k-mag" href="${profile.resume}" target="_blank" rel="noopener noreferrer">Open in browser</a>
    </div>
  </section>

  <section>
    ${head('Track<br>record', '17+ years<br>4 companies')}
    ${experience.map((e) => `
      <article class="k-line">
        <div class="k-yr">${esc(e.years)}<span>${esc(e.where)}</span></div>
        <div>
          <h4>${esc(e.title)}</h4>
          <div class="k-org">${esc(e.org)}</div>
          <ul class="k-list">${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </div>
      </article>`).join('')}
  </section>

  <section>
    ${head('Core<br>strengths')}
    ${Object.entries(strengths).map(([k, v]) => `
      <div class="k-org" style="margin-top:20px">${esc(k)}</div>
      <div class="k-chips">${v.map((s) => `<span>${esc(s)}</span>`).join('')}</div>`).join('')}
  </section>

  <section>
    ${head('Speaking &amp;<br>recognition')}
    <div class="k-rows">
      ${speaking.map((s) => `
        <div class="k-row"><span class="y">${esc(s.y)}</span><span class="t">${esc(s.t)}</span><span class="b">${esc(s.tag)}</span></div>`).join('')}
    </div>
  </section>

  <section>
    ${head('Writing', 'medium.com<br>/@nvkudva')}
    <div class="k-rows">
      ${writing.map((w) => `
        <a class="k-row" href="${w.u}" target="_blank" rel="noopener noreferrer"><span class="y">${esc(w.d.split(' ')[1])}</span><span class="t">${esc(w.t)}</span><span class="b">Read ↗</span></a>`).join('')}
    </div>
  </section>

  <section>
    ${head('Education')}
    <div class="k-rows">
      ${education.map((e) => `
        <div class="k-row"><span class="y">${esc(e.y.slice(0, 4))}</span><span class="t">${esc(e.d)} — ${esc(e.o)}</span><span class="b">${esc(e.y)}</span></div>`).join('')}
    </div>
  </section>`;

/* ------------------------------------------------------------------ */

export const contactView = () => `
  <section class="k-hero" style="padding-bottom:20px">
    <div class="k-tagline">Contact · replies within a day</div>
    <h1 style="font-size:clamp(52px,11vw,150px)">Say <span class="k-fill">hello</span>.</h1>
    <p class="k-blurb" style="margin-top:30px">
      I'm open to senior engineering leadership roles driving AI-forward platform and
      product engineering at scale. Fastest route is email.
    </p>
    <div class="k-acts">
      <a class="k-mag solid" href="mailto:${profile.email}">${esc(profile.email)}</a>
      ${profile.phones.map((p) => `<a class="k-mag" href="tel:${p.replace(/\s/g, '')}">${esc(p)}</a>`).join('')}
    </div>
  </section>

  <section>
    ${head('Everywhere<br>else')}
    <div class="k-socials">
      ${socials.map((s) => `
        <a class="k-soc" href="${s.u}"${ext(s.u)}>
          ${svg(s.i)}
          <span><b>${esc(s.n)}</b><small>${esc(s.h)}</small></span>
        </a>`).join('')}
    </div>
  </section>`;

export const notFound = () => `
  <section class="k-hero">
    <div class="k-tagline">404</div>
    <h1 style="font-size:clamp(52px,11vw,150px)">Nothing <span class="k-fill">here</span>.</h1>
    <div class="k-acts"><a class="k-mag solid" href="/" data-link>Back to overview</a></div>
  </section>`;

/* ------------------------------------------------------------------ */

/* One scrollable document. Each pane is a scroll target for the nav. */
export const page = () => `
  <div class="pane" id="overview">${home()}</div>
  <div class="pane" id="resume">${resumeView()}</div>
  <div class="pane" id="projects">${projectsView()}</div>
  <div class="pane" id="building">${buildingView()}</div>
  <div class="pane" id="contact">${contactView()}</div>`;
