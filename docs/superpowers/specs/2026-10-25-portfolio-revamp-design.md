# Portfolio Revamp — Design

**Date:** 2026-10-25
**Owner:** Emma Long
**Status:** Draft, ready for Emma's approval

## Intent

Emma's current portfolio reads as janky: the boxed "EL" logo looks odd, the Three.js particle hero is "coolish but strange", and the violet/fuchsia palette is wrong. She wants to start over from the ground up and adopt the visual design of a prototype she has (a v0-generated Next.js site), while keeping her real content and the features of the current site that still earn their place.

The site exists to get the right people — recruiters, hiring managers, potential clients — to **get in touch**. Everything else (projects, experience, résumé) supports that.

## Goals

- A ground-up rebuild in SvelteKit whose look and feel matches the prototype: layout, colour, type, motion, and component styling.
- Emma's real, current content in every section. No placeholder copy or invented numbers ship.
- "Get in touch" is the main conversion. It's carried by the always-visible coral Contact pill in the header, the hero's "Get in touch" button, and the contact section. In the hero, "View selected work" keeps the filled style and "Get in touch" is outlined, as in the prototype (Emma's decision).
- Keep the working contact form (reCAPTCHA v3 → MailerSend) and restyle it in the prototype's language.
- Preserve the candid per-job FAQ answers from the current site, tucked behind a toggle.
- Proper SEO metadata in place of the hidden keyword block.

## Non-goals

- Dark mode. The prototype is light-only (`color-scheme: light`); ship light only.
- A blog or any pages beyond the home page and the four featured-project case studies.
- Changing hosting (Vercel) or the email provider (MailerSend).
- Analytics. Not in the current site; not part of this work.

## Anti-goals (would make this a failure even if it works)

- Any trace of the old visual identity: the "EL" box logo, violet/fuchsia gradients, the particle scene, Pixelify/Inter fonts.
- Placeholder or fabricated content (the prototype's "Alex Rivera", "40M requests", "Lisbon", fake companies) making it to production.
- The résumé download competing visually with "Get in touch".
- Hidden or invisible text aimed at search engines.

## Constraints

- **Stack (Emma's decision):** SvelteKit, TypeScript, Tailwind CSS. Svelte 5 runes throughout (the current code is mostly runes, with some leftover `$:` syntax that goes away in the rewrite).
- **Tailwind v4 (my call):** upgrade from v3 so the prototype's `@theme` tokens, `@custom-variant`, and `bg-linear-to-b` etc. port directly. Replace `tailwind.config.ts`/PostCSS setup with the v4 Vite plugin.
- Package manager: pnpm. Adapter: `@sveltejs/adapter-vercel` (unchanged).
- **Build in this repo** (`personal-website`) on the `revamp` branch, replacing the current UI. It's a rewrite of the presentation layer; the contact API is kept.
- **Design reference:** the prototype source at `/Users/emmalong/Downloads/full-stack-developer-portfolio` (Next.js 16 / React 19 / Tailwind v4). It is outside this repo. Port its markup, classes, CSS (`app/globals.css`), and behaviours to Svelte components; don't copy React code or add React dependencies.
- Respect `prefers-reduced-motion` everywhere the prototype does (dot field, scramble text, beams, ping, conic border, smooth scroll).

## Design system (from the prototype, ported as-is)

- **Colour tokens:** copy the `:root` tokens from the prototype's `globals.css` — warm off-white background `oklch(0.985 0.002 90)`, near-black foreground, `--primary: #d63a4f`, `--brand`/`--accent: #f9586c`, translucent borders, `--radius: 0.625rem`, and the `@theme inline` mapping.
- **Type:** Geist Sans and Geist Mono. My call: self-host via `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` (no Google Fonts request). Remove the Inter/Pixelify `<link>`s from `app.html`.
- **Icons:** `@lucide/svelte` (already a dependency) replaces Font Awesome and `svelte-fa`.
- **Custom CSS:** port `.beam`, `.spin`, `.ping`, `.conic-border`, `.spotlight*`, the `@property --angle` and keyframes, the `::selection` colour, `scroll-padding-top: 5rem`, and the reduced-motion block.
- **Interactive pieces to port as Svelte components:** `DotField` (canvas, pointer + ripple), `ScrambleText`, `CodeCard`, `SpotlightCard`, `PlusCorners`, `SectionHeading`, `ShipPipeline` (SVG), `CopyEmailButton`, `SiteHeader`, `SiteFooter`.

## Page structure

Routes: `/` (the home page below) and `/work/{slug}` case-study pages for the four featured projects (see Selected work). Home-page sections run top to bottom as listed. Section numbers fix a prototype bug where Experience and Contact both said `04`.

| #   | Section            | Anchor        | Prototype source                            |
| --- | ------------------ | ------------- | ------------------------------------------- |
| —   | Header             | —             | `site-header.tsx`                           |
| —   | Hero               | `#top`        | `hero.tsx`                                  |
| 01  | Selected work      | `#work`       | `projects.tsx` + new "More projects" list   |
| 02  | How I ship         | `#process`    | `process.tsx`                               |
| 03  | Tools of the trade | `#stack`      | `stack.tsx`                                 |
| 04  | Experience         | `#experience` | `experience.tsx` + FAQ toggle + résumé link |
| 05  | Contact            | `#contact`    | `contact.tsx` + contact form                |
| —   | Footer             | —             | `site-footer.tsx`                           |

Content lives in a typed module (`src/lib/data/portfolio.ts` or similar — builder's choice of shape), replacing the current JSON files.

### Header

- Wordmark: coral dot + `emma.long` in mono.
- Nav: Work, Process, Stack, Experience, and the coral **Contact** pill (always visible, including mobile).

### Hero

- **Availability badge:** pulsing coral dot + text. _Text is an open item (see below); if Emma doesn't want one, omit the badge._
- **Name:** Emma Long.
- **Scrambling role line** (draft): "Full-Stack Engineer", "Systems Architect", "DevOps Tinkerer", "Interface Builder". Screen-reader text: "Full-Stack Engineer".
- **Intro (draft):** "I build reliable web products end to end — from CI/CD pipelines and edge APIs to interfaces people enjoy using. Right now I'm the sole engineer modernizing a decade-old platform at Haven Ministries."
- **Location line:** "Los Angeles Metropolitan Area". Emma OK'd this or "Rancho Cucamonga, CA"; I picked the metro area because recruiters recognize it more readily.
- **Buttons:** primary "View selected work ↓" (`#work`), secondary "Get in touch" (`#contact`, not `mailto:`, so it lands on the form). **No résumé button in the hero** (Emma's decision).
- **Code card** (`about.ts`, draft):
  ```ts
  export const engineer = {
  	focus: 'full-stack',
  	frontend: ['SvelteKit', 'TypeScript'],
  	backend: ['Node', 'Go'],
  	data: 'PostgreSQL',
  	values: ['pipelines before features', 'modernize in phases', 'sustainable pace, quality code']
  };
  ```
- **Stats row** (real numbers from Emma's own FAQ answers):
  - `2016` — First production work; full-time engineer since 2023 (draft). **Don't claim "10 years of development experience":** per Emma, dev work from 2016 to 2023 grew alongside an IT/analytics role and only became her full-time job in November 2023.
  - `40s → 90s` — Page-speed scores after modernizing Haven's platform
  - `10+ → ~0` — Monthly downtime incidents after the migration

### 01 — Selected work

Section description (draft): "Products I've designed, built, and shipped, from schema to deploy."

Approach (from the hiring research Emma accepted, `reports/Hiring views on AI built portfolios.md`, kept out of git): screeners now read the _explanation_ of a project more than its code, and they look for judgment: constraints, trade-offs, rejected alternatives, verification. So each featured project carries its evidence in prose, and private work is described rather than shown.

**Four featured cards**, prototype card design (spotlight hover, `NN / YEAR`, title, summary, Role, Impact, tags, link row). **No cover images.** Years come from git history.

| Project           | Year | What it is (draft)                                                                                                                                                                                                                                | Role   | Impact | Tags (draft)                                     | Link row                                                                     |
| ----------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| Harbor            | 2026 | Multi-tenant case-management SaaS for California human-services providers, starting with day and employment programs for adults with intellectual and developmental disabilities. Built to be HIPAA-compliant. In active development (Release 1). | _open_ | _open_ | SvelteKit, TypeScript, PostgreSQL, Docker        | `harborcm.io` (if it's public-facing) · Private repo, walkthrough on request |
| Emmabyte platform | 2025 | emmabyte.io: the company's marketing site plus a full CRM, client portal and admin.                                                                                                                                                               | _open_ | _open_ | SvelteKit, TypeScript, Tailwind CSS, PlanetScale | `emmabyte.io` · Private repo, walkthrough on request                         |
| Tarot Tutor       | 2026 | Subscription learning app with guided lesson tracks, a free in-browser first lesson, and Stripe-backed Pro plans.                                                                                                                                 | _open_ | _open_ | SvelteKit, Supabase, Stripe, PostHog             | `tarot-tutor.vercel.app` · Private repo, walkthrough on request              |
| Pulse             | 2026 | Open-source observability platform that pulls logs, events and metrics from MailerSend, Vercel, PlanetScale and app code into one dashboard with search and alerting. It also has a hosted version, Pulse Cloud.                                  | _open_ | _open_ | SvelteKit, Prisma, PostgreSQL, Docker            | Source code: `github.com/emmabyte-engineering/pulse`                         |

Rules for the cards:

- **No invented metrics.** Impact lines come from Emma (users, customers, uptime, release milestones, or relative terms like "cut X by ~half"). If she has nothing she's comfortable stating for a project, the Impact field shows the project's status instead (e.g. "In production since September 2026").
- **Private repos:** the "Source code" link becomes "Private repo · walkthrough on request", linking to `#contact`.
- **Harbor:** no source, no code excerpts, no screenshots unless they use synthetic data, and a note saying so wherever an image appears. Describe it at the product and architecture level. Say "HIPAA-compliant architecture", never "HIPAA certified".
- **No AI badges on cards** (see How I ship).

**Case studies:** each featured project gets one, covering the problem and constraints, Emma's role, a redrawn architecture diagram (no internal hostnames or client data), two or three key decisions with the alternatives she rejected, testing and verification, outcome, and for Harbor the compliance controls. Content is drafted from each repo's own docs (Harbor has `docs/technical/`, Tarot Tutor has `docs/superpowers/specs/`) and reviewed by Emma. **Format (Emma's decision): a dedicated page per featured project** at `/work/{slug}` (`harbor`, `emmabyte`, `tarot-tutor`, `pulse`). The featured card's main link goes to its case study. The live site and source links stay in the card's link row and are repeated on the page.

Case-study page layout, in the prototype's vocabulary:

- Same header and footer as the home page. Header nav anchors point back to `/#work` etc.
- A "← All work" link back to `/#work`.
- A heading block: mono `NN / YEAR` line, title, one-line summary, and a meta row (Role, Stack tags, Status, Links).
- Body sections with `SectionHeading`-style mono labels: Problem & constraints · My role · Architecture (inline SVG diagram in the `ShipPipeline` visual style: grid, borders, coral accents) · Key decisions (each one: decision, alternatives rejected, why) · Testing & verification · Outcome · Compliance (Harbor only).
- A closing call to action reusing the contact card's left column ("Want the full walkthrough? Get in touch" plus email buttons), linking to `/#contact`.
- Its own `<title>`, meta description, canonical URL, and OG tags (the shared OG image is fine).
- Content lives in the typed data module, or in Markdown via mdsvex; builder's choice. Prerender these pages.
- Diagrams are drawn fresh for the site, not exported from internal docs.

**"More projects" list** below the grid: one compact row each (title, year if known, one-line description, tags, link). Builder designs the row in the prototype's border and mono style.

| Project                                                                                    | Year                | Link                                                                   |
| ------------------------------------------------------------------------------------------ | ------------------- | ---------------------------------------------------------------------- |
| Task1 (syncs tasks between ClickUp, Jira and Asana)                                        | 2026                | Private repo                                                           |
| Accessibility Widget (drop-in, framework-agnostic accessibility preferences web component) | 2026                | `github.com/emmabyte-engineering/accessibility`                        |
| Study Stack                                                                                | 2025                | demo `study-stack-demo.vercel.app` · `github.com/emmabyte/study-stack` |
| MiniFTP                                                                                    | from git, else omit | `github.com/emmabyte/mini-ftp`                                         |
| Parallel Clustering                                                                        | from git, else omit | `github.com/emmabyte/Parallel-Clustering`                              |
| Physics Engine Library                                                                     | from git, else omit | `github.com/emmabyte/PhysicsEngine`                                    |
| Fractal Explorer                                                                           | from git, else omit | `github.com/emmabyte/fractalExplorer`                                  |

Descriptions for the older projects come from the current `projects.json`, trimmed to one line. The older Swift and C++ projects predate coding agents and show fundamentals, so they stay. Dropped (my call, Emma can restore any of them): EightPuzzle Solver, Shell-Based Social Media Platform and Stress Analyzer, which were coursework or team class projects.

### 02 — How I ship

- Keep the `ShipPipeline` diagram's look and animation (grid, beams, glow, fan-out), but **strip every invented figure** (my call, following the no-fabricated-content rule): no "38s" build, no fake commit hash, no per-region latencies, no "deploying" status. Stages become label-only: `git push` → `test & build` (Vitest, Playwright, GitHub Actions) → `preview URL` / `production` on Vercel. Keep the fan-out to the right as a set of unlabelled or generically labelled targets (e.g. "preview", "production") rather than named regions. The caption stays `// from commit to production, on every push`. Rewrite the `aria-label` to describe the new content with no numbers.
- Section description (draft): "Small, tested changes on solid pipelines. Here's the path a change takes from my editor to users."
- Three principles (draft, from Emma's real practice):
  1. **Pipelines before features** — CI/CD with unit and end-to-end tests (Vitest, Playwright, GitHub Actions) goes in first, so every change after that ships safely.
  2. **Reproducible environments** — containerized, SSL-enabled dev environments mean a new engineer is productive on day one, not day five.
  3. **Modernize in phases** — stabilize first, then rebuild the critical flows, then replace the platform. Each phase delivers value on its own.
- **"How I work with AI" note** (Emma accepted the research's recommendation of quiet, factual disclosure). This is one short plain paragraph under the three principles, not a card and not a headline, and it's the only place on the site that mentions AI. Draft: "I use AI coding agents for much of the implementation work. Architecture, security-sensitive code, test design and code review stay with me, and patient data, secrets and client code never go into a prompt." _Emma confirms the guardrails are accurate before launch._ It must stay consistent with public repos, whose commits may carry `Co-Authored-By: Claude` trailers.

### 03 — Tools of the trade

Section description (draft): "Proven tools I go deep on. Here's what I reach for most."

Four columns (draft, drawn from Emma's work history and keyword list):

- **Frontend:** TypeScript, SvelteKit, React, Tailwind CSS, SwiftUI
- **Backend:** Node.js, Go, Swift / Vapor, Python, REST & GraphQL
- **Data:** PostgreSQL, Prisma, Kysely, Supabase, PlanetScale
- **Infra:** Vercel, Docker, GitHub Actions, Kubernetes, Linux

### 04 — Experience

- Section description (draft): "From IT and analytics in 2016 to full-time engineering since 2023." (Don't frame it as ten years of engineering; see the Hero stats note.)
- **Résumé link** in the section heading area: "Full résumé (PDF) ↓", downloads `static/documents/resume.pdf` with filename `resume-emma-long.pdf`. Quiet text-link styling, not a button.
- Rows in the prototype layout (period · company + title · one-line summary). Summaries condensed from the current bullets (draft wording below; builder may tighten).
- Each row has a small **"Q&A"** disclosure that expands to show that job's FAQ question/answer pairs **verbatim** from `work-history.json`. Collapsed by default. Accessible (`button` with `aria-expanded`, or `<details>/<summary>`), respects reduced motion.
- Company names link to the company URL.
- No company logos (prototype has none).

| Period      | Company                    | Title                                      | Summary (draft)                                                                                                                                                                                                           |
| ----------- | -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2025 — Now  | Emmabyte Engineering, Inc. | _open_ (e.g. Founder & Principal Engineer) | Run a small engineering company building SaaS products and client software, including a HIPAA-compliant case-management platform, a CRM and client portal, and open-source developer tools. Hire and interview engineers. |
| 2023 — Now  | Haven Ministries           | Software Developer                         | Sole engineer leading a three-phase modernization: performance and reliability, a rebuilt donation system, and a ground-up replacement of a decade-old WordPress site.                                                    |
| 2022 — 2025 | Study Stack                | Co-Founder & Lead Engineer                 | Designed and built a cloud-native learning platform end to end, with full CI test coverage, and mentored a junior developer. Now open source.                                                                             |
| 2023        | SpaceX                     | Software Engineer II                       | Infrastructure team: containerized dev services, refined CI/CD pipelines, and scripted environment setup to speed up onboarding.                                                                                          |
| 2016 — 2023 | Haven Ministries           | IT & Analytics Advisor                     | Linux servers, data pipelines and dashboards, and CI/CD support — and led a monolith-to-microservices migration that cut downtime.                                                                                        |

Order: as above. Emmabyte is the single umbrella entry for the freelance and company work (the research's recommendation, which Emma accepted). Its projects appear under Selected work, and its summary links there. The Emmabyte row has no Q&A unless Emma writes some. The 2025 start comes from the first emmabyte.io commit (July 2025).

SpaceX's period is deliberately just "2023". Emma was there about a week and prefers not to be precise; don't add months or an end date. Keep its FAQ entries as written.

### 05 — Contact

Two-column card on desktop, stacked on mobile.

- **Left:** `05` index; heading (draft) "Building something that needs an engineer? Let's talk."; supporting line (_depends on the availability open item_); coral `mailto:` button showing the email; Copy email button (inline "Copied" state, as in the prototype — no toast needed); link row: LinkedIn (`linkedin.com/in/emmabyte`), GitHub (`github.com/emmabyte`), Résumé (PDF).
- **Right:** the contact form, restyled in prototype vocabulary (rounded inputs with the prototype's border/ring tokens, coral pill submit button).
  - Fields unchanged from `src/lib/schemas/contact.ts`: name, email, organization, position, message.
  - Keep the flow: reCAPTCHA v3 token on submit → `POST /api/contact` → server verifies (score > 0.5) → MailerSend template email. Keep `src/routes/api/contact/*`, `src/lib/mailersend.ts`, `src/lib/recaptcha.ts`.
  - Success/error feedback: keep `svelte-sonner` toasts, restyled to the prototype's tokens, _or_ inline status under the button — builder's choice, but it must be visible and announced to screen readers.
  - Read the reCAPTCHA site key from `PUBLIC_RECAPTCHA_SITE_KEY` (it's currently hard-coded in `contact-form.svelte`).
  - Show reCAPTCHA's required attribution text if the badge is hidden.
  - **Loading (my call):** stop loading the reCAPTCHA script in `<head>` on every page. Load it when the contact section first approaches the viewport (IntersectionObserver with a generous root margin), and also on first focus of any form field as a fallback. This keeps it off the critical path for Lighthouse while still giving v3 time to observe the visitor before submit. The server's score threshold (> 0.5) stays unchanged. If real submissions start failing on score after launch, revisit.
- Email address: `emmalong.dev@gmail.com` (as on the current site).

### Footer

`© {year} Emma Long` · "Built with SvelteKit, Tailwind CSS & deployed on Vercel."

## SEO and metadata

Replaces `keywords-seo-section.svelte`, which is deleted.

- `<title>`: "Emma Long — Full-Stack Engineer"; meta description written from the hero intro.
- Open Graph + Twitter card tags (title, description, image). OG image: builder creates a simple static 1200×630 PNG in the new visual style (name, role, coral dot on the off-white background).
- Canonical URL and `og:url`: `https://emma-long.vercel.app` (Emma confirmed). `emmalong.dev` is only the MailerSend sending domain; leave it as is.
- JSON-LD `Person`: name, jobTitle, url, sameAs (LinkedIn, GitHub), worksFor (Haven Ministries), knowsAbout (the Stack items).
- Favicon: new one in the prototype style (coral dot). The old `favicon.png` goes.
- `theme-color` `#fbfbfa`.

## What gets removed

- Components: hero particle scene (`(particle-scene)/*`, shaders), `about-me.svelte` (its content is superseded by the hero intro — the "5 years" figure is stale), `keywords-seo-section.svelte`, old header markup in `+layout.svelte`.
- Dependencies no longer used: `three`, `@types/three`, `postprocessing`, `vite-plugin-glsl`, Font Awesome packages, `svelte-fa`, `svelte-forms-lib`, `mode-watcher`, `tailwindcss-animate`, `@tailwindcss/container-queries`, and any shadcn-svelte UI components that end up unused. Keep `sveltekit-superforms` and `zod`: the kept `/api/contact` route validates with `superValidate` and `send-email.ts` uses the `SuperValidated` type. Drop `formsnap` if the restyled form doesn't use it.
- Assets: project cover `.avif` files, company logo SVGs, `image-placeholder.svg`, `favicon.png`, `src/lib/data/keywords.json`, and the JSON data files once migrated.
- The unused default form action in `+page.server.ts` that only `console.log`s (the form posts to `/api/contact`). Builder decides whether `load` is still needed for superforms.

## Quality bar

- `pnpm check`, `pnpm lint`, and `pnpm build` pass.
- Replace the demo tests with: a unit test for the contact schema, and a Playwright smoke test that loads the page, checks each section heading and nav anchor, and checks the contact form shows validation errors on empty submit (no real email sent).
- Accessibility: semantic landmarks, one `h1`, labelled sections (as the prototype does with `aria-labelledby`), visible focus states, sufficient contrast, keyboard-operable Q&A toggles and copy button.
- Responsive from 360px up with no horizontal scroll (the pipeline SVG scrolls inside its own container, as in the prototype).
- Lighthouse performance and accessibility in the 90s on mobile.

## Left to the builder

- Component file layout and naming, the data module's exact shape.
- How the dot-field canvas and scramble text are structured in Svelte (actions vs components), as long as behaviour and reduced-motion handling match the prototype.
- The "More projects" row design and the Q&A toggle's visual treatment, within the prototype's vocabulary.
- Toasts vs inline form status.
- Exact trimming of project summaries and experience one-liners, staying factual.

## Decisions log

- **Résumé:** Emma supplies an updated PDF before launch (see the checklist below).
- **SpaceX:** the period stays "2023".
- **Site URL:** `emma-long.vercel.app`.
- **Location:** Los Angeles Metropolitan Area.
- **Harbor:** proprietary and HIPAA-compliant. No source, no code, and synthetic-data screenshots only.
- **AI:** quiet, factual disclosure in one place (How I ship).
- **Emmabyte:** a single umbrella entry in Experience.
- **Featured lineup:** Harbor, the Emmabyte platform, Tarot Tutor and Pulse.
- **Case studies:** dedicated `/work/{slug}` pages.

## Launch checklist (content Emma supplies; none of it changes what gets built)

Build with clearly marked placeholder values (e.g. `TODO(emma): ...` strings in the data module, rendered visibly in dev only), and fail `pnpm build` in production mode if any `TODO(emma)` remains, so nothing unfinished can ship. The builder decides how.

1. **Résumé PDF.** It replaces `static/documents/resume.pdf`; the current file still contains template placeholders.
2. **Ownership and naming.** Confirm that Harbor, Tarot Tutor, Pulse, Task1, the widget and emmabyte.io are Emmabyte's or Emma's own products, so naming them needs no client consent. Confirm whether `harborcm.io` can be linked yet.
3. **Role and Impact** for each featured project, in terms Emma is comfortable stating publicly.
4. **Case-study content.** I'll draft it from each repo's docs; Emma reviews it.
5. **Emmabyte title** for the Experience row.
6. **Is Haven still current?** That affects its "Now" end date and the hero intro.
7. **Badge text.** My recommendation is "Taking on freelance projects".
8. **AI guardrails.** Confirm the wording of the How I work with AI note.
9. Review all copy marked _draft_ above.
