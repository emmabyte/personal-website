# Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Emma Long's portfolio in SvelteKit with the prototype's design, Emma's real content, the kept contact form, and four case-study pages.

**Architecture:** All content lives in typed modules under `src/lib/data/`. Unfinished content is written as `todo('...')` values, and a Vite plugin fails production builds while any remain. Every page is prerendered: the home page with its sections, and `/work/{slug}` for each case study. The only dynamic route is the existing `POST /api/contact`. UI is a set of small Svelte 5 components under `src/lib/components/`, ported by hand from the React prototype.

**Tech Stack:** SvelteKit 2, Svelte 5 (runes), TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), Geist via `@fontsource-variable`, `@lucide/svelte`, zod 3 + `sveltekit-superforms` (server only), MailerSend, reCAPTCHA v3, Vitest, Playwright, pnpm, `@sveltejs/adapter-vercel`.

**Spec:** `docs/superpowers/specs/2026-10-25-portfolio-revamp-design.md`. Read it alongside this plan. All copy marked _draft_ there is copied verbatim into the data modules.

**Design reference:** `/Users/emmalong/Downloads/full-stack-developer-portfolio` (read only). Each task names the prototype files it ports. Port markup and Tailwind classes. Never add React dependencies.

## Global Constraints

- Svelte 5 runes only (`$props`, `$state`, `$derived`, `$effect`); no `$:`, no `export let`.
- File names are kebab-case `.svelte`/`.ts`, matching the repo's existing convention (`contact-form.svelte`).
- Light only: `color-scheme: light`, no dark variant, `theme-color` `#fbfbfa`.
- Colour tokens copied verbatim from the prototype `app/globals.css` `:root` block (`--primary: #d63a4f`, `--brand: #f9586c`, `--accent: #f9586c`, `--radius: 0.625rem`, …).
- Fonts: Geist Sans and Geist Mono via `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`. No Google Fonts, Inter or Pixelify.
- Icons: `@lucide/svelte` only.
- Every animation honours `prefers-reduced-motion` exactly as the prototype does.
- Every home section is `<section id="…" aria-labelledby="…-title">` with exactly one `h2` (via `SectionHeading`), and the page has a single `h1`.
- Canonical origin: `https://emma-long.vercel.app`. Public email: `emmalong.dev@gmail.com`. Socials: `https://www.linkedin.com/in/emmabyte/`, `https://github.com/emmabyte`.
- No invented numbers or placeholder people or companies. Anything Emma hasn't supplied is a `todo('…')` value (Task 2).
- AI is mentioned in exactly one place on the site: `howIShip.aiNote`.
- Harbor: no source link, no code, no `<img>`. Say "HIPAA-compliant", never "HIPAA certified".
- No `svelte-sonner`, `bits-ui`, `formsnap`, shadcn UI components, Font Awesome or Three.js in the final dependency list.

## Review Focus

1. **Submitting before reCAPTCHA has loaded** (fast typist, slow network). The submit should wait for the script, not fail. Test in Task 9: `getRecaptchaToken loads the script when it isn't loaded yet`.
2. **The API returns an error** (500, or 400 for a low reCAPTCHA score). The visitor should see an error message and keep everything they typed. Test in Task 9: `server error keeps the typed values and shows the message`.
3. **Double-clicking Send.** Exactly one request should go out. Test in Task 9: `double submit sends one request`.
4. **A 360px-wide phone.** No page should scroll horizontally, and the long email button must wrap. Test in Task 11: `no horizontal overflow at 360px`.
5. **Header links clicked from a case-study page.** They should land on the home page sections, not dead `#` anchors on the current page. Test in Task 4: `header links on a case study go to home sections`.

---

### Task 1: Toolchain reset (Tailwind v4, fonts, tokens, strip the old UI)

**Files:**

- Modify: `package.json`, `vite.config.ts`, `tsconfig.json`, `svelte.config.js` (unchanged adapter), `.prettierrc`, `.prettierignore`, `src/app.html`, `src/app.css`, `src/lib/utils.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`, `src/routes/api/contact/+server.ts`, `playwright.config.ts`
- Create: `src/routes/+layout.ts`, `static/favicon.svg`, `e2e/home.test.ts`
- Delete: `tailwind.config.ts`, `postcss.config.js`, `components.json`, `src/lib/components/ui/` (all), `src/routes/(components)/` (all), `src/routes/+page.server.ts`, `src/lib/types/social-link.ts` (it imports Font Awesome types), `src/demo.spec.ts`, `e2e/demo.test.ts`, `static/images/` (all), `static/favicon.png`

**Interfaces:**

- Produces: Tailwind v4 theme utilities matching the prototype (`bg-background`, `text-muted-foreground`, `bg-primary`, `border-border`, `font-mono`, `rounded-2xl`, …). Custom classes `.beam`, `.spin`, `.ping`, `.conic-border`, `.spotlight`, `.spotlight-fill`, `.spotlight-border`. `cn(...inputs: ClassValue[]): string` from `$lib/utils`. `export const prerender = true` at the root.

- [ ] **Step 1: Dependencies.** Remove `three @types/three postprocessing vite-plugin-glsl @fortawesome/fontawesome-common-types @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons svelte-fa svelte-forms-lib mode-watcher tailwindcss-animate @tailwindcss/container-queries @tailwindcss/forms @tailwindcss/typography autoprefixer formsnap bits-ui svelte-sonner tailwind-variants`. Add `tailwindcss@^4 @tailwindcss/vite@^4 @fontsource-variable/geist @fontsource-variable/geist-mono` as dev dependencies. Run `pnpm install`.
- [ ] **Step 2: Config.**
  - `vite.config.ts`: plugins become `[tailwindcss(), sveltekit()]`, with no glsl.
  - `tsconfig.json`: drop the `types: ["vite-plugin-glsl/ext"]` entry.
  - `.prettierrc`: add `"tailwindStylesheet": "./src/app.css"`.
  - `.prettierignore`: add `research_notes/` and `reports/`. These are local-only research folders, excluded from git.
  - `playwright.config.ts`: set `webServer.command` to `pnpm build && pnpm preview`, and set `webServer.env` to `{ PUBLIC_RECAPTCHA_SITE_KEY: 'test-site-key', RECAPTCHA_SECRET_KEY: 'test-secret', MAILERSEND_API_KEY: 'test-key' }`.
- [ ] **Step 3: `src/app.css`.** Port the prototype `app/globals.css`:
  - `@import 'tailwindcss';` replaces the three prototype imports. Drop `tw-animate-css`, `shadcn/tailwind.css` and the dark `@custom-variant`.
  - Copy the `@theme inline` block, with `--font-sans: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;` and `--font-mono: 'Geist Mono Variable', ui-monospace, SFMono-Regular, monospace;`.
  - Copy the `:root` tokens, the `@layer base` rules, `@property --angle`, all keyframes, the `@layer components` classes and the reduced-motion block, verbatim.
  - Add `.grecaptcha-badge { visibility: hidden; }`. Task 9 adds the attribution text that hiding the badge requires.
- [ ] **Step 4: Shell.**
  - `src/app.html`: remove the Google Fonts `<link>`s. Point the icon at `%sveltekit.assets%/favicon.svg`. Add `<meta name="theme-color" content="#fbfbfa" />` and `<meta name="color-scheme" content="light" />`.
  - `static/favicon.svg`: a 32×32 viewBox with a centred coral (`#f9586c`) circle of radius 8 on a transparent background.
  - `+layout.svelte` imports `../app.css`, `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`, then renders `{@render children()}`. No reCAPTCHA `<script>`.
  - `+layout.ts`: `export const prerender = true;`.
  - `+page.svelte`: `<main><h1>Emma Long</h1></main>`.
  - `src/routes/api/contact/+server.ts`: add `export const prerender = false;` and change nothing else.
  - `src/lib/utils.ts`: keep only `cn` (clsx + tailwind-merge) and delete any shadcn type helpers.
- [ ] **Step 5: Write the e2e test** `e2e/home.test.ts` → `test('home renders a single h1 reading Emma Long')`. Assert `page.locator('h1')` has count 1 and text `Emma Long`.
- [ ] **Step 6: Verify.** Run `pnpm format` once, so the existing Markdown docs pass `prettier --check`. Then run `pnpm check && pnpm lint && pnpm build && pnpm test:e2e`. Expected: all pass with 0 svelte-check errors. Then run `rg -n "three|fortawesome|svelte-fa|bits-ui|formsnap|sonner|Pixelify|Inter" package.json src`. Expected: no matches.
- [ ] **Step 7: Commit.** `git add -A && git commit -m "chore: reset toolchain to tailwind v4 and strip old UI"`

---

### Task 2: Content data modules and the production content guard

**Files:**

- Create: `src/lib/data/types.ts`, `src/lib/data/todo.ts`, `src/lib/data/profile.ts`, `src/lib/data/projects.ts`, `src/lib/data/experience.ts`, `src/lib/data/stack.ts`, `src/lib/data/process.ts`, `src/lib/data/case-studies.ts`, `src/lib/data/launch-gates.ts`, `src/lib/data/data.spec.ts`, `src/lib/build/content-guard.ts`, `src/lib/build/content-guard.spec.ts`
- Modify: `vite.config.ts`
- Delete: `src/lib/data/projects.json`, `src/lib/data/work-history.json`, `src/lib/data/keywords.json`. Copy the FAQs out of `work-history.json` before deleting it.

**Interfaces:**

- Produces, in `types.ts` (exact):

```ts
export type Link = { label: string; href: string };
export type Profile = {
	name: string;
	role: string;
	wordmark: string;
	email: string;
	location: string;
	availability: string;
	intro: string;
	roles: string[];
	siteUrl: string;
	socials: Link[];
	resume: { href: string; filename: string };
	contactHeading: string;
	contactLine: string;
};
export type Stat = { value: string; label: string };
export type StackGroup = { area: string; items: string[] };
export type ProjectSlug = 'harbor' | 'emmabyte' | 'tarot-tutor' | 'pulse';
export type FeaturedProject = {
	slug: ProjectSlug;
	title: string;
	year: string;
	summary: string;
	role: string;
	impact: string;
	tags: string[];
	liveUrl?: string;
	repoUrl?: string; // no repoUrl = private repo
};
export type MoreProject = {
	title: string;
	year?: string;
	description: string;
	tags: string[];
	links: Link[];
};
export type Faq = { question: string; answer: string };
export type Job = {
	period: string;
	company: string;
	companyUrl?: string;
	title: string;
	summary: string;
	link?: Link;
	faqs: Faq[];
};
export type Principle = { title: string; body: string };
export type DiagramColumn = { label: string; items: string[] };
export type Decision = { decision: string; rejected: string[]; why: string };
export type CaseStudy = {
	slug: ProjectSlug;
	status: string;
	problem: string[];
	role: string[];
	architecture: { caption: string; description: string; columns: DiagramColumn[] };
	decisions: Decision[];
	testing: string[];
	outcome: string[];
	compliance?: string[];
	review?: string; // review: a todo() gate that's never rendered
};
```

- `todo.ts`: `todo(note: string): string` returns `` `TODO(emma): ${note}` ``.
- `profile.ts`: `profile: Profile`, `stats: Stat[]`.
- `projects.ts`: `featuredProjects: FeaturedProject[]` (order: harbor, emmabyte, tarot-tutor, pulse) and `moreProjects: MoreProject[]`.
- `experience.ts`: `experience: { description: string; jobs: Job[] }`.
- `stack.ts`: `stack: { description: string; groups: StackGroup[] }`.
- `process.ts`: `howIShip: { description: string; principles: Principle[]; aiNote: string }`. It's named `howIShip` so it doesn't shadow Node's global `process`.
- `case-studies.ts`: `caseStudies: CaseStudy[]` and `getCaseStudy(slug: string): { project: FeaturedProject; study: CaseStudy; index: number } | undefined`. `index` is 1-based and follows `featuredProjects` order.
- `launch-gates.ts`: `launchGates: string[]`.
- `content-guard.ts`:

  - `findPendingContent(files: { path: string; content: string }[]): { path: string; line: number; note: string }[]`
  - `shouldEnforce(env: Record<string, string | undefined>): boolean`
  - `contentGuard(): import('vite').Plugin`

- [ ] **Step 1: Write the failing guard tests** in `content-guard.spec.ts`.
  - `findPendingContent reports each todo call with path, line and note`: the input is `[{ path: 'a.ts', content: "x\nrole: todo('Role for Harbor'),\n" }]`, and the result equals `[{ path: 'a.ts', line: 2, note: 'Role for Harbor' }]`. It must handle `'`, `"` and backtick quotes.
  - `findPendingContent ignores the todo definition itself`: content `export function todo(note: string)` gives `[]`.
  - `shouldEnforce is true only for Vercel production or REQUIRE_CONTENT=1`. Cases: `{VERCEL_ENV:'production'}` → true, `{REQUIRE_CONTENT:'1'}` → true, `{VERCEL_ENV:'preview'}` → false, `{}` → false.
- [ ] **Step 2: Run** `pnpm test:unit -- --run src/lib/build`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement `content-guard.ts`.**
  - `findPendingContent` matches the regex `/\btodo\(\s*(['"`])(.\*?)\1/g` line by line.
  - In `buildStart`, `contentGuard()` (when `shouldEnforce(process.env)`) reads every `.ts` file under `src/lib/data/` except `todo.ts`, using `fs.readdirSync(dir, { recursive: true })`. If there are any matches, it throws an `Error` that lists `path:line note` one per line, headed `Launch content still pending (see spec "Launch checklist"):`.
  - Register it first in `vite.config.ts`'s plugins.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Write the failing data tests** in `data.spec.ts`:
  - `featured projects are harbor, emmabyte, tarot-tutor, pulse in that order`
  - `every featured project has exactly one case study and getCaseStudy('nope') is undefined`
  - `getCaseStudy('pulse') returns index 4`
  - `only Pulse has a repoUrl among featured projects`, which equals `https://github.com/emmabyte-engineering/pulse`
  - `harbor has no repoUrl and its copy never says "certified"`. Search every string reachable from the Harbor project and its case study.
  - `the AI note is the only content mentioning AI`. Collect every string in all exported data via a recursive walk. Only `howIShip.aiNote` may match `/\b(AI|Claude|Copilot|Cursor|LLM)\b/`.
  - `no prototype placeholders survive`. No data string matches `/Alex Rivera|Lisbon|Northwind|Brightpath|Fieldnote|40M|alexrivera/i`.
  - `no data string claims ten years`. No match for `/\b10\+? ?(years|yrs)\b/i`.
  - `SpaceX period is exactly "2023"`
  - `experience order is Emmabyte, Haven, Study Stack, SpaceX, Haven`. Compare the company names.
  - `every Q&A answer is copied verbatim`. Assert the SpaceX job's first FAQ question equals `Why was this role so short?`.
  - `more projects lists seven entries in spec order`. Compare titles: `Task1`, `Accessibility Widget`, `Study Stack`, `MiniFTP`, `Parallel Clustering`, `Physics Engine Library`, `Fractal Explorer`.
- [ ] **Step 6: Run** `pnpm test:unit -- --run src/lib/data`. Expected: FAIL.
- [ ] **Step 7: Fill the modules** with the spec's values verbatim.
  - **`profile`:** `name 'Emma Long'`, `role 'Full-Stack Engineer'`, `wordmark 'emma.long'`, `location 'Los Angeles Metropolitan Area'`, `siteUrl 'https://emma-long.vercel.app'`. `roles` are the four scramble words. `intro` is the spec draft. `resume: { href: '/documents/resume.pdf', filename: 'resume-emma-long.pdf' }`. `contactHeading` is the spec draft heading. Socials are LinkedIn and GitHub.
  - **`stats`:** the three spec stats.
  - **Experience, stack and process:** the spec's descriptions, rows, columns and principles, plus the `aiNote` draft. FAQs are copied verbatim from `work-history.json`. Emmabyte has `faqs: []` and `link: { label: 'See selected work', href: '/#work' }`. Company URLs come from the JSON (`https://haventoday.org`, `https://study-stack-demo.vercel.app`, `https://spacex.com`), and Emmabyte uses `https://www.emmabyte.io`.
  - **Projects:** `featuredProjects` and `moreProjects` from the spec tables. Fill MiniFTP, Parallel Clustering, Physics Engine and Fractal Explorer `year` from `git log` in a local clone if one exists under `~/Repos`. Otherwise leave `year` undefined.
  - **`todo()` values**, exactly these:
    - `profile.availability = todo('badge text — recommended "Taking on freelance projects"')`
    - `profile.contactLine = todo('contact supporting line, matches the badge')`
    - each featured project's `role` and `impact`, as `todo('<Project> role')` and `todo('<Project> impact')`
    - the Emmabyte job `title = todo('Emmabyte title, e.g. Founder & Principal Engineer')`
  - **`case-studies.ts`:** for now, each of the four studies has `status`, every string array and the architecture filled with `todo('<Project> case study: <section>')` values, one-element arrays, and `review: todo('<Project> case study review')`. Task 10 replaces them.
  - **`launchGates`:**
    - `todo('replace static/documents/resume.pdf with the updated résumé')`
    - ``todo(`confirm all six projects are yours or Emmabyte's to name; confirm harborcm.io can be linked`)``. Use a backtick string, because of the apostrophe.
    - `todo('is Haven still current? update period and hero intro')`
    - `todo('confirm the How I work with AI guardrails')`
    - `todo('review all draft copy')`
  - Delete the three JSON files.
- [ ] **Step 8: Run** `pnpm test:unit -- --run && pnpm check`. Expected: PASS. Then run `REQUIRE_CONTENT=1 pnpm build`. Expected: FAIL, with output listing `src/lib/data/launch-gates.ts` lines. Then run `pnpm build`. Expected: PASS.
- [ ] **Step 9: Commit.** `git add -A && git commit -m "feat: typed content modules with launch content guard"`

---

### Task 3: Site shell — header, footer, SEO, OG image, home section anchors

Ports `site-header.tsx` and `site-footer.tsx`.

**Files:**

- Create: `src/lib/components/site/site-header.svelte`, `src/lib/components/site/site-footer.svelte`, `src/lib/components/site/seo.svelte`, `src/lib/seo.ts`, `src/lib/seo.spec.ts`, `scripts/generate-og-image.mjs`, `static/og.png`, `e2e/shell.test.ts`
- Modify: `src/routes/+layout.svelte`, `src/routes/+page.svelte`

**Interfaces:**

- Consumes: `profile`, `stack`, `experience` from Task 2.
- Produces:

  - `<Seo title description path jsonLd? />` with props `{ title: string; description: string; path: string; jsonLd?: Record<string, unknown> }`.
  - `jsonLdScript(data: unknown): string`, which returns a full `<script type="application/ld+json">…</script>` string with every `<` escaped as `<`.
  - `personJsonLd(): Record<string, unknown>`.
  - `+page.svelte` placeholder sections, each `<section id="…">` with an `aria-labelledby` heading, for `top`, `work`, `process`, `stack`, `experience` and `contact`. Tasks 5–9 each replace one of them.

- [ ] **Step 1: Write the failing unit tests** in `seo.spec.ts`:
  - `jsonLdScript escapes a closing script tag`. The input `{ a: '</script><b>' }` gives an output that doesn't contain `</script><b>` and does contain `</script>`.
  - `personJsonLd has Person type, site url and both socials in sameAs`. Expect `@type 'Person'`, `url 'https://emma-long.vercel.app'`, and `sameAs` equal to the two social hrefs. `worksFor` names `Emmabyte Engineering, Inc.` and `Haven Ministries`. `knowsAbout` is every stack item.
- [ ] **Step 2: Run** `pnpm test:unit -- --run src/lib/seo.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement `seo.ts` and `seo.svelte`.**
  - Inside `<svelte:head>`, `seo.svelte` renders:
    - `<title>`
    - `meta[name=description]`
    - `link[rel=canonical]` = `profile.siteUrl + path`
    - `og:title`, `og:description`, `og:type=website`, `og:url`, and `og:image` = `${siteUrl}/og.png` at 1200×630
    - `twitter:card=summary_large_image`
    - `{@html jsonLdScript(jsonLd)}` when `jsonLd` is given
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Write the failing e2e tests** in `e2e/shell.test.ts`:
  - `header shows wordmark and nav`. The banner contains `emma.long`. Links named Work, Process, Stack, Experience and Contact have hrefs `/#work`, `/#process`, `/#stack`, `/#experience` and `/#contact`.
  - `contact pill stays visible on a 360px viewport while the other nav links are hidden`.
  - `home has canonical, og:image and a parseable Person JSON-LD`. The canonical is `https://emma-long.vercel.app/`, and `JSON.parse` on the ld+json text gives `@type` `Person`.
  - `footer shows the year and the built-with line`. It contains `© ${new Date().getFullYear()} Emma Long` and `Built with SvelteKit, Tailwind CSS & deployed on Vercel.`.
- [ ] **Step 6: Run** `pnpm test:e2e e2e/shell.test.ts`. Expected: FAIL.
- [ ] **Step 7: Implement the shell.**
  - The header ports the prototype header: a sticky blurred bar, a coral dot plus the mono wordmark linking to `/`, and nav links that are `hidden sm:block` except the Contact pill. All hrefs use the `/#id` form (see Review Focus 5).
  - The footer ports the prototype footer.
  - `+layout.svelte` wraps `children` with the header and footer.
  - `+page.svelte` renders `<Seo title="Emma Long — Full-Stack Engineer" description={…from profile.intro} path="/" jsonLd={personJsonLd()} />` and the six placeholder sections. Keep the Task 1 h1 inside `#top`.
- [ ] **Step 8: Generate the OG image.**
  - `scripts/generate-og-image.mjs` uses `chromium` from `@playwright/test` to render an inline HTML string at 1200×630. The image shows the off-white `#fbfbfa` background, a coral dot, "Emma Long" in Geist 600 at 88px, and "Full-Stack Engineer" in Geist Mono in the muted colour. It writes `static/og.png`.
  - Run `node scripts/generate-og-image.mjs`. Run `pnpm exec playwright install chromium` first if it's needed.
- [ ] **Step 9: Run** `pnpm test:e2e && pnpm check`. Expected: PASS.
- [ ] **Step 10: Commit.** `git add -A && git commit -m "feat: site shell with header, footer, seo and og image"`

---

### Task 4: Case-study route and shared primitives

Uses placeholder data from Task 2.

**Files:**

- Create:
  - `src/lib/components/ui/section-heading.svelte`
  - `src/lib/components/ui/plus-corners.svelte`
  - `src/lib/components/ui/copy-email-button.svelte`
  - `src/lib/components/contact/contact-links.svelte`
  - `src/lib/components/case-study/architecture-diagram.svelte`
  - `src/lib/components/case-study/case-study-section.svelte`
  - `src/routes/work/[slug]/+page.ts`
  - `src/routes/work/[slug]/+page.svelte`
  - `e2e/case-study.test.ts`

**Interfaces:**

- Consumes: `getCaseStudy` and `featuredProjects` (Task 2), and `Seo` (Task 3).
- Produces:

  - `<SectionHeading index title id description? />`, ported from `section-heading.tsx`: `{ index: string; title: string; id: string; description?: string }`. It also takes a `children` snippet placed beside the description; Task 8 uses it for the résumé link.
  - `<PlusCorners />`, ported from `plus-corners.tsx`.
  - `<CopyEmailButton email />`, ported from `copy-email-button.tsx`, with inline "Copied" state and `aria-live="polite"`.
  - `<ContactLinks heading line headingId index? />`: `{ heading: string; line: string; headingId: string; index?: string }`. `index` renders as the mono coral label above the heading. It renders the heading, the line, the coral `mailto:` pill showing the email (with `break-all` so it wraps), `CopyEmailButton`, and a link row of the socials plus `Résumé (PDF)`, which uses `download={profile.resume.filename}`. Task 9 reuses it.
  - `<ArchitectureDiagram caption description columns />`: `{ caption: string; description: string; columns: DiagramColumn[] }`.
  - `<CaseStudySection label id />`, with a children snippet.

- [ ] **Step 1: Write the failing e2e tests** in `e2e/case-study.test.ts`:
  - `each featured slug prerenders a page with the project title as h1`. Loop over `harbor`, `emmabyte`, `tarot-tutor` and `pulse`.
  - `case study has back link, section labels, and contact CTA`. Check:
    - a link named `← All work` with href `/#work`
    - headings `Problem & constraints`, `My role`, `Architecture`, `Key decisions`, `Testing & verification` and `Outcome`
    - a link with href `/#contact`
  - `only harbor shows a Compliance section`. `/work/harbor` has the heading; `/work/pulse` doesn't.
  - `canonical is the case study url`. `/work/pulse` has the canonical `https://emma-long.vercel.app/work/pulse`.
  - `harbor page has no images`. `img` has count 0.
  - `unknown slug is a 404`. `page.goto('/work/nope')` returns response status 404.
  - `header links on a case study go to home sections` (Review Focus 5). On `/work/pulse`, clicking `Experience` ends at URL `/#experience`, and `#experience` is in the viewport.
  - `architecture diagram exposes its description`. `figure svg[role=img]` has an `aria-label` equal to the study's `architecture.description`.
- [ ] **Step 2: Run** `pnpm test:e2e e2e/case-study.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - `+page.ts`: `entries` returns every `featuredProjects` slug. `load({ params })` returns `getCaseStudy(params.slug)` or throws `error(404)`.
  - Page layout follows the spec's "Case-study page layout", in this order:
    1. the back link
    2. the heading block, with the mono `NN / YEAR` line where `NN` is the zero-padded `index`
    3. the meta row: Role, Status, tag pills, and Links (live site, plus source or "Private repo · walkthrough on request" pointing to `/#contact`)
    4. the sections, with Compliance rendered only when `study.compliance` exists
    5. the decisions, each shown as the decision, a mono "Rejected:" list, and the reasoning
    6. `ContactLinks` with heading `Want the full walkthrough? Get in touch.` and a line reading `I'm happy to walk through the architecture and decisions in more detail.`
    7. `<Seo title="{project.title} — Case study · Emma Long" description={project.summary} path="/work/{slug}" />`
  - `ArchitectureDiagram` borrows the `ship-pipeline.tsx` visual vocabulary: grid pattern, `PlusCorners`, coral glow, and `.beam` paths. It takes its size from `columns`:
    - columns are evenly spaced across a 1000-unit-wide viewBox
    - each column has a mono label, with rounded item boxes stacked below it
    - one `.beam` path runs between each pair of adjacent columns
    - the SVG sits in an `overflow-x-auto` wrapper with `min-w-[640px]`
- [ ] **Step 4: Run** `pnpm test:e2e && pnpm check`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: case study pages and shared primitives"`

---

### Task 5: Hero

Ports `hero.tsx`, `dot-field.tsx`, `scramble-text.tsx` and `code-card.tsx`.

**Files:**

- Create: `src/lib/components/hero/hero.svelte`, `src/lib/components/hero/dot-field.svelte`, `src/lib/components/hero/scramble-text.svelte`, `src/lib/components/hero/code-card.svelte`, `e2e/hero.test.ts`
- Modify: `src/routes/+page.svelte` (replace the `#top` placeholder)

**Interfaces:**

- Consumes: `profile` and `stats` (Task 2), and `PlusCorners` (Task 4).
- Produces: `<Hero />`. `<ScrambleText words />` with `{ words: string[] }`, which renders `data-scramble` on its text element.

- [ ] **Step 1: Write the failing e2e tests** in `e2e/hero.test.ts`:
  - `hero h1 contains the name and the screen-reader role`. The h1 contains `Emma Long`, and `.sr-only` inside it reads `Full-Stack Engineer`.
  - `hero buttons point at work and contact`. A link named `View selected work` has href `#work`, and `Get in touch` has href `#contact`. There is no résumé link inside `#top`.
  - `hero shows location and the three stats`. Look for `Los Angeles Metropolitan Area`, `2016`, `40s → 90s` and `10+ → ~0`.
  - `reduced motion shows the first role without scrambling`. With `page.emulateMedia({ reducedMotion: 'reduce' })`, `[data-scramble]` has text `Full-Stack Engineer`, and it still does after 1500 ms.
  - `code card is labelled and shows about.ts`. Find the figure with aria-label `Code snippet summarizing my engineering focus` and the caption `about.ts`.
- [ ] **Step 2: Run** `pnpm test:e2e e2e/hero.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** Port the four prototype components.
  - `DotField` keeps the prototype's constants (`GAP 24`, `POINTER_RADIUS 170`, `RIPPLE_DURATION 1800`, `RIPPLE_SPEED 0.38`, `ACCENT '249, 88, 108'`), its reduced-motion single draw, and its in-view pause. Implement the React `useEffect` as a Svelte `$effect` with teardown.
  - The code card lines are the spec's `about.ts` draft.
  - Stats and the badge come from data. While `profile.availability` is still a `todo()`, the badge renders that text, which is the intended visible marker in dev.
- [ ] **Step 4: Run** `pnpm test:e2e && pnpm check`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: hero with dot field, scramble text and code card"`

---

### Task 6: Selected work

Ports `projects.tsx` and `spotlight-card.tsx`, and adds More projects.

**Files:**

- Create: `src/lib/components/ui/spotlight-card.svelte`, `src/lib/components/work/project-card.svelte`, `src/lib/components/work/more-projects.svelte`, `src/lib/components/work/selected-work.svelte`, `e2e/work.test.ts`
- Modify: `src/routes/+page.svelte` (replace `#work`)

**Interfaces:**

- Consumes: `featuredProjects` and `moreProjects` (Task 2), and `SectionHeading` (Task 4).
- Produces: `<SelectedWork />`. `<SpotlightCard class />`, which takes a children snippet and sets `--x`/`--y` on `pointermove`.

- [ ] **Step 1: Write the failing e2e tests** in `e2e/work.test.ts`:
  - `four featured cards link to their case studies`. Inside `#work`, the card title links have hrefs `/work/harbor`, `/work/emmabyte`, `/work/tarot-tutor` and `/work/pulse`, in that order.
  - `card index lines read NN / YEAR`. The first card shows `01 / 2026`.
  - `private projects offer a walkthrough instead of source`. The Harbor card has a link named `Private repo · walkthrough on request` with href `#contact`, and no `Source code` link.
  - `pulse links its public source`. The Pulse card has a `Source code` link with href `https://github.com/emmabyte-engineering/pulse`.
  - `more projects lists seven rows`. `#work [data-more-project]` has count 7.
  - `work section has no images`. `#work img` has count 0.
  - `the secondary links stay clickable over the card overlay`. Stub `https://github.com/**` with `page.route(..., r => r.fulfill({ body: 'ok' }))`. Clicking the Pulse `Source code` link then lands on `https://github.com/emmabyte-engineering/pulse` (check the page URL, or the popup URL if it opens a new tab), not `/work/pulse`.
- [ ] **Step 2: Run** `pnpm test:e2e e2e/work.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - `SelectedWork` uses `SectionHeading` with index `01`, title `Selected work` and the spec description.
  - The card markup ports the prototype `ProjectCard`. The title link uses an `after:absolute after:inset-0` overlay that goes to `/work/{slug}`, and secondary links are `relative z-10`.
  - When `liveUrl` is set, add a "Live site" link to the link row.
  - Each More projects row is an `li[data-more-project]` with a border-top. It shows the title, the mono year if there is one, the description, mono tag pills, and links, opening external links with `rel="noreferrer"`.
- [ ] **Step 4: Run** `pnpm test:e2e && pnpm check`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: selected work cards and more projects list"`

---

### Task 7: How I ship and Tools of the trade

Ports `process.tsx`, `ship-pipeline.tsx` and `stack.tsx`.

**Files:**

- Create: `src/lib/components/process/ship-pipeline.svelte`, `src/lib/components/process/how-i-ship.svelte`, `src/lib/components/stack/stack-section.svelte`, `e2e/process-stack.test.ts`
- Modify: `src/routes/+page.svelte` (replace `#process` and `#stack`)

**Interfaces:**

- Consumes: `howIShip` and `stack` (Task 2), and `SectionHeading` and `PlusCorners` (Task 4).
- Produces: `<HowIShip />` and `<StackSection />`.

- [ ] **Step 1: Write the failing e2e tests** in `e2e/process-stack.test.ts`:
  - `pipeline diagram contains no invented figures`. In `#process svg[role=img]`, the `aria-label` doesn't match `/\d/`. The SVG's `textContent` doesn't match `/\d+\s?m?s\b|iad1|sfo1|lhr1|hnd1|gru1|a1f9c3e/`. Its stage labels include `git push`, `test & build`, `preview` and `production`.
  - `pipeline caption reads from commit to production`. Look for the text `// from commit to production, on every push`.
  - `three principles and the AI note render`. There are 3 `#process li` principle items, and the paragraph equals `howIShip.aiNote`.
  - `the home page mentions AI exactly once`. In `main`'s inner text, matches of `/\bAI\b/g` have count 1.
  - `stack shows four labelled columns`. Find the `// Frontend`, `// Backend`, `// Data` and `// Infra` headings. Each has 5 items.
- [ ] **Step 2: Run** `pnpm test:e2e e2e/process-stack.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - `ShipPipeline` ports the prototype's SVG structure, pattern, gradient, glow, beams, `.spin` and `.ping`, with these changes:
    - the left node is labelled `git push`
    - the centre node is labelled `test & build`, with sub-label `Vitest · Playwright · GitHub Actions`
    - the fan-out goes to two right-hand nodes labelled `preview` and `production`, replacing the five regions
    - the figcaption's left side reads `// from commit to production, on every push`, and the right side is dropped
    - `aria-label` = `Diagram: a git push triggers tests and a build on GitHub Actions, then deploys to a preview URL and to production on Vercel.`
  - `HowIShip` uses `SectionHeading` with index `02` and title `How I ship`, then the pipeline and the principles grid. The AI note sits below as one `<p class="mt-6 max-w-2xl text-sm text-muted-foreground">`.
  - `StackSection` uses index `03` and title `Tools of the trade`.
- [ ] **Step 4: Run** `pnpm test:e2e && pnpm check`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: how i ship pipeline and stack sections"`

---

### Task 8: Experience

Ports `experience.tsx`, and adds the Q&A disclosure and the résumé link.

**Files:**

- Create: `src/lib/components/experience/experience-section.svelte`, `src/lib/components/experience/job-qa.svelte`, `e2e/experience.test.ts`
- Modify: `src/routes/+page.svelte` (replace `#experience`)

**Interfaces:**

- Consumes: `experience` and `profile` (Task 2), and `SectionHeading` (Task 4).
- Produces: `<ExperienceSection />`, and `<JobQa faqs company />` with `{ faqs: Faq[]; company: string }`, which renders nothing when `faqs` is empty.

- [ ] **Step 1: Write the failing e2e tests** in `e2e/experience.test.ts`:
  - `five rows in spec order with periods`. The `#experience ol > li` periods equal `['2025 — Now','2023 — Now','2022 — 2025','2023','2016 — 2023']`.
  - `résumé link downloads the pdf quietly`. Inside `#experience`, the link named `Full résumé (PDF) ↓` has href `/documents/resume.pdf` and `download` = `resume-emma-long.pdf`. It is not styled as a filled button: its computed background colour is transparent.
  - `Q&A is collapsed by default and opens from the keyboard`. In the SpaceX row, the `details` isn't `open`. Focus its summary and press Enter, and the `details` becomes `open` and `Why was this role so short?` is visible.
  - `Emmabyte row has no Q&A and links to selected work`. The first row has 0 `details`, and its link `See selected work` has href `/#work`.
  - `company names link out`. The `Haven Ministries` link has href `https://haventoday.org`.
- [ ] **Step 2: Run** `pnpm test:e2e e2e/experience.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Use `SectionHeading` with index `04`, title `Experience` and the spec description. Put the résumé link in its children snippet, styled as a mono, underline-on-hover text link.
  - Rows use the prototype grid `md:grid-cols-[180px_1fr_1.4fr]`.
  - `JobQa` is a `<details>` whose `<summary>` reads `Q&A` in mono with a lucide `ChevronDown`. The chevron rotates when open, using `motion-reduce:transition-none`. The content is a `<dl>` of question/answer pairs.
- [ ] **Step 4: Run** `pnpm test:e2e && pnpm check`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: experience section with q&a and resume link"`

---

### Task 9: Contact section and form

Ports `contact.tsx` and keeps `/api/contact`.

**Files:**

- Create: `src/lib/contact/validate.ts`, `src/lib/contact/validate.spec.ts`, `src/lib/contact/recaptcha-client.ts`, `src/lib/contact/recaptcha-client.spec.ts`, `src/lib/schemas/contact.spec.ts`, `src/lib/components/contact/contact-form.svelte`, `src/lib/components/contact/contact-section.svelte`, `e2e/contact.test.ts`
- Modify: `src/lib/schemas/contact.ts` (messages only), `src/app.d.ts`, `src/routes/+page.svelte` (replace `#contact`), `package.json` (add `jsdom` dev dependency)

**Interfaces:**

- Consumes: `ContactLinks` (Task 4), `profile` (Task 2), and `ContactPostResponse` from `$lib/types/api/contact`.
- Produces:

  - `ContactFields = Omit<ContactFormData, 'gRecaptchaResponse'>`
  - `validateContact(input: Record<string, unknown>): { success: true; data: ContactFields } | { success: false; errors: Partial<Record<keyof ContactFields, string>> }`
  - `loadRecaptcha(siteKey: string): Promise<void>`, which is memoized
  - `getRecaptchaToken(siteKey: string, action?: string): Promise<string>`, with `action` defaulting to `'submit'`
  - `resetRecaptchaLoader(): void`, for tests only

- [ ] **Step 1: Write the failing unit tests.**
  - `contact.spec.ts`:
    - `schema rejects empty fields with friendly messages`. The messages are exactly `Please enter your name`, `Please enter a valid email`, `Please enter your organization`, `Please enter your position` and `Please write at least 10 characters`.
    - `schema accepts a complete submission`
  - `validate.spec.ts`:
    - `validateContact returns per-field errors without requiring a recaptcha token`
    - `validateContact trims nothing and passes valid data through`
  - `recaptcha-client.spec.ts`, which starts with `// @vitest-environment jsdom`:
    - `loadRecaptcha injects one script with the site key even when called twice`. The `src` equals `https://www.google.com/recaptcha/api.js?render=k`. Simulate `onload` and a `window.grecaptcha` stub whose `ready` calls back.
    - `getRecaptchaToken loads the script when it isn't loaded yet` (Review Focus 1). Call `getRecaptchaToken('k')` before any load. It resolves to the stub's `'tok'` after the script's `onload`, and `execute` is called with `('k', { action: 'submit' })`.
    - `loadRecaptcha rejects when the script fails to load, and a later call retries`
- [ ] **Step 2: Run** `pnpm add -D jsdom && pnpm test:unit -- --run src/lib/contact src/lib/schemas`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Add messages to the zod schema. Field names and rules stay unchanged; the server route is untouched.
  - `validateContact` uses `contactFormSchema.omit({ gRecaptchaResponse: true }).safeParse` and maps each `issue.path[0]` to its first message.
  - The reCAPTCHA client memoizes one promise and clears it if the script fails to load. It always injects the script on the first call, even if `window.grecaptcha` already exists, which the e2e stub relies on. It resolves through `window.grecaptcha.ready`.
  - In `app.d.ts`, replace `typeof grecaptcha` with `grecaptcha?: { ready(cb: () => void): void; execute(siteKey: string, opts: { action: string }): Promise<string> }`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Write the failing e2e tests** in `e2e/contact.test.ts`.
  - **Setup:**
    - `page.addInitScript` defines `window.grecaptcha = { ready: (cb) => cb(), execute: async () => 'test-token' }`.
    - `page.route('**/recaptcha/api.js*', r => r.fulfill({ contentType: 'text/javascript', body: '' }))`.
  - **Tests:**
    - `empty submit shows field errors and sends nothing`. Click `Send message`. Five field errors are visible, and every input has `aria-invalid="true"` and an `aria-describedby` pointing at its error. Zero requests go to `/api/contact`.
    - `successful submit posts the token and clears the form`. Route `/api/contact` to `{ status: 200, body: JSON.stringify({ success: true, message: 'Message sent successfully' }) }`. The request's form data has `gRecaptchaResponse=test-token`. `role=status` shows `Thanks — your message is on its way.`, and the inputs are empty.
    - `server error keeps the typed values and shows the message` (Review Focus 2). Route to status 400 with `{ success: false, message: 'Recaptcha verification failed' }`. `role=status` contains `Recaptcha verification failed`, and the name input still holds its typed value.
    - `double submit sends one request` (Review Focus 3). Delay the route by 500 ms and double-click `Send message`. The request count is 1, and the button is `disabled` while the request is pending.
    - `copy email shows Copied`. Use the context permissions `clipboard-read` and `clipboard-write`. Clicking `Copy email` shows `Copied`.
    - `recaptcha attribution is visible`. The text includes `protected by reCAPTCHA`, with links to `https://policies.google.com/privacy` and `https://policies.google.com/terms`.
    - `recaptcha script is not requested on initial load`. Track requests matching `recaptcha/api.js` from `page.goto('/')` without scrolling: none are made. After `#contact` scrolls into view, exactly one is made.
- [ ] **Step 6: Run** `pnpm test:e2e e2e/contact.test.ts`. Expected: FAIL.
- [ ] **Step 7: Implement the components.**

  - **`ContactSection`:** a two-column card, `md:grid-cols-2`, that stacks on mobile. On the left, `ContactLinks` with index `05`, `profile.contactHeading` and `profile.contactLine`. On the right, `ContactForm`. On mount, it starts `loadRecaptcha(PUBLIC_RECAPTCHA_SITE_KEY)` through an `IntersectionObserver` with `rootMargin: '600px'`, firing once. The form also starts it on its first `focusin`. Import the key from `$env/static/public`.
  - **`ContactForm`:** a plain `<form novalidate>` with labelled inputs. Name and email share a row on `md:` screens, as do organization and position; message is a textarea. Inputs are styled `rounded-xl border border-input bg-background px-4 h-11 focus-visible:outline-2 focus-visible:outline-primary`. The submit is a coral pill button with the text `Send message`.
  - **Submit order:**

    1. `validateContact`
    2. set `pending = true`
    3. `getRecaptchaToken`
    4. build `FormData` from the form and append `gRecaptchaResponse`
    5. `fetch('/api/contact', { method: 'POST', body })`
    6. read the result as a `ContactPostResponse`
    7. on success, reset the form; on failure, keep the values and set the error status to the response's message
    8. set `pending = false` in `finally`

    A network exception shows `Something went wrong sending your message. Please email me instead.` Status text lives in `<p role="status" aria-live="polite">`.

  - **Attribution:** below the button, `This site is protected by reCAPTCHA and the Google <a>Privacy Policy</a> and <a>Terms of Service</a> apply.`

- [ ] **Step 8: Run** `pnpm test:unit -- --run && pnpm test:e2e && pnpm check`. Expected: PASS.
- [ ] **Step 9: Commit.** `git add -A && git commit -m "feat: contact section with lazy recaptcha and inline status"`

---

### Task 10: Draft the four case studies from the project repos

**Files:**

- Modify: `src/lib/data/case-studies.ts`, `src/lib/data/data.spec.ts`

**Sources (read only, nothing copied verbatim from internal docs):**

| Case study  | Read from                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| Harbor      | `~/Repos/emmabyte/harbor/README.md` and `docs/` (especially `docs/technical/`)                                       |
| Emmabyte    | `~/Repos/emmabyte/emmabyte-io/README.md` and its `src/routes` layout (`(public)`, `(client-portal)`, `admin`, `api`) |
| Tarot Tutor | `~/Repos/personal/tarot-tutor/docs/` and `CLAUDE.md`                                                                 |
| Pulse       | `~/Repos/emmabyte/pulse/README.md`, `CONTRIBUTING.md` and `docs/`                                                    |

**Interfaces:**

- Consumes: the `CaseStudy` type (Task 2) and the page (Task 4). No interface changes.

- [ ] **Step 1: Write the failing content tests** in `data.spec.ts`:
  - `every case study is drafted`. Except for `review`, no string in any study matches `/TODO\(emma\)/`.
  - `every case study has the full shape`. Each study has at least 2 `problem` entries, at least 1 `role` entry, at least 3 architecture columns, at least 2 `decisions` (each with at least 1 `rejected`), at least 2 `testing` entries and at least 1 `outcome` entry.
  - `only harbor has compliance, and it has at least 4 controls`
  - `case studies contain no hostnames, emails or internal paths`. No study string matches `/\b[\w-]+\.(internal|local|lan)\b|@[\w-]+\.\w+|\b(localhost|127\.0\.0\.1)\b|\/Users\//`.
  - `case studies keep the review gate`. Each study's `review` is still a `todo()` value. Emma removes it after reading the study.
- [ ] **Step 2: Run** `pnpm test:unit -- --run src/lib/data`. Expected: FAIL.
- [ ] **Step 3: Draft the content** from the sources, following the spec's case-study rules.
  - Write facts at the product and architecture level only.
  - Harbor: describe the domain without naming clients, and use no data examples.
  - Decisions must be ones the docs actually record, with the alternatives they actually list. If a doc doesn't record a rejected alternative, pick a different decision; don't invent one.
  - `outcome` states status and milestones only. Metrics stay with Emma (featured `impact` is already a `todo()`).
  - Never mention AI, Claude or agents (the Task 2 test enforces this).
  - Never say "HIPAA certified".
- [ ] **Step 4: Run** `pnpm test:unit -- --run && pnpm test:e2e e2e/case-study.test.ts`. Expected: PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "content: draft four case studies for emma's review"`

---

### Task 11: Final verification

**Files:**

- Create: `e2e/responsive.test.ts`
- Modify: anything the checks below expose.

- [ ] **Step 1: Write the e2e test** `no horizontal overflow at 360px` (Review Focus 4). At a viewport of `{ width: 360, height: 800 }`, for `/`, `/work/harbor`, `/work/emmabyte`, `/work/tarot-tutor` and `/work/pulse`, `document.documentElement.scrollWidth` must be ≤ 360. The pipeline and diagram scroll inside their own wrappers, so they don't count.
- [ ] **Step 2: Run** `pnpm test:e2e e2e/responsive.test.ts`. Expected: PASS. If it fails, fix the overflowing element.
- [ ] **Step 3: Full suite.** Run `pnpm lint && pnpm check && pnpm test:unit -- --run && pnpm test:e2e && pnpm build`. Expected: all pass.
- [ ] **Step 4: Guard proof.** Run `REQUIRE_CONTENT=1 pnpm build`. Expected: FAIL, listing exactly the launch-checklist items still pending: the launch gates, role and impact ×4, the Emmabyte title, availability, the contact line, and case-study review ×4.
- [ ] **Step 5: Anti-goal sweep.** Run `rg -n -i "violet|fuchsia|pixelify|font-family:.*inter|alex rivera|lisbon|three\b|grecaptcha.*head" src static e2e`. Expected: no matches. Run `rg -n "HIPAA certified" src`. Expected: no matches.
- [ ] **Step 6: Lighthouse.** With `pnpm preview` running, run `pnpm dlx lighthouse http://localhost:4173 --form-factor=mobile --only-categories=performance,accessibility --quiet --chrome-flags="--headless"`. Expected: both scores ≥ 90. Fix regressions; likely causes are the dot-field canvas size and font preloading.
- [ ] **Step 7: Commit.** `git add -A && git commit -m "test: responsive overflow check and final verification fixes"`
