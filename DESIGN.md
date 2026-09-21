# DESIGN.md

Visual system for shahirul22.github.io, established by the "Terminal Session as Narrative" redesign (2026-09-21). This file is the durable record; `F:\JOBHUNT\CLAUDE.md` and `portfolio/CLAUDE.md` govern content and code conventions.

## Direction

The site reads as one continuous terminal session, not a page decorated with terminal motifs. Every major section opens with a real `$ command` line on a persistent left-edge rail (`.session-rail` / `.prompt-line`), as if the visitor is scrolling through a scrollback buffer: `whoami`, `cat about.md`, `cat skills.json`, `git log --stat`, `ls -la ~/projects`, `mailto`. Case-study pages extend the same grammar with page-specific commands (`php artisan role:list`, `git log --oneline -- decisions/`, `docker compose ps`).

## Palette

Unchanged from the incumbent system — carried forward per brief:

- `ink-50…950` — neutral grey scale, light/dark via Tailwind `class` strategy.
- `accent` `#22d3ee` (cyan), `accent-soft` `#67e8f9`, `accent-deep` `#0891b2`.
- `terminal-green` `#4ade80`, `terminal-amber` `#fbbf24`, `terminal-red` `#f87171` — used for status/tier semantics (core/proficient/familiar; commit categories), and the literal three-dot terminal window chrome.

Removed: all gradient definitions, glow box-shadows, and the `grid-bg`/`gridmove`/`shimmer`/`floaty` decorative keyframes.

## Type

- `Inter` — body/UI text (`font-sans`).
- `JetBrains Mono` — all code, labels, metadata, nav, buttons, prompts, section eyebrows-that-are-real-commands (`font-mono`).

## Core components (`src/styles/global.css`)

- `.session-rail` — vertical rail (`border-l`) standing in for scroll history; wrap section intros in it.
- `.prompt-line` / `.prompt-sigil` — a `$ command` line; carries a dot marker on the rail via `.session-rail .prompt-line::before`. A bare `.prompt-line` outside a rail (e.g. centered section intros) renders with no dot — by design, not a bug.
- `.badge` / `.badge-accent` — flat bordered mono chips. No pill shape, no glass fill.
- `.card` — flat border, `border-color` shift only on hover (no lift, no shadow-glow). `break-words` by default — case-study copy contains code-like tokens (package paths, module trees) that must wrap rather than force layout width.
- `.btn` / `.btn-primary` / `.btn-ghost` — mono-set.
- `.terminal` / `.terminal-header` / `.terminal-dot` — literal terminal window chrome (three status dots + title), used for anything presented as command output (skill tables, the git-log skill graph, hero terminal, contact block).
- `.cursor::after` — blinking caret, used sparingly (one "awaiting input" beat per view, not decorative repetition).
- `.reveal` / `.in-view` — existing IntersectionObserver-driven scroll reveal, unchanged mechanism.

## Hard bans carried from the craft floor

No gradient text, no decorative kicker/eyebrow with no real information (every `.prompt-line` must carry an actual command/path), no numbered sections unless the sequence is meaningful, no glass/blur decoration, no glow shadows, no emoji standing in for icons, no sparklines/progress-rings standing in for real content.

## Chart components

- **`SkillBars.tsx`** (default export `SkillGraph`) — skills rendered as a `git log --graph --all` commit graph. Categories are branch lanes (fixed palette per category); individual skills are commits (nodes) on their lane; core-tier skills additionally merge into a left-hand "main" trunk via a bezier curve, reflecting "daily driver" status. Responsive via `ResizeObserver`; below ~360px content width the graph column scrolls horizontally inside its own `overflow-x-auto` container (an intentional exception to the no-horizontal-scroll rule, scoped to this one diagram per the responsive-design allowance for tables/diagrams).
- **`SkillManifest.tsx`** — replaced `SkillTiers.tsx` (2026-09-21): the original process-table restyle duplicated the git-log graph's information (same skill list, same tier-as-color coding, same terminal chrome, side by side) without adding a distinct read. Skills now render as a `composer.json`-style manifest, grouped into sections by category. Tier was briefly encoded as a fabricated semver pin (`^2.1`, `~1.4`) but that implied a precision that doesn't exist — there's no honest number behind "how well do I know PHP." Reverted to a real install-status word instead: `stable` (core), `installed` (proficient), `dev-tag` (familiar) — same coarse 3-state signal the old progress bar gave, expressed as manifest vocabulary instead of a percentage. Same underlying `skills[]` data and tier semantics throughout; the manifest earns its place next to the graph through a different information shape (flat scannable list vs. branch/commit structure), not through invented precision.
- **`Timeline.astro`** — restyled as `git log --stat`-style commit entries: one synthetic short-hash per role, diff-style `+` bullet prefixes, existing `.badge` tag row.

## Known layout trap (fixed, worth remembering)

CSS Grid items default to `min-width: auto`, which lets unbroken content (a long word, a fixed-width child like the skill graph's `overflow-x-auto` box) force the grid item — and its ancestors — wider than the viewport, even when the grid track itself is correctly sized. Any new grid cell that can contain unpredictable-width content (case-study body copy, embedded diagrams) needs `min-w-0` on the grid item and `break-words` on text content. `.card` and `.container-prose` carry `break-words` globally for this reason.

## Provenance

No image generation was available in this environment (confirmed via `impeccable context`); every asset on the site is code-drawn (SVG graphs/icons) or pre-existing (`Resume.pdf`). No comp round was run — this was a code-led build per contract, verified instead by build + mechanical detector + cross-viewport overflow sweep + visual screenshot review (light/dark × desktop/mobile, home + one case-study page in depth, all 8 case studies swept programmatically for layout regressions).
