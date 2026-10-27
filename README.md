# Emma Long — portfolio

Personal portfolio at https://emma-long.vercel.app. A SvelteKit 2 / Svelte 5 (runes) site styled with Tailwind CSS v4, deployed to Vercel with `@sveltejs/adapter-vercel`. The contact form posts to `/api/contact`, which verifies reCAPTCHA v3 and sends mail through MailerSend.

## Commands

```sh
pnpm dev                # dev server
pnpm build              # production build
pnpm test:unit --run    # Vitest (no "--" separator, or Vitest stays in watch mode)
pnpm test:e2e           # Playwright; builds and previews the site on :4173
```

`pnpm lint` runs Prettier and ESLint, and `pnpm check` runs svelte-check.

## Environment variables

| Variable                    | Used for                           |
| --------------------------- | ---------------------------------- |
| `MAILERSEND_API_KEY`        | Sending contact-form mail          |
| `RECAPTCHA_SECRET_KEY`      | Server-side reCAPTCHA verification |
| `PUBLIC_RECAPTCHA_SITE_KEY` | Loading reCAPTCHA in the browser   |

All three are needed at build time, so set them locally (for example in `.env`) before running `pnpm build`. On Vercel, `PUBLIC_RECAPTCHA_SITE_KEY` must exist for both Production and Preview.

## Launch content guard

Copy Emma hasn't supplied yet is written as `todo('note')` in `src/lib/data`. Production builds on Vercel fail while any `todo()` remains; Preview and Development builds do not.

To see what is pending locally:

```sh
REQUIRE_CONTENT=1 pnpm build
```

The error lists each marker as `file:line note`.

## Social image

`static/og.png` is generated, not drawn by hand. To regenerate it:

```sh
node scripts/generate-og-image.mjs
```

## Design spec

The design spec, which is the authority for content and behaviour, is in `docs/superpowers/specs/2026-10-25-portfolio-revamp-design.md`.
