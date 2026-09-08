# Deployment gaps

Audit of the nine featured projects against what is actually running on
Cloudflare (account `nvkudva@gmail.com`), taken 2026-09-08.

**4 of 9 are live and scannable.** The rest render a placeholder tile and
carry no QR code, because a QR pointing at nothing is worse than no QR.

## Live — screenshot + QR on the site

| Project | URL | Host |
|---|---|---|
| SmartFin | smartfin.nvkudva.workers.dev | Workers |
| SmartNews | smartnews.nvkudva.workers.dev | Workers |
| Bhagavad Geeta | bhagavad-geeta.nvkudva.workers.dev | Workers |
| CityCare — AI Doctor | ai-doctor-8ai.pages.dev | Pages |

## Broken — needs a redeploy

**AgentOS** — `agentos-cx9.pages.dev` returns **404 at root**. The Pages
project exists and was modified an hour before the audit, but serves nothing.
Most likely the build output directory is wrong, or the deployment holds no
`index.html`. Until it is fixed the card shows "Deploy broken" and links the
URL as plain text rather than a QR.

## Not deployed — nothing to point a QR at

| Project | Note |
|---|---|
| Gym Buddy (`gym-budy-claude`) | Web app, deployable today |
| Sahay | Web app, deployable today |
| Ask My Brain | Web app, deployable today |
| SuperVoiceBoard | Android keyboard — not a web target. Best link is a GitHub release APK, not a URL. |

So three web apps are one `wrangler deploy` away from completing the grid,
and one project will never have a deploy URL by nature.

## Deployed but not featured

- `ai-news-app.nvkudva.workers.dev` — live, but superseded by SmartNews.
- `modelcost.pages.dev` — live, private repo, not in the featured nine.

## Refreshing this

```bash
node scripts/shoot.mjs      # re-capture screenshots of every live deployUrl
node scripts/make-qr.mjs    # regenerate QR codes from data.js
node scripts/release.mjs    # bump the service-worker version before deploying
```

Screenshots come from the Cloudflare Browser Rendering API, so no local
browser or Playwright install is needed. The API rate-limits concurrent
sessions — the script spaces requests and retries on 429.
