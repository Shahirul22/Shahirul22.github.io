# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # static build to ./dist
npm run preview   # serve the built output
```

There is no test suite, no linter and no typecheck script in this project. `npm run build` is the only verification gate: Astro typechecks `.astro` frontmatter and fails the build on broken imports or bad props, so run it after any structural change.

## Architecture

Astro 5 static site (`output: static`, no SSR, no API routes) with React 19 islands. Tailwind v3 via `@astrojs/tailwind` with `applyBaseStyles: false`, so `src/styles/global.css` is the sole entry for base styles and is imported once by `src/layouts/Base.astro`.

### Content flows from two files, never from markup

`src/lib/data.ts` and `src/lib/site.ts` are the single source of truth. Every rendered section derives from them: `skills` drives both `SkillTiers.tsx` and `SkillBars.tsx`, `experiences` drives `Timeline.astro`, `projects` drives the home page grid, `/projects/` listing and each case-study page (which look themselves up by slug: `projects.find(x => x.slug === '...')!`). Edit the data, not the component, when changing content.

Skills use a **three-tier model** (`core` / `proficient` / `familiar`), not numeric proficiency. `tierConfig` holds the display label and blurb per tier; the visual weight of a tier (bar width, node radius, colour) is hardcoded per component in `BAR_WIDTHS` / `TIER_STYLE`. Adding a fourth tier means touching `SkillTier`, `tierConfig` and both of those maps.

### Adding a project

1. Append to `projects` in `src/lib/data.ts`.
2. Optionally add `src/pages/projects/<slug>.astro`, using `asset-compliance.astro` or `hr-management-suite.astro` as the template (both compose `Base` + `ProjectHeader` and hold their long-form case-study content inline as frontmatter arrays).
3. If step 2 was done, add the slug to the hardcoded `hasDetail` array in `src/components/ProjectCard.astro:5`. Without this the card silently links to `/projects/` instead of the case study.

### Islands and hydration

Only four components hydrate: `TypingHero` (`client:load`, above the fold), and `StatCounter`, `SkillTiers`, `SkillBars` (`client:visible`). Everything else is `.astro` and ships zero JS. Keep it that way: use `.astro` for static/layout, `.tsx` only when the thing genuinely needs client state.

### Two animation systems, deliberately separate

- Astro markup uses the `.reveal` class. `Base.astro` runs a single `is:inline` IntersectionObserver at load that adds `.in-view`. This runs once and does not see React output.
- React islands run their own IntersectionObserver internally (see `SkillTiers.tsx`) because they hydrate after that layout script has already swept the DOM. A `.reveal` inside a React component will never animate.

`prefers-reduced-motion` is neutralised globally at the bottom of `global.css`.

### Theme

Class-based dark mode (`darkMode: 'class'`) with a three-state preference (`system` / `light` / `dark`) in `localStorage` under key `theme`. The logic is duplicated in two places on purpose: an `is:inline` script in `Base.astro` head applies the class before paint to avoid FOUC, and `ThemeToggle.astro` owns the cycle button plus the `prefers-color-scheme` change listener. Changing the preference model means editing both.

### Styling conventions

Reusable classes live in `@layer components` in `global.css`: `.container-prose`, `.card`, `.btn-primary`, `.btn-ghost`, `.badge`, `.badge-accent`, `.terminal`, `.terminal-header`, `.section-title`, `.section-eyebrow`, `.grid-bg`, `.gradient-text`, `.reveal`. Prefer these over rebuilding utility strings. Colours come from the custom palette in `tailwind.config.mjs` (`ink-*` greys, `accent` cyan, `terminal.green/amber/red`); do not use raw Tailwind `slate-*` or `cyan-*`. Custom keyframes available: `blink`, `floaty`, `gridmove`, `shimmer`.

## Deploy

GitHub Pages via `.github/workflows/deploy.yml` on push to `main` (Node 20, `npm ci && npm run build`, upload `dist`). The repo is named `Shahirul22.github.io`, which is what makes it a user site served at the root of `https://shahirul22.github.io/`. **Do not rename the repo** and do not change `base` in `astro.config.mjs` away from `/`.

Internal links are written as root-absolute strings (`/projects/`, `/#skills`, `site.resume = '/Resume.pdf'`). These only resolve because `base` is `/`. If the site ever moves to a project page, every one of those needs `import.meta.env.BASE_URL` prefixing, the way `Base.astro:21` already does for the favicon.

Anything placed in `public/` is published to the live public site verbatim. Do not park drafts or working notes there.

## Known drift

`package.json` lists `framer-motion` but nothing imports it. `README.md` still describes a Recharts skills radar and a `SkillsRadar.tsx`; both are gone, replaced by `SkillTiers.tsx` (terminal-style process table) and `SkillBars.tsx` (SVG network topology). `tsconfig.json` defines an `@/*` path alias that no file uses; imports are all relative.

## Related

`F:\JOBHUNT\CLAUDE.md` (parent workspace) holds the job-hunt context, professional profile and writing style rules that apply to any prose written for this site. Its portfolio section is partially stale on the skills model and component list; this file supersedes it for code questions. `F:\JOBHUNT\context.md` is the authoritative source for bio copy, dates and project descriptions.
