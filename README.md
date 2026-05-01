# my-frontend-boilerplate

A professional, minimal Next.js frontend boilerplate with a complete DX and CI/CD setup ready to clone and build on.

## Stack

| Tool            | Version | Purpose                           |
| --------------- | ------- | --------------------------------- |
| Next.js         | 16      | React framework (App Router)      |
| React           | 19      | UI library                        |
| TypeScript      | 5       | Type safety (strict + enterprise) |
| React Compiler  | 1.0.0   | Automatic memoization             |
| Zod             | 4       | Runtime env validation            |
| Prettier        | 3       | Code formatting                   |
| ESLint          | 9       | Linting (flat config)             |
| Vitest          | 4       | Unit / component testing          |
| Testing Library | 16      | DOM testing utilities             |
| Playwright      | 1       | E2E testing                       |
| Husky           | 9       | Git hooks                         |
| lint-staged     | 16      | Pre-commit quality checks         |
| commitlint      | 19      | Conventional commit enforcement   |
| stylelint       | 17      | CSS linting (standard config)     |

## Getting Started

### Prerequisites

- Node.js `>=22.0.0` — use [nvm](https://github.com/nvm-sh/nvm): `nvm use`

### Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                  | Description                      |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start development server         |
| `npm run build`         | Build for production             |
| `npm start`             | Start production server          |
| `npm run lint`          | Run ESLint                       |
| `npm run typecheck`     | TypeScript type check (no emit)  |
| `npm run format`        | Format all files with Prettier   |
| `npm run format:check`  | Check formatting without writing |
| `npm test`              | Run unit/component tests once    |
| `npm run test:watch`    | Run tests in watch mode          |
| `npm run test:coverage` | Run tests with coverage report   |
| `npm run test:e2e`      | Run Playwright E2E tests         |
| `npm run test:e2e:ui`   | Open Playwright UI mode          |
| `npm run stylelint`     | Lint CSS files with stylelint    |
| `npm run stylelint:fix` | Auto-fix stylelint violations    |

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Variables are validated at startup with Zod (`src/lib/env.ts`). Missing or malformed values throw at build time.

## Git Conventions

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/). The `commit-msg` hook enforces this automatically.

```
feat: add user authentication
fix: resolve layout shift on mobile
docs: update README setup section
chore: upgrade vitest to v4
```

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

## Internationalisation

Routes are locale-prefixed: `/en/...` (English, default) and `/es/...` (Spanish).  
Visiting `/` redirects to `/en` automatically via `src/proxy.ts`.

To add a new locale:

1. Add it to `locales` in `src/i18n/config.ts`
2. Create `src/i18n/messages/<locale>.json`
3. Add a loader entry in `src/app/[locale]/dictionaries.ts`

## Project Structure

```
src/
  app/
    [locale]/
      dictionaries.ts        # server-only message loader (per locale)
      layout.tsx             # locale validation + generateStaticParams
      page.tsx               # Home page (translated)
      error.tsx              # Error boundary (Client Component)
      not-found.tsx          # 404 page
      loading.tsx            # Loading spinner
      posts/
        page.tsx             # Posts via JSONPlaceholder API (use cache)
    api/health/route.ts      # Health check → GET /api/health
    layout.tsx               # Root layout — JSON-LD, OG metadata, fonts
    globals.css              # @layer reset/base/utilities + CSS design tokens
    error.tsx                # Global fallback error boundary
    not-found.tsx            # Global 404
    manifest.ts              # Web app manifest
    robots.ts                # robots.txt
    sitemap.ts               # sitemap.xml
    opengraph-image.tsx      # Auto-generated OG image (ImageResponse)
  components/
    ui/
      button.tsx             # Button (primary / secondary / ghost × sm / md / lg)
    layouts/
      container.tsx          # Responsive max-width container
  hooks/
    use-media-query.ts       # Reactive media query hook
    use-toggle.ts            # Boolean toggle with explicit setter
  i18n/
    config.ts                # Locale types, defaultLocale, getMessages()
    messages/en.json
    messages/es.json
  lib/
    env.ts                   # Zod env schema — throws on invalid config at startup
    utils.ts                 # cx() for conditional CSS classes
    json-ld.ts               # generateWebsiteJsonLd() structured data helper
  proxy.ts                   # Locale routing — redirects / → /en
  types/
    index.ts                 # Shared TypeScript utility types
e2e/
  home.spec.ts               # Locale routing + heading assertions
  smoke.spec.ts              # Health endpoint + 404 + skip-link
```

## CI/CD

GitHub Actions runs on push/PR to `main` and `develop`.

```
quality ──┐
           ├──▶ build ──▶ e2e
test    ──┘
```

- **quality** — format check → lint → stylelint → typecheck → security audit → commitlint (PR only)
- **test** — full unit suite with v8 coverage (artifact uploaded, 7-day retention)
- **build** — production build; bundle-size summary posted to job summary; build artifact uploaded
- **e2e** — Playwright Chromium tests against the built artifact; report uploaded (7-day retention)

`.next/cache` is cached between runs using `actions/cache@v4` keyed on `package-lock.json` + source files.

Concurrent runs on the same branch are cancelled automatically.
