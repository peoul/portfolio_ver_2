# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server with HMR (react-router dev)
npm run build      # Static build → prerenders routes into build/client/
npm run preview    # Locally preview the built static site (vite preview)
npm run typecheck  # react-router typegen && tsc -b  (run after changing routes)
npm run lint       # eslint
```

There is no test suite. After editing or adding routes, run `npm run typecheck` (or `npx react-router typegen`) to regenerate the route types under `.react-router/types/` — `Route.*` type imports will not resolve until this runs.

## Architecture

This is a **React Router v7 framework-mode** app (the successor to Remix), built as a **fully static / prerendered (SSG) site** — not a plain Vite SPA and not a live SSR server. It renders a single-page developer portfolio.

- **Static prerender** (`react-router.config.ts`, `ssr: false` + `prerender: ["/"]`). At build time each listed route is rendered to HTML in `build/client/`; there is **no runtime server** (deployed as static files to Cloudflare Pages). The route still hydrates on the client. Code in render bodies runs at build (prerender) and on the client; browser-only APIs (`document`, `window`) must stay inside `useEffect`/event handlers (see the theme toggle and the modal's Escape handler). If you add a route, add its path to `prerender` (or it'll only exist client-side via the SPA fallback).
- **`appDirectory` is `src`** (not the default `app`), so framework convention files live in `src/`:
  - `src/root.tsx` — the document shell (`<html>`/`<head>`/`<body>` with `<Meta>`/`<Links>`/`<Scripts>`). Page `<title>`, favicon, and the global `index.css` import live here, **not** in an `index.html` (framework mode has none).
  - `src/routes.ts` — route config. Currently one `index("routes/home.tsx")`.
  - `src/routes/home.tsx` — the only page; owns the dark/light theme state and assembles the section components.
- **Components** (`src/component/`): `Hero`, `Terminal` (the "about" section), `Experience` (work history), `Recent` (project list + detail modal), `Contact`. Each imports its own co-located `*.css`.
- **Content is data-driven**: `src/assets/data/portfolio.json` holds hero text, experience, work, and contact links. Edit JSON to change content; Hero/Experience/Recent/Contact read from it. (The "about" facts — education, skills, hobbies — are still hardcoded in `Terminal.tsx`, not in the JSON.)
  - `experience[]` entries are roles (company/role/period) with an optional `blurb` or `highlights[]`, rendered as a collapsible accordion in `Experience.tsx`.
  - `work` is split into `work.studio[]` (AJILE products — carry `status`/`meta`/`link`) and `work.personal[]` (carry `github`). `Recent.tsx` renders both groups as one list; rows open a detail modal. Status badges (`.status-*`) live in `recent.css`.
- **Resume**: the `resume` link in `Terminal.tsx` points to `/Resume_LyhongPeou.pdf`, served statically from `public/` — keep that PDF in `public/` up to date.

### Theming

CSS custom properties define the palette in `src/index.css` (oklch, with hsl fallbacks). Dark is the `:root` default; `[data-theme="light"]` overrides. The toggle in `src/routes/home.tsx` sets `data-theme` on `document.documentElement` via `useEffect`. Because that runs only after hydration, the server renders without `data-theme` — acceptable, but expect a brief theme flash on first paint unless reworked (e.g. a cookie read in a loader).

Fonts: Inter (sans, body) and JetBrains Mono (the `~`-prefixed section prompts, labels, tags), imported via `@import` in `index.css`.

### SEO

Because routes are prerendered to static HTML at build, crawlers get fully-rendered markup. Page metadata lives in `meta` exports: `src/root.tsx` holds fallback title/description + favicon/preconnect `links`; `src/routes/home.tsx` exports the full set (title, description, Open Graph, Twitter card, canonical, and a JSON-LD `Person` schema) built from `portfolio.json`. Note React Router's rule: the deepest route's `meta` **replaces** parent meta (so home's is authoritative), while `links` **aggregate**. Static SEO assets in `public/`: `robots.txt`, `sitemap.xml`, `favicon.svg`, and `og-image.png` (regenerate the OG image from an SVG via `rsvg-convert -w 1200 -h 630`). The canonical/site URL `https://lyhong.dev` is hard-coded as `SITE_URL` in `home.tsx` (and mirrored in `public/sitemap.xml` + `public/robots.txt`) — update all three if the domain changes.

### Build output & deploy

`npm run build` emits **static files only** into `build/client/` (prerendered `index.html`, hashed JS/CSS assets, and everything from `public/`); the server build is discarded because `ssr: false`. `build/` and `.react-router/` are gitignored.

Hosting is **Cloudflare Pages** (static). Build command `npm run build`, output directory `build/client`. There is no server/Worker to deploy — if a future feature needs server-side logic, switch to SSR on Cloudflare Workers (`@cloudflare/vite-plugin` + `wrangler` + a `workers/app.ts` fetch handler) and set `ssr: true`.

## Conventions

- Local SVGs are imported as React components via `vite-plugin-svgr`: `import Icon from "./x.svg?react"`. Color them with `fill: currentColor` / `stroke: currentColor` in CSS — the source SVGs have no hardcoded fills.
- Brand/tech icons (the skill chips in `Terminal.tsx`) come from `react-icons` (tree-shaken; inherit `currentColor`). Note Convex has no brand glyph there, so it reuses a generic database icon, and Azure uses `VscAzure`.
- The visual language is "refined terminal": monospace `~ command` prompts mark each section, but with no window chrome/boxes. Keep new sections consistent (`.prompt` class + a mono heading).

> Note: `README.md` predates the React Router/SSR migration (it still references React 18, `main.tsx`, and a `dist/` output) — trust this file and the code over the README for build/run details.
