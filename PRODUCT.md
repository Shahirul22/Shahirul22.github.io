# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences with equal priority, no primary/secondary split:

- **Recruiters/HR screeners** doing a fast pass — need skimmable proof (titles, stack tags, metrics) at a glance.
- **Hiring managers/tech leads** doing a deeper read — will judge architecture decisions and want real case-study depth on click-through.

The site must work as both a 30-second skim and a deeper technical read, without picking one over the other.

## Product Purpose

Shahirul Amin's personal portfolio site — a supporting asset for active job hunting (Senior Backend / Laravel Developer roles, Penang or remote). It is a live showcase of his projects and skills that job applications point to. Success means a visitor (recruiter or technical evaluator) comes away with an accurate, credible, quickly-graspable picture of his backend/Laravel expertise and can act on it (shortlist, interview, contact).

## Positioning

No single forced angle — project breadth itself is the pitch: backend/Laravel systems work (RBAC, multi-stage approval workflows, government/compliance systems), a live production migration (Eventilla), internal tooling, and current AI-assisted operations platform work (Solenovo). The site should let this range read clearly rather than compressing it into one tagline.

## Operating Context

- Personal site, single owner-operator (Shahirul), no CMS or backend — content changes happen by editing `src/lib/data.ts` and `src/lib/site.ts` directly and redeploying.
- Deployed as a static site to GitHub Pages, linked from resume, cover letters, and job applications.
- Visited cold, usually from a resume/application link, not from search or social — no SEO/growth strategy needed beyond basic correctness.
- Several of the showcased projects are private/proprietary (government and employer work) — the site describes them (architecture, scale, outcomes) without exposing source code, screenshots, or client-confidential detail.

## Capabilities and Constraints

- Static build only (Astro `output: static`) — no server-side rendering, no API routes, no backend for this site itself.
- Deployed at the root of a GitHub Pages user site (`shahirul22.github.io`); base path must stay `/`.
- Currently employed at Nindatech — site and any materials should read as an active but discreet job search, not as already having left.
- Resume (`Resume.pdf`) and `context.md` are the factual source of truth for dates, titles, and project details; the site must not invent claims beyond them.

## Brand Commitments

- Name: Shahirul Amin. Title: Senior Software Developer, backend/Laravel specialist.
- Contact: shahirul.a786@gmail.com (personal, used on the public site) / shahirul@nindatech.com (work, not for public-facing material).
- Location: Bayan Baru, Penang, Malaysia.
- Writing style rules apply to all prose on the site: no Oxford commas, no em dashes, no AI-sounding vocabulary ("delve", "testament", "vibrant", "pivotal", etc.).

## Evidence on Hand

- `context.md` (workspace root) — full narrative resume: work history, education, skills, and per-project detail. Authoritative source for bio copy and dates.
- `Resume.pdf` — live resume, present in both `/public/` and the workspace root.
- Real project data already structured in `src/lib/data.ts`: 8 projects across government compliance/workflow systems, an HR suite, a live SaaS migration (Eventilla), internal dev tooling, and an in-progress AI ops platform (Solenovo) — each with stack, status, and real metrics (e.g. Eventilla's 20s → 3s load time reduction).
- One reference on file: Jani Utriainen (Director/CTO, Nindatech) — contact details available on request, not published outright.
- No testimonials, press, or case-study screenshots beyond what `data.ts` and the two existing project detail pages (`asset-compliance`, `hr-management-suite`) contain. Do not fabricate additional proof.

## Product Principles

1. Equal weight to skim and depth — a recruiter's 30-second pass and a tech lead's full read must both be satisfied by the same pages, not by separate tracks.
2. Truth over polish — every claim traces to `context.md`/resume; private/proprietary projects are described by outcome and architecture, never by exposing confidential detail.
3. Breadth is the argument — don't compress a genuinely varied project set (compliance workflows, live SaaS migration, AI ops tooling) into one narrow tagline.
4. Low-maintenance by design — content lives in two data files a non-designer can edit; the site should stay easy for Shahirul to keep current without re-engaging Claude for every resume update.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond general good practice.
