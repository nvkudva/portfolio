# Vijay Krishna Kudva — Portfolio

Zero-dependency PWA. No build step, no framework, no `node_modules`.
Four routes rendered client-side, animated with the View Transitions API,
cached by a service worker so repeat visits are instant and it works offline.

## Personas

Two axes, four palettes:

| | Light | Dark |
|---|---|---|
| **Executive** | slate + ultramarine (default) | midnight + periwinkle |
| **Overdrive** | violet-white + magenta | black + acid mint, grid overlay |

Picking a persona sets its default mode; the Light/Dark control still overrides.
The choice persists in `localStorage`.

## Editing content

Everything the site says lives in [`assets/js/data.js`](assets/js/data.js) — nowhere else.
Projects tagged `draft: true` render a "description draft" chip; rewrite those
descriptions and remove the flag.

## Portrait

Drop a 4:5 image at `assets/img/portrait.jpg`, then in `assets/js/views.js`
replace the `.ph` placeholder div with:

```html
<img src="/assets/img/portrait.jpg" alt="Vijay Krishna Kudva">
```

## Icons

`node scripts/make-icons.mjs` regenerates the PNG app icons from the VK mark.
No dependencies — it rasterises and encodes PNG with Node's built-in zlib.
Edit the polygon coordinates in that script to change the mark.

## Run locally

```bash
npx -y serve -l 4321 -s .
```

`-s` matters: it rewrites unknown paths to `index.html` so `/projects` works on refresh.

## Deploy to Cloudflare Pages

Build command: *(none)* · Output directory: `/`

`_redirects` handles the SPA fallback and `_headers` sets immutable caching on
`/assets/*` while keeping `sw.js` uncached — without that, browsers pin a stale
service worker.
