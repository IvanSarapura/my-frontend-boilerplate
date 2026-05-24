# Contributing to my-frontend-boilerplate

<p align="center">
  Thank you for considering contributing to this project!
</p>

<p align="center">
  <a href="./README.md">
    <img src="https://img.shields.io/badge/README-Read%20Here-blue?logo=github" alt="README">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green" alt="License MIT">
  </a>
</p>

---

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
  - [Branching Model](#branching-model)
  - [Making Changes](#making-changes)
  - [Adding a New Feature](#adding-a-new-feature)
  - [Barrel Exports](#barrel-exports)
  - [Environment Variables](#environment-variables)
  - [Images and Static Assets](#images-and-static-assets)
  - [Pre-commit Checks](#pre-commit-checks)
- [Commit Message Guidelines](#commit-message-guidelines)
  - [Format](#format)
  - [Types](#types)
  - [Scopes](#scopes)
  - [Examples](#examples)
  - [Common Mistakes to Avoid](#common-mistakes-to-avoid)
- [Running Quality Checks Locally](#running-quality-checks-locally)
  - [Code Quality](#code-quality)
  - [Testing](#testing)
  - [Debugging E2E Tests](#debugging-e2e-tests)
  - [Build Verification](#build-verification)
- [Pull Request Process](#pull-request-process)
  - [Before Submitting](#before-submitting)
  - [PR Requirements](#pr-requirements)
  - [Review Process](#review-process)
- [Reporting Issues](#reporting-issues)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `>=22.0.0`
- **npm** `>=10.0.0`
- **Git** `>=2.40.0`

We use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions. The project includes a `.nvmrc` file for automatic version switching.

### Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/my-frontend-boilerplate.git
cd my-frontend-boilerplate

# 2. Switch to the correct Node version
nvm use

# 3. Install dependencies
#    This also sets up Husky pre-commit hooks automatically
npm install

# 4. Copy environment variables
cp .env.local.example .env.local

# 5. Verify everything works
npm run typecheck
npm test
npm run build
```

---

## Development Workflow

### Branching Model

This project follows **GitHub Flow**:

```
main (protected)
  ↑
feature/your-feature-name
```

- Create a new branch from `main` for every change.
- Use descriptive branch names:
  - `feat/add-dark-mode`
  - `fix/memory-leak-in-modal`
  - `docs/update-api-examples`
  - `deps/upgrade-nextjs`

### Making Changes

1. **Create a focused branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes.** Keep commits atomic and focused on a single concern.

3. **Write or update tests** for any new functionality.

4. **Update documentation** (README, JSDoc comments, etc.) if your change affects the public API or usage.

### Adding a New Feature

Features live in `src/features/<feature-name>/` and follow a consistent structure:

```
src/features/<name>/
├── api/               # Server-side data fetching & Server Actions
│   └── <name>.service.ts
├── components/        # Feature-specific UI
│   └── <name>-form.tsx
├── schemas.ts         # Zod validation schemas
├── types.ts           # Shared TypeScript types
└── index.ts           # Public barrel exports
```

**Rules:**

- A feature must export its public API via `index.ts`.
- Components inside a feature can import from `components/ui/` but not from other features.
- If logic is needed by multiple features, move it to `lib/` or `components/ui/`.
- If your feature fetches data at the page level, use async Server Components with the `use cache` directive instead of `useEffect` or client-side fetching.

### Barrel Exports

Each feature and shared module exposes its public API through an `index.ts` (a "barrel"). Treat this file as a deliberate contract — what you export becomes the surface that other modules depend on; what you keep internal can be refactored, renamed, or removed without breaking consumers.

**What to export**

- Components consumed outside the module (cross-feature, app routes, providers).
- Hooks reusable beyond a single component.
- Public types used in props, return values, or arguments of exported APIs.
- Service entry points (`getPosts`, `getPostById`, Server Actions, etc.).

**What to keep internal (do not export)**

- Component-local helpers — `get-initials.ts` is used only by `Avatar`; `get-pagination-range.ts` is used only by `Pagination`. They live next to their consumer and are never imported from outside.
- Sub-components a compound parent already re-exports through itself.
- CSS modules — always imported relatively from the consuming file.
- Zod schemas when the inferred type (`z.infer<>`) is what callers need (keep the schema private, export the type).
- Test fixtures and `*.test.*` files.
- Internal infrastructure used only by services (`apiClient` lives in `src/lib/api/`; features call it through their own typed services, not through the barrel).

**Example — `src/components/ui/index.ts`:**

```ts
export { Pagination } from './pagination'; // ✅ consumed by app routes
// export { getPaginationRange } from './pagination/get-pagination-range';
//                                          // ❌ internal helper — keep private
```

**Anti-patterns to avoid**

- **Re-exporting third-party libs** (`export * from '@floating-ui/react'`) — leaks the dependency into your module's public API and prevents future swaps. The `@floating-ui/react` exception documented in `ANALYSIS-STATUS.md §10.6` is enforced precisely because Tooltip and Dropdown encapsulate it.
- **Barrel-of-barrels** (`export * from './subdir'`) — opaque, hostile to tree-shaking, easy to accidentally widen the public surface during refactors.
- **Circular re-exports between sibling barrels** — fragile, confusing for tooling, and a common source of obscure module-resolution errors.

**Rule of thumb**: before adding a new export to a barrel, grep `src/` for at least one consumer outside the owning module. If there is none, keep it internal until there is. Adding to a barrel is cheap; removing from a barrel is a breaking change for anyone who imported it.

### Environment Variables

The project splits environment variable access into two modules along the client/server boundary. Use the one that matches where your code runs — never `process.env.<NAME>` directly, because that bypasses validation and may leak secrets into the client bundle.

| Module                  | Use for                               | Safe to import from                                                |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| `src/lib/env.ts`        | Variables prefixed `NEXT_PUBLIC_*`    | Any code (client + server)                                         |
| `src/lib/env.server.ts` | Secrets without `NEXT_PUBLIC_` prefix | Server code only (RSC, Route Handlers, Server Actions, `proxy.ts`) |

`env.server.ts` starts with `import 'server-only'`, which makes Next.js fail the build if any Client Component (or anything transitively imported by one) reaches the module. That guarantee replaces ad-hoc discipline with a compile-time check.

**Adding a new public variable:**

```ts
// src/lib/env.ts
const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('My App'),
  NEXT_PUBLIC_API_URL: z.string().url(), // ← new
});
```

Then add `NEXT_PUBLIC_API_URL=https://...` to `.env.example` and `.env.local`.

**Adding a new server-only secret:**

```ts
// src/lib/env.server.ts
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(), // ← new
});
```

Then add a placeholder to `.env.example` (so other developers know it exists) and the real value to `.env.local` (which is gitignored).

**Why a default is sometimes acceptable for `NEXT_PUBLIC_*` but never for secrets:**

- Public variables have safe defaults that let `npm run dev` succeed from a fresh clone (zero-config DX).
- Secrets have no safe default — if the server is missing `DATABASE_URL`, it should refuse to start with a clear error rather than silently fall back to something broken.

### Images and Static Assets

**Always use `next/image`** for any raster image (PNG, JPG, WebP, AVIF). Do not use `<img>` for content imagery. `next/image` provides automatic format negotiation (serves AVIF/WebP when supported), lazy loading by default, responsive `srcset` generation, and layout-shift prevention via the required `width`/`height` or `fill` props.

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  priority // only for above-the-fold / LCP images
/>;
```

**Required props on every `<Image>`:**

- `alt` — descriptive, never empty (use `alt=""` only for truly decorative images).
- `width` + `height`, OR `fill` (the parent must have `position: relative`).
- `priority` **only** on the LCP image of a page (typically a hero). Never on multiple images per route — multiple priority hints defeat the purpose.
- `sizes` when using `fill` or responsive layouts, to avoid serving 2x assets to mobile.

**Where to put the file:**

- Static assets bundled with the app live in `public/` and are referenced as `/file.png`.
- For icons, prefer the central `Icon` registry in `src/components/ui/icon/` over inline SVG or PNG sprites. The registry handles ARIA, sizing, and currentColor inheritance for you.

**External images** (CMS, CDN, S3): add the host to `images.remotePatterns` in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }],
  },
};
```

Without this entry, `next/image` throws at runtime when it sees a foreign hostname. This is intentional — it forces explicit allowlisting and prevents abuse of the optimization endpoint.

> **Enforced by lint:** the project extends `eslint-config-next/core-web-vitals`, which activates `@next/next/no-img-element`. Any raw `<img>` element fails lint and is blocked by the pre-commit hook. The only accepted exception is inline `<svg>…</svg>` markup (which is not an `<img>` element).

### Pre-commit Checks

This project uses **Husky** and **lint-staged** to enforce quality before every commit. These hooks run automatically — you do not need to configure anything.

| Hook           | What it does                             | Files affected   |
| -------------- | ---------------------------------------- | ---------------- |
| **Pre-commit** | Runs `lint-staged`                       | All staged files |
| **Commit-msg** | Validates commit format via `commitlint` | Commit message   |

**What lint-staged runs:**

- **ESLint** (`--fix --cache`) on `*.{ts,tsx,mts}`
- **Stylelint** (`--fix --cache`) on `*.css`
- **Prettier** (`--write`) on `*.{ts,tsx,mts,css,json,md}`

Caches (`.eslintcache`, `.stylelintcache`) are gitignored. The first commit after cloning builds them; subsequent commits are significantly faster.

> **Emergency bypass (not recommended):** `git commit --no-verify`. You will still need to fix issues before the CI pipeline allows the PR to merge.

---

## Commit Message Guidelines

We enforce [Conventional Commits](https://www.conventionalcommits.org/). This standard enables automatic changelog generation and a clear, queryable history.

### Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to use                                                            |
| ---------- | ---------------------------------------------------------------------- |
| `feat`     | A new feature or capability                                            |
| `fix`      | A bug fix                                                              |
| `docs`     | Documentation-only changes (README, JSDoc, inline comments)            |
| `style`    | Code style changes that do not affect meaning (formatting, semicolons) |
| `refactor` | Code change that neither fixes a bug nor adds a feature                |
| `perf`     | Performance improvement                                                |
| `test`     | Adding, updating, or correcting tests                                  |
| `chore`    | Routine tasks, dependency updates, configuration tweaks                |
| `ci`       | Changes to CI/CD configuration (GitHub Actions, workflows)             |
| `build`    | Changes affecting the build system or external dependencies            |
| `revert`   | Reverts a previous commit                                              |

### Scopes

Scopes help identify the affected area. Choose the most specific scope possible:

| Scope        | Area                                                          |
| ------------ | ------------------------------------------------------------- |
| `app`        | Next.js App Router code (`src/app/`)                          |
| `components` | React components (`src/components/`)                          |
| `features`   | Domain-driven features (`src/features/`)                      |
| `hooks`      | Custom React hooks (`src/hooks/`)                             |
| `i18n`       | Internationalisation logic or translations (`src/i18n/`)      |
| `lib`        | Utilities, env validation, helpers (`src/lib/`)               |
| `styles`     | Global CSS, tokens, design system (`src/**/*.css`)            |
| `test`       | Test suites or testing configuration (`e2e/`, `**/*.test.ts`) |
| `ci`         | GitHub Actions workflows (`.github/workflows/`)               |
| `deps`       | Dependency updates (`package.json`, `package-lock.json`)      |

### Examples

```bash
# Feature with scope
feat(i18n): add Spanish locale support

# Bug fix with detailed body
fix(app): resolve hydration mismatch in locale routing

The locale detection logic in proxy.ts was running before the
React tree hydrated, causing a mismatch warning. Moved detection
to a Client Component wrapper to align server and client output.

Closes #123

# Simple documentation update
docs: update installation steps for Windows users

# Performance improvement with measured impact
perf(components): memoise heavy SVG icons

Reduced re-render count in the navigation bar from 12 to 2
on route changes by wrapping SVG components in React.memo.

# Dependency update
chore(deps): upgrade vitest to v4.1.5

# CI configuration fix
fix(ci): correct artifact retention days in build job
```

### Common Mistakes to Avoid

1. **Missing type** — `update stuff` will be rejected.
2. **Wrong verb tense** — Use imperative mood: "fix bug", not "fixed bug" or "fixes bug".
3. **Description too long** — Keep the first line under 72 characters.
4. **Missing blank line** between title and body — commitlint rejects `type: desc\nBody here`.
5. **Forgotten scope** — While optional, scopes make `git log` and changelogs much more useful.
6. **References in title** — Put `Fixes #123` in the footer, not the title line.

---

## Running Quality Checks Locally

Before pushing, run the full quality suite locally. This saves CI time and catches issues early.

### Code Quality

```bash
# Verify formatting (does not write)
npm run format:check

# Auto-fix formatting
npm run format

# Run ESLint
npm run lint

# TypeScript type check (no emit)
npm run typecheck

# CSS linting
npm run stylelint
```

### Testing

```bash
# Run unit and component tests
npm test

# Run with coverage report (enforces per-file thresholds)
npm run test:coverage

# Run in watch mode (useful during development)
npm run test:watch

# Run E2E tests against a production build
npm run build       # Terminal 1: build once
npm start           # Terminal 1: serve the build
npm run test:e2e    # Terminal 2: run Playwright

# Open Playwright UI mode for debugging
npm run test:e2e:ui

# Build Storybook to verify stories compile
npm run storybook:build

# Run every story as a test in a real browser, enforcing accessibility.
# Slower (Chromium + axe), so it is NOT part of `npm test` or the pre-push hook.
npm run test:storybook
```

> **Coverage thresholds:** Every file must individually reach 70% coverage for statements, branches, functions, and lines. If you add a new file, add matching tests. You cannot rely on other files to compensate.

> **Accessibility gate:** `npm run test:storybook` runs each story through axe with `a11y.test: 'error'` (`.storybook/preview.ts`). It runs in CI (the **Storybook a11y Tests** job), not in the pre-push hook, so a story with accessibility violations fails the PR even though it can be pushed locally. Run it yourself before opening a PR when you add or change stories. Intentional, justified violations (e.g. decorative filled badges) use a per-story `parameters.a11y.config.rules` override with a comment.

### Debugging E2E Tests

Playwright tests fail differently from unit tests — the failure often depends on timing, navigation, or DOM state at a specific moment. The Playwright tooling gives you four levels of escalation; reach for whichever matches your situation.

**1. UI mode (preferred for iterative debugging)**

```bash
npm run test:e2e:ui
```

Opens the Playwright test runner UI with a time-travel debugger: every action records a DOM snapshot you can scrub through, plus a built-in locator picker for testing selectors against the running page. Watch mode reruns on save. This is the default tool — start here.

**2. Headed + slow-mo (when you want to watch the browser)**

```bash
npx playwright test --headed --project=chromium --workers=1 \
  e2e/contact.spec.ts -g "happy path"
```

Useful when UI mode is too much friction (e.g., running a single test or filtering by title). `--workers=1` keeps execution serial so the browser windows don't fight for focus.

**3. Trace viewer (for CI-only failures)**

`playwright.config.ts` enables `trace: 'on-first-retry'`. When a test fails in CI, the `e2e` GitHub Actions job uploads `playwright-report/` as an artifact. To inspect it:

1. Open the failed CI run on GitHub → scroll to the bottom of the `e2e` job → download the `playwright-report` artifact.
2. Unzip and run:

   ```bash
   npx playwright show-trace playwright-report/data/<trace-id>.zip
   ```

   The viewer shows network, console, source, and a video timeline. Almost every CI flake reveals its cause within seconds here.

**4. Interactive inspector (`page.pause()`)**

Drop `await page.pause();` anywhere inside a test and run with `--headed`. Playwright opens its inspector at that line — you can step through subsequent actions one at a time, evaluate locators against the live page, and resume.

```ts
test('something', async ({ page }) => {
  await page.goto('/en');
  await page.pause(); // ← inspector opens here, browser stays live
  await page.click('text=Submit');
});
```

Remove the `page.pause()` before committing. ESLint does not flag it, but it would block the test in CI indefinitely.

> **Common debugging mistakes:**
>
> - **Don't add `await page.waitForTimeout(<ms>)` as a quick fix.** Replace it with a `await expect(locator).toBeVisible()` or similar auto-waiting assertion. Hard-coded timeouts are the #1 source of flake.
> - **If a locator is ambiguous, narrow it with role/name** (`getByRole('button', { name: 'Submit' })`) rather than CSS classes. Class names are brittle; ARIA names are stable contracts.

### Build Verification

```bash
# Production build (catches Next.js build-time errors)
npm run build

# Analyse bundle output
ls -la .next/
```

---

## Pull Request Process

### Before Submitting

- [ ] Branch is up to date with `main` (`git pull origin main`)
- [ ] All local quality checks pass:
  ```bash
  npm run format:check && npm run lint && npm run typecheck && npm test && npm run build && npm run storybook:build
  ```
- [ ] Commit messages follow Conventional Commits
- [ ] Changes are focused and atomic (one concern per PR)
- [ ] Tests added or updated for new functionality
- [ ] Documentation updated if public API or usage changed

### PR Requirements

This repository includes a **PR template** (`.github/pull_request_template.md`) that is auto-populated when you open a pull request on GitHub. Fill in all sections:

- **Summary** — what changed and why
- **Changes** — a bullet list of the specific modifications
- **Test Plan** — which checks you ran locally

Additionally:

1. **Keep PRs small and focused.** A PR that touches 50 files and adds 3 unrelated features is hard to review. Split large changes into multiple PRs.

2. **All CI jobs must pass.** The pipeline runs:
   - Format / Lint / Typecheck / Security audit
   - Unit tests and per-file coverage thresholds
   - Storybook build
   - Production build
   - Playwright E2E tests
   - Dependency security review
   - Commit message validation (PR only)

3. **Add screenshots or screen recordings** for any visible UI changes.

### Review Process

- A maintainer will review your PR as soon as possible.
- Address review feedback with additional commits on the same branch.
- Once approved and CI is green, a maintainer will merge.
- **Do not force-push** after review has started — it makes diff tracking harder.

---

## Reporting Issues

Found a bug or have a suggestion? We'd love to hear it.

1. **Check existing issues** to avoid duplicates.
2. **Open a new issue** with:
   - A clear, descriptive title
   - Steps to reproduce (for bugs)
   - Expected vs. actual behaviour (for bugs)
   - Your environment (Node version, OS, browser if relevant)
   - Screenshots or code snippets if applicable

For security vulnerabilities, please email the maintainer directly instead of opening a public issue.

---

## Code of Conduct

This project adheres to a standard of respectful, constructive collaboration:

- Be respectful and inclusive in all interactions.
- Welcome newcomers and help them learn.
- Accept constructive criticism gracefully.
- Focus on what is best for the project and its users.

Harassment, trolling, or discriminatory behaviour of any kind will not be tolerated.

---

<p align="center">
  <strong>Questions?</strong> Check the <a href="./README.md">README</a> or open an <a href="https://github.com/IvanSarapura/my-frontend-boilerplate/issues">issue</a>.
</p>
