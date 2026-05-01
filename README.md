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

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via a `commit-msg` hook (powered by Husky + commitlint). Following this standard keeps the history readable, enables automatic changelog generation, and prevents CI failures.

### Commit message format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed types

| Type       | When to use                                                            |
| ---------- | ---------------------------------------------------------------------- |
| `feat`     | A new feature or capability                                            |
| `fix`      | A bug fix                                                              |
| `docs`     | Documentation-only changes (README, JSDoc, etc.)                       |
| `style`    | Code style changes that do not affect meaning (formatting, semicolons) |
| `refactor` | Code change that neither fixes a bug nor adds a feature                |
| `perf`     | Performance improvement                                                |
| `test`     | Adding or correcting tests                                             |
| `chore`    | Routine tasks, dependency updates, config tweaks                       |
| `ci`       | Changes to CI/CD configuration (GitHub Actions, workflows)             |
| `build`    | Changes affecting the build system or external dependencies            |
| `revert`   | Reverts a previous commit                                              |

### Scopes (recommended)

Scopes are optional but highly recommended to identify the affected area:

- `app` — Next.js App Router code
- `components` — UI or layout components
- `hooks` — Custom React hooks
- `i18n` — Internationalisation logic or translations
- `lib` — Utilities, env validation, helpers
- `styles` — Global CSS, tokens, design system
- `test` — Test suites or testing configuration
- `ci` — GitHub Actions workflows
- `deps` — Dependency updates

### Examples

```bash
# Feature with scope
feat(i18n): add Spanish locale support

# Bug fix with scope and body
fix(app): resolve layout shift on mobile navigation

The root layout was missing a min-height declaration, causing
content to jump when the navigation bar mounted.

# Documentation without scope
docs: update README with commit conventions

# CI fix referencing an issue
fix(ci): grant actions:write permissions to resolve artifact download

Previously, the workflow set permissions: contents: read globally,
which prevented upload/download-artifact from accessing the GitHub
Actions API and caused the E2E job to fail with:
"Artifact not found for name: next-build".

Closes #42

# Dependency update
chore(deps): upgrade vitest to v4.1.5
```

### How to avoid commit failures

1. **Always use a type** — a commit like `update stuff` will be rejected by the hook.
2. **Use imperative mood** — "fix bug" instead of "fixed bug" or "fixes bug".
3. **Keep the description concise** — aim for 50–72 characters in the first line.
4. **Reference issues when applicable** — `Fixes #123` or `Closes #456` in the footer.
5. **If the hook rejects your commit**, amend the message and try again:
   ```bash
   git commit --amend
   ```

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
  proxy.ts                   # Locale routing — redirects / → /en (Next.js 16 Proxy)
  types/
    index.ts                 # Shared TypeScript utility types
e2e/
  home.spec.ts               # Locale routing + heading assertions
  smoke.spec.ts              # Health endpoint + 404 + skip-link
```

> **Note on `src/proxy.ts`:** Next.js 16 renamed the legacy `middleware.ts` convention to `proxy.ts`. Do not rename this file to `middleware` — it will not be recognised by the framework.

## Branching Strategy

This repository follows **GitHub Flow** (not Git Flow). There is no `develop` branch.

```
feature/my-change  ──▶  Pull Request  ──▶  main
                               │
                               ▼
                    CI runs: format, lint,
                    typecheck, test, build, e2e
```

### Why no `develop` branch?

In modern CI/CD, a long-lived `develop` branch creates more problems than it solves:

- **Delayed integration**: Changes sit in `develop` for days or weeks, increasing merge risk.
- **Double maintenance**: You must keep CI green on two branches instead of one.
- **Decision fatigue**: Contributors constantly ask "do I target `develop` or `main`?"
- **Obsolete model**: Vincent Driessen, creator of Git Flow (2010), no longer recommends it for most teams.

Instead, **Pull Requests to `main` act as your quality gate**. The CI pipeline runs the full suite before anything can merge. If you need a staging environment, use deploy previews (Vercel, Netlify, Cloudflare Pages) or a dedicated `staging` branch — not `develop`.

### Protected branches

- **`main`** requires CI to pass before merging.
- Force-pushes to `main` are disabled.

## Dependency Management

Dependabot is configured to keep dependencies up to date without creating noise.

| Ecosystem                      | Frequency | Grouping                          | Max open PRs |
| ------------------------------ | --------- | --------------------------------- | ------------ |
| **npm** (package.json)         | Monthly   | All dependencies in a single PR   | 1            |
| **GitHub Actions** (workflows) | Monthly   | All action updates in a single PR | 1            |

This means you receive **at most 2 PRs per month** from Dependabot, each with a clean `chore(deps)` prefix. If you prefer manual control, delete `.github/dependabot.yml` and run `npm audit` periodically.

> **Note:** Dependabot branches are deleted automatically when their PR is closed or merged. If old branches remain, remove them manually from the repo settings.

## CI/CD

GitHub Actions runs on push and pull requests to `main`.

```
quality ──┐
           ├──▶ build ──▶ e2e
test    ──┘
```

| Job         | What it does                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| **quality** | format check → lint → typecheck → security audit → commitlint validation (PR only)                           |
| **test**    | full unit/component suite with v8 coverage report; coverage artifact uploaded (7-day retention)              |
| **build**   | production build; bundle-size summary posted to job summary; build artifact packaged as tarball and uploaded |
| **e2e**     | Playwright Chromium tests against the built artifact; Playwright report uploaded (7-day retention)           |

### Artifact strategy

- Jobs that upload or download artifacts (`test`, `build`, `e2e`) are granted `actions: write` permissions so that `actions/upload-artifact@v4` and `actions/download-artifact@v4` can communicate with the GitHub Actions API.
- Build and report artifacts are retained for **7 days** to allow re-running E2E jobs or inspecting failures without rebuilding.
- `.next/cache` is cached between runs using `actions/cache@v4`, keyed on `package-lock.json` plus source files.

### Concurrency

Concurrent runs on the same branch are cancelled automatically (`cancel-in-progress: true`) to avoid wasting runner minutes.
