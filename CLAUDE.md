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
- **Components** (`src/component/`): the page is a story told as a tuk-tuk ride through Phnom Penh. `Hero` (hanging shop sign + `Skyline` SVG), then six chapters in order — `Story` renders stops 1–3 (home / abroad / new road) from JSON, `Market` (stop 4, projects as night-market stalls + a "flyer" detail modal), `Toolbox` (stop 5, skills + off-hours + résumé), `Contact` (stop 6 "forward" + footer). `Chapter` is the shared section frame (Khmer-numeral stop sign, Khmer heading, English title). `RideBar` is the fixed bottom road where the tuk-tuk tracks scroll progress and each stop scrolls to its chapter. `Tuktuk` is the reusable SVG. Each imports its own co-located `*.css`.
- **Stops** (`src/component/stops.ts`) is the single source for chapter ids, Khmer headings, and ride-bar labels, in page order. Adding/reordering a chapter means editing `STOPS` and rendering a `<Chapter id=…>` in that order — `RideBar` measures section positions by these ids.
- **Content is data-driven**: `src/assets/data/portfolio.json` holds `hero` (incl. Khmer name `kh`, `origin`/`now`), `story[]` (narrative chapters keyed by stop id; `roles` reference `experience[].company`, `education`, and `expected` drives the fork sign), `experience[]`, `work`, and `contact`. Skills and off-hours are hardcoded in `Toolbox.tsx`.
  - `work` is split into `work.studio[]` (AJILE products — carry `status`/`meta`/`link`/`logo`) and `work.personal[]` (carry `github`). `Market.tsx` renders them as two stall rows.
- **Résumé**: the link in `Toolbox.tsx` points to `/Resume_LyhongPeou.pdf`, served statically from `public/` — keep that PDF in `public/` up to date.

### Theming

Visual direction is **Phnom Penh streets**: riso-print poster inks on newsprint (day) and a lit-up night market (night). Fixed riso inks (`--red`, `--blue`, `--yellow`, `--pink`, `--teal`) plus theme tokens (`--paper`, `--ink`, …) live in `src/index.css`. Day is the bare `:root`; `[data-theme="dark"]` is night, with a `prefers-color-scheme` fallback for no-JS. An inline script in `src/root.tsx` stamps `data-theme` on `<html>` **before first paint** (saved `localStorage.theme`, else OS preference), so there is no theme flash; `<html>` has `suppressHydrationWarning` for that reason. The day/night switch in `home.tsx` just flips the attribute and saves it — its visual state is pure CSS. The `Market` chapter is always night regardless of theme (it overrides the tokens locally).

Fonts (Google Fonts `@import` in `index.css`): **Moul** (`.kh-sign`, traditional Khmer shop-sign letter — names and Khmer headings), **Koulen** (`.kh-poster`, modern Khmer poster letter — Khmer numerals), **Bricolage Grotesque** (`--font-display`, Latin headings), **Kantumruy Pro** (`--font-body`). Give Khmer runs `lang="km"` (CSS adds line-height for stacked glyphs). Khmer numerals come from `khNum()` in `stops.ts`.

### SEO

Because routes are prerendered to static HTML at build, crawlers get fully-rendered markup. Page metadata lives in `meta` exports: `src/root.tsx` holds fallback title/description + favicon/preconnect `links`; `src/routes/home.tsx` exports the full set (title, description, Open Graph, Twitter card, canonical, and a JSON-LD `Person` schema) built from `portfolio.json`. Note React Router's rule: the deepest route's `meta` **replaces** parent meta (so home's is authoritative), while `links` **aggregate**. Static SEO assets in `public/`: `robots.txt`, `sitemap.xml`, `favicon.svg`, and `og-image.png` (a 1200×630 screenshot of the hero with the topbar, ride bar, greeting and tagline hidden — regenerate it with a headless browser after changing the hero, since it needs the Khmer web fonts). The canonical/site URL `https://lyhong.dev` is hard-coded as `SITE_URL` in `home.tsx` (and mirrored in `public/sitemap.xml` + `public/robots.txt`) — update all three if the domain changes.

### Build output & deploy

`npm run build` emits **static files only** into `build/client/` (prerendered `index.html`, hashed JS/CSS assets, and everything from `public/`); the server build is discarded because `ssr: false`. `build/` and `.react-router/` are gitignored.

Hosting is **Cloudflare Pages** (static). Build command `npm run build`, output directory `build/client`. There is no server/Worker to deploy — if a future feature needs server-side logic, switch to SSR on Cloudflare Workers (`@cloudflare/vite-plugin` + `wrangler` + a `workers/app.ts` fetch handler) and set `ssr: true`.

## Conventions

- Local SVGs are imported as React components via `vite-plugin-svgr`: `import Icon from "./x.svg?react"`. Color them with `fill: currentColor` / `stroke: currentColor` in CSS — the source SVGs have no hardcoded fills.
- Brand/tech icons (the skill stickers in `Toolbox.tsx`) and UI glyphs (`react-icons/pi`) come from `react-icons` (tree-shaken; inherit `currentColor`). Note Convex has no brand glyph there, so it reuses a generic database icon, and Azure uses `VscAzure`.
- Keep new sections in the street language: wrap them in `<Chapter>` (bilingual heading), use flat riso inks with hard offset shadows (`box-shadow: Npx Npx 0 <ink>`) rather than blurs in day mode, glows only at night, and `.riso` for the misregistered pink overprint on big display text. Anything that animates must respect `prefers-reduced-motion` (handled globally in `index.css`). Render-time randomness must be deterministic (index-based) so prerendered and hydrated markup match.

> Note: `README.md` predates the React Router/SSR migration (it still references React 18, `main.tsx`, and a `dist/` output) — trust this file and the code over the README for build/run details.
