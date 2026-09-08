# V2 Features — Project Showcase

Deferred until V1 (chosen design, PWA shell, résumé, socials) is shipped.

## Goal

A dedicated **Projects** section listing the top 10 GitHub projects, each rendered as a
card carrying a scannable link to its live Cloudflare deployment.

## Card anatomy

Every project item has exactly these four parts:

| Part | Source | Notes |
|---|---|---|
| Title | repo name / display name | Display name overrides repo slug where they differ |
| Description | 1–2 sentences, hand-written | Not the raw GitHub `description` field — rewritten for a hiring audience |
| Image | screenshot of the deployed app | 16:10, WebP, captured at 1440×900, lazy-loaded, LQIP blur-up placeholder |
| QR code | encodes the Cloudflare production URL | SVG, generated at build time, theme-aware (inherits ink/accent tokens) |

## Data model

`src/data/projects.json` — one entry per project:

```json
{
  "id": "atlas-serve",
  "title": "Atlas Serve",
  "description": "",
  "repo": "https://github.com/<user>/atlas-serve",
  "deployUrl": "https://atlas-serve.<subdomain>.workers.dev",
  "screenshot": "/assets/projects/atlas-serve.webp",
  "stack": ["Rust", "vLLM"],
  "rank": 1,
  "status": "live" 
}
```

`status` is one of `live` | `no-deployment` | `private`.

## QR codes

- Generated at **build time**, not runtime — no client-side QR library, no CDN dependency.
- Node build step reads `projects.json`, emits an inline SVG per project into the card markup.
- Uses `currentColor` for modules so the code re-tints with the Professional / Cyber skin
  instead of shipping two raster images.
- Error correction level **M**, quiet zone 2 modules, minimum rendered size 96px so a phone
  camera locks on from ~20cm.
- Cards with `status: "no-deployment"` render a disabled slot in the QR position with a
  "not deployed" chip — never a QR pointing at a dead URL.

## Screenshots

- Captured with a Playwright script (`scripts/shoot.mjs`) that walks `deployUrl` for every
  `status: "live"` project, at desktop viewport, and writes WebP into `public/assets/projects/`.
- Re-runnable — screenshots go stale, this is the refresh command.
- Projects without a deployment get a generated fallback tile (repo name set in the site's
  display face over the theme's surface color), not a broken image.

## Deployment audit

Part of this work is producing the list of projects that **have no production deployment**.
Output goes in `DEPLOYMENT_GAPS.md`: repo, why it isn't deployed (private / library / CLI /
never shipped), and whether it's worth deploying to Cloudflare Pages or Workers to complete
the grid.

## Open inputs needed before starting

1. **GitHub handle** — to enumerate repos and pick the top 10.
2. **"The report"** — you mentioned extracting details from a report; I don't have it yet.
   Point me at the file or paste it, otherwise I'll rank by stars + recency and you edit.
3. **Cloudflare account / project list** — to match repos to their live URLs. A
   `wrangler deployments list` dump or the Pages dashboard project names is enough.
