# Shahirul Amin — Portfolio

Tech-themed personal site built with **Astro + React + Tailwind**. Multi-page, light/dark/system theme, animated charts, smooth scroll, reveal-on-scroll, typing hero.

## Stack
- [Astro 5](https://astro.build) — static site generator (zero-JS by default, React islands for interactivity)
- React 19 (interactive components only: typing hero, skills radar, skill bars, stat counters)
- Tailwind CSS 3 (with `@tailwindcss/typography`)
- [Recharts](https://recharts.org) — skills radar chart
- Custom IntersectionObserver-driven reveal-on-scroll
- JetBrains Mono + Inter from Google Fonts

## Local dev

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output → ./dist
npm run preview  # serve the production build locally
```

## Editing content

All textual content lives in two files:

- [`src/lib/site.ts`](src/lib/site.ts) — name, contact, social, nav
- [`src/lib/data.ts`](src/lib/data.ts) — skills, radar buckets, experiences, projects

Adding a new project:
1. Append an entry to the `projects` array in `src/lib/data.ts`.
2. (Optional) Create a case-study page at `src/pages/projects/<slug>.astro` — use `asset-compliance.astro` or `hr-management-suite.astro` as a template.
3. Add the slug to the `hasDetail` array in `src/components/ProjectCard.astro` so the card links to it.

## Theme

- Light / Dark / System — cycle with the toggle in the navbar.
- Preference persisted to `localStorage` under the key `theme`.
- System mode follows the OS via `prefers-color-scheme`.

## Notes

- The `Resume.pdf` link in the hero expects a file at `public/Resume.pdf`. Copy your resume in:
  ```
  cp ../Resume.pdf public/Resume.pdf
  ```
- Favicon at `public/favicon.svg` — replace if you have a personal mark.
