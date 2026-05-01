# my-frontend-boilerplate

<p align="center">
  A production-ready Next.js boilerplate with strict type safety, automated testing, hardened CI/CD, and an enterprise-grade design system.
</p>

<p align="center">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5">
  </a>
  <a href="https://vitest.dev/">
    <img src="https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white" alt="Vitest 4">
  </a>
  <a href="https://playwright.dev/">
    <img src="https://img.shields.io/badge/Playwright-1-2EAD33?logo=playwright&logoColor=white" alt="Playwright 1">
  </a>
  <a href="https://storybook.js.org/">
    <img src="https://img.shields.io/badge/Storybook-10-FF4785?logo=storybook&logoColor=white" alt="Storybook 10">
  </a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [What's Included](#whats-included)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Domain-Driven Features](#domain-driven-features)
  - [Custom Design System](#custom-design-system)
  - [Type-Safe API Client](#type-safe-api-client)
- [Data Fetching & State Management](#data-fetching--state-management)
  - [Server Components](#server-components)
  - [TanStack Query](#tanstack-query)
  - [Server Actions + React Hook Form](#server-actions--react-hook-form)
- [Testing Strategy](#testing-strategy)
  - [Unit & Component Tests](#unit--component-tests)
  - [API Mocking with MSW](#api-mocking-with-msw)
  - [End-to-End Tests](#end-to-end-tests)
- [Storybook — Visual Documentation](#storybook--visual-documentation)
- [Optional Integrations](#optional-integrations)
  - [TanStack Query Devtools](#tanstack-query-devtools)
- [Git Conventions](#git-conventions)
  - [Commit Format](#commit-format)
  - [Allowed Types](#allowed-types)
  - [Scopes](#scopes)
  - [Examples](#examples)
- [CI / CD](#ci--cd)
  - [Pipeline](#pipeline)
  - [Artifact Strategy](#artifact-strategy)
- [Dependency Management](#dependency-management)
- [Branching Strategy](#branching-strategy)
- [Internationalisation](#internationalisation)
- [Environment Variables](#environment-variables)
- [Important Notes](#important-notes)

---

## Overview

This boilerplate provides a **minimal yet professional** foundation for modern React applications. It ships with a complete developer experience out of the box: strict TypeScript, automated testing at multiple levels, an extensible custom design system, enforced code quality via Git hooks, and a hardened GitHub Actions pipeline that catches issues before they reach `main`.

Key principles:

- **Zero-config DX**: Clone, install, and start coding.
- **Fail fast**: CI catches type errors, lint violations, test failures, and security issues on every PR.
- **Dependency hygiene**: Automated updates without noise, strict peer-dependency enforcement, and vulnerability scanning.
- **Custom UI without lock-in**: Every component is built with CSS Modules and design tokens — no Tailwind, no external UI library dependencies.

---

## What's Included

| Feature                        | Description                                                   |
| ------------------------------ | ------------------------------------------------------------- |
| **Next.js 16 App Router**      | Server Components by default, React 19, Turbopack             |
| **Domain-Driven Architecture** | `src/features/` keeps business logic organized and scalable   |
| **Custom Design System**       | 9 primitive UI components built from scratch with CSS Modules |
| **Type-Safe API Client**       | Generic `fetch` wrapper with optional Zod runtime validation  |
| **Server Actions**             | Modern form mutations with validation end-to-end              |
| **React Hook Form**            | Performant form handling integrated with Zod                  |
| **TanStack Query**             | Client-side server state with prefetching and caching         |
| **i18n (en/es)**               | Locale-prefixed routes with dictionary loading                |
| **MSW**                        | Deterministic tests by mocking network requests               |
| **Storybook**                  | Living styleguide for every UI primitive                      |
| **Complete SEO**               | JSON-LD, Open Graph, sitemap, robots, manifest                |
| **Security Headers**           | CSP, HSTS, X-Frame-Options, Permissions-Policy                |
| **3-Level Testing**            | Unit (Vitest), Component (Testing Library), E2E (Playwright)  |

---

## Tech Stack

| Category      | Tool                                                 | Version | Purpose                         |
| ------------- | ---------------------------------------------------- | ------- | ------------------------------- |
| Framework     | [Next.js](https://nextjs.org/)                       | 16      | React framework (App Router)    |
| UI            | [React](https://react.dev/)                          | 19      | UI library                      |
| Language      | [TypeScript](https://www.typescriptlang.org/)        | 5       | Strict type safety              |
| Compiler      | React Compiler                                       | 1.0.0   | Automatic memoization           |
| Validation    | [Zod](https://zod.dev/)                              | 4       | Runtime env / schema validation |
| Forms         | [React Hook Form](https://react-hook-form.com/)      | 7       | Performant form handling        |
| Data Fetching | [TanStack Query](https://tanstack.com/query)         | 5       | Client-side server state        |
| Formatting    | [Prettier](https://prettier.io/)                     | 3       | Code formatting                 |
| Linting       | [ESLint](https://eslint.org/)                        | 9       | Flat config linting             |
| Unit Tests    | [Vitest](https://vitest.dev/)                        | 4       | Unit / component testing        |
| Test Utils    | [Testing Library](https://testing-library.com/)      | 16      | DOM testing utilities           |
| E2E Tests     | [Playwright](https://playwright.dev/)                | 1       | End-to-end testing              |
| API Mocking   | [MSW](https://mswjs.io/)                             | 2       | Network request mocking         |
| Docs          | [Storybook](https://storybook.js.org/)               | 10      | UI component documentation      |
| Git Hooks     | [Husky](https://typicode.github.io/husky/)           | 9       | Pre-commit hooks                |
| Staging       | [lint-staged](https://github.com/okonet/lint-staged) | 16      | Pre-commit quality checks       |
| Commits       | [commitlint](https://commitlint.js.org/)             | 19      | Conventional commit enforcement |
| CSS           | [stylelint](https://stylelint.io/)                   | 17      | CSS linting (standard config)   |

---

## Getting Started

### Prerequisites

- **Node.js** `>=22.0.0`
- **npm** `>=10.0.0` (enforced by `engine-strict` in `.npmrc`)

We recommend using [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use   # reads .nvmrc
```

### Installation

```bash
# 1. Clone
git clone https://github.com/IvanSarapura/my-frontend-boilerplate.git
cd my-frontend-boilerplate

# 2. Environment variables
cp .env.local.example .env.local

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To explore the UI components in isolation, run Storybook:

```bash
npm run storybook   # Opens at http://localhost:6006
```

---

## Available Scripts

| Script                    | Description                           |
| ------------------------- | ------------------------------------- |
| `npm run dev`             | Start development server (Turbopack)  |
| `npm run build`           | Build for production                  |
| `npm start`               | Start production server               |
| `npm run lint`            | Run ESLint across the project         |
| `npm run typecheck`       | TypeScript type check (no emit)       |
| `npm run format`          | Format all files with Prettier        |
| `npm run format:check`    | Check formatting without writing      |
| `npm test`                | Run unit / component tests once       |
| `npm run test:watch`      | Run tests in watch mode               |
| `npm run test:coverage`   | Run tests with v8 coverage report     |
| `npm run test:e2e`        | Run Playwright E2E tests              |
| `npm run test:e2e:ui`     | Open Playwright UI mode               |
| `npm run stylelint`       | Lint CSS files                        |
| `npm run stylelint:fix`   | Auto-fix stylelint violations         |
| `npm run storybook`       | Start Storybook dev server on `:6006` |
| `npm run storybook:build` | Build Storybook for static deploy     |

---

## Project Structure

```
my-frontend-boilerplate/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                   # Main CI pipeline
│   │   └── dependency-review.yml    # PR dependency security scan
│   └── dependabot.yml               # Automated dependency updates
├── .storybook/                      # Storybook configuration
│   ├── main.ts
│   └── preview.ts
├── e2e/
│   ├── home.spec.ts                 # Locale routing + heading assertions
│   └── smoke.spec.ts                # Health endpoint + 404 + skip-link
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── contact/
│   │   │   │   └── page.tsx         # Contact page (Server Actions + RHF)
│   │   │   ├── posts/
│   │   │   │   ├── mock/
│   │   │   │   │   └── page.tsx     # Mock posts page
│   │   │   │   └── page.tsx         # Posts via JSONPlaceholder API
│   │   │   ├── dictionaries.ts      # Server-only message loader
│   │   │   ├── layout.tsx           # Locale validation + generateStaticParams
│   │   │   ├── page.tsx             # Home page (translated)
│   │   │   ├── error.tsx            # Error boundary (Client Component)
│   │   │   ├── not-found.tsx        # 404 page
│   │   │   └── loading.tsx          # Loading spinner
│   │   ├── api/health/
│   │   │   └── route.ts             # Health check → GET /api/health
│   │   ├── layout.tsx               # Root layout — JSON-LD, OG, providers
│   │   ├── globals.css              # @layer reset/base/utilities + design tokens
│   │   ├── error.tsx                # Global fallback error boundary
│   │   ├── not-found.tsx            # Global 404
│   │   ├── manifest.ts              # Web app manifest
│   │   ├── robots.ts                # robots.txt
│   │   ├── sitemap.ts               # sitemap.xml
│   │   └── opengraph-image.tsx      # Auto-generated OG image
│   ├── components/
│   │   ├── providers/
│   │   │   └── query-provider.tsx   # TanStack Query provider
│   │   ├── ui/                      # Primitive UI components (100% custom CSS Modules)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── select.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast-context.tsx
│   │   │   └── toaster.tsx
│   │   └── layouts/
│   │       └── container.tsx        # Responsive max-width container
│   ├── features/                    # Domain-driven features (autocontained)
│   │   ├── contact/
│   │   │   ├── actions.ts           # Server Action (submitContactAction)
│   │   │   ├── schemas.ts           # Zod validation schema
│   │   │   ├── components/
│   │   │   │   └── contact-form.tsx
│   │   │   └── index.ts             # Public barrel exports
│   │   └── posts/
│   │       ├── api/
│   │       │   ├── posts.service.ts
│   │       │   └── comments.service.ts
│   │       ├── components/
│   │       │   ├── post-card.tsx
│   │       │   ├── post-list.tsx
│   │       │   └── post-comments.tsx
│   │       ├── types.ts
│   │       └── index.ts             # Public barrel exports
│   ├── hooks/
│   │   ├── use-media-query.ts
│   │   └── use-toggle.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── messages/en.json
│   │   └── messages/es.json
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts            # Generic type-safe fetch client
│   │   ├── env.ts
│   │   ├── utils.ts
│   │   └── json-ld.ts
│   ├── mocks/
│   │   ├── handlers.ts              # MSW request handlers
│   │   └── node.ts                  # MSW server setup for Vitest
│   ├── proxy.ts                     # Locale routing — redirects / → /en
│   └── types/
│       └── index.ts
├── .env.local.example
├── .npmrc
├── next.config.ts
├── package.json
├── vitest.config.ts
├── vitest.setup.ts
└── README.md
```

---

## Architecture

This boilerplate follows a **domain-driven folder structure** that scales from small apps to large teams.

### Domain-Driven Features

Business logic is organized inside `src/features/<name>/`. Each feature is **autocontained** and exposes a public API via `index.ts` (barrel exports).

```
features/
└── posts/
    ├── api/          # Data fetching (services + Server Actions)
    ├── components/   # Feature-specific UI
    ├── types.ts      # Shared types
    └── index.ts      # Public API
```

**Rule of thumb:** If a component or function is only used by one feature, it lives inside that feature. If it's reused across features, it moves to `components/ui/` or `lib/`.

### Custom Design System

Every primitive in `components/ui/` is built from scratch with **CSS Modules** and **design tokens** from `globals.css`. No Tailwind, no external UI libraries, zero runtime CSS-in-JS overhead.

| Component  | Purpose                              |
| ---------- | ------------------------------------ |
| `Button`   | Variants (primary, secondary, ghost) |
| `Input`    | Text input with label, error, helper |
| `Textarea` | Multi-line input                     |
| `Select`   | Custom accessible dropdown           |
| `Card`     | Container with variants              |
| `Badge`    | Status indicators                    |
| `Modal`    | Focus-trapped dialog (portal)        |
| `Toast`    | Notification system (context + hook) |
| `Spinner`  | Loading indicator                    |

### Type-Safe API Client

A thin wrapper around `fetch` with optional **Zod schema validation** guarantees that what you receive matches what you expect:

```ts
import { apiClient } from '@/lib/api/client';
import { z } from 'zod';

const userSchema = z.object({ id: z.number(), name: z.string() });
const user = await apiClient('/api/user', { schema: userSchema });
// user is typed AND validated at runtime
```

---

## Data Fetching & State Management

### Server Components

The default in Next.js 16. Use `async` Server Components + `fetch` for data needed at page load. The `posts` feature demonstrates this with `cacheLife('minutes')` for ISR-like caching.

### TanStack Query

Use TanStack Query for interactive, client-driven data such as filters, pagination, or real-time updates. The `PostComments` component demonstrates this: a `<Select>` chooses a post, and `useQuery` fetches comments on the client with automatic caching and deduplication.

### Server Actions + React Hook Form

The `contact` feature demonstrates the modern mutation pattern:

1. **Zod schema** validates the form shape (`features/contact/schemas.ts`).
2. **Server Action** receives `FormData`, validates it again on the server, and returns a typed state object (`features/contact/actions.ts`).
3. **React Hook Form** handles client-side UX with `useActionState` for server feedback (`features/contact/components/contact-form.tsx`).

> **Why validate twice?** The client validates for instant UX feedback. The server validates because you can never trust the client.

---

## Testing Strategy

### Unit & Component Tests

Components and hooks are tested in isolation with Vitest and Testing Library. Coverage thresholds are enforced at **70%**.

### API Mocking with MSW

[MSW](https://mswjs.io/) intercepts network requests during tests so the suite is **deterministic** and does not depend on external APIs being online.

```ts
// src/mocks/handlers.ts
http.get('https://api.example.com/posts', () => {
  return HttpResponse.json([{ id: 1, title: 'Mock Post' }]);
});
```

MSW starts automatically in `vitest.setup.ts` before all tests.

### End-to-End Tests

Playwright runs full browser tests against a production build to validate routing, i18n, accessibility, and API health.

---

## Storybook — Visual Documentation

Storybook provides a **living styleguide** where every UI primitive can be viewed, interacted with, and tested in isolation, outside of the full application.

```bash
npm run storybook        # Dev server at http://localhost:6006
npm run storybook:build  # Static build for deployment
```

- **Co-located stories:** `button.tsx` → `button.stories.tsx`
- **Accessible by default:** `@storybook/addon-a11y` audits WCAG violations
- **Design tokens:** Storybook imports `globals.css` so components render with the exact same tokens as the app

### Why `:6006`?

Storybook runs its own Vite-based dev server on port `6006`. This is completely separate from your Next.js app (`:3000`). You can have both running simultaneously: `:3000` for the app, `:6006` for the component playground.

---

## Optional Integrations

### TanStack Query Devtools

Not included by default to keep the bundle minimal. Add them in one step when you need to inspect cache, mutations, or query states during development:

```bash
npm install @tanstack/react-query-devtools
```

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## Git Conventions

This project enforces **[Conventional Commits](https://www.conventionalcommits.org/)** via a `commit-msg` hook (Husky + commitlint).

### Commit Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types

| Type       | Purpose                                                                |
| ---------- | ---------------------------------------------------------------------- |
| `feat`     | A new feature or capability                                            |
| `fix`      | A bug fix                                                              |
| `docs`     | Documentation-only changes                                             |
| `style`    | Code style changes that do not affect meaning (formatting, semicolons) |
| `refactor` | Code change that neither fixes a bug nor adds a feature                |
| `perf`     | Performance improvement                                                |
| `test`     | Adding or correcting tests                                             |
| `chore`    | Routine tasks, dependency updates, config tweaks                       |
| `ci`       | Changes to CI/CD configuration                                         |
| `build`    | Changes affecting the build system or external dependencies            |
| `revert`   | Reverts a previous commit                                              |

### Scopes

| Scope        | Area                                       |
| ------------ | ------------------------------------------ |
| `app`        | Next.js App Router code                    |
| `components` | UI or layout components                    |
| `features`   | Domain-driven features                     |
| `hooks`      | Custom React hooks                         |
| `i18n`       | Internationalisation logic or translations |
| `lib`        | Utilities, env validation, helpers         |
| `styles`     | Global CSS, tokens, design system          |
| `test`       | Test suites or testing configuration       |
| `ci`         | GitHub Actions workflows                   |
| `deps`       | Dependency updates                         |

### Examples

```bash
# Feature with scope
feat(i18n): add Spanish locale support

# Bug fix with scope and body
fix(app): resolve layout shift on mobile navigation

The root layout was missing a min-height declaration, causing
content to jump when the navigation bar mounted.

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

### Tips to Avoid Failures

1. **Always use a type** — a commit like `update stuff` will be rejected by the hook.
2. **Use imperative mood** — "fix bug" instead of "fixed bug" or "fixes bug".
3. **Keep the description concise** — aim for 50–72 characters in the first line.
4. **Reference issues when applicable** — `Fixes #123` or `Closes #456` in the footer.
5. **If the hook rejects your commit**, amend the message and try again:
   ```bash
   git commit --amend
   ```

---

## CI / CD

GitHub Actions runs on **push and pull requests to `main`**.

### Pipeline

```
quality ──┬──▶ storybook
          ├──▶ build ──▶ e2e
test    ──┘
```

| Job           | Description                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| **quality**   | format check → lint → typecheck → security audit → commitlint validation (PR only)                           |
| **test**      | full unit/component suite with v8 coverage report; coverage artifact uploaded (7-day retention)              |
| **storybook** | static Storybook build to catch configuration or story errors                                                |
| **build**     | production build; bundle-size summary posted to job summary; build artifact packaged as tarball and uploaded |
| **e2e**       | Playwright Chromium tests against the built artifact; Playwright report uploaded (7-day retention)           |

### Artifact Strategy

- Jobs that upload or download artifacts are granted `actions: write` permissions.
- Build and report artifacts are retained for **7 days**.
- `.next/cache` is cached between runs using `actions/cache@v4`.

### Concurrency

Concurrent runs on the same branch are cancelled automatically (`cancel-in-progress: true`) to avoid wasting runner minutes.

---

## Dependency Management

### Dependabot Configuration

| Ecosystem                      | Frequency | Grouping                          | Max open PRs |
| ------------------------------ | --------- | --------------------------------- | ------------ |
| **npm** (package.json)         | Monthly   | All dependencies in a single PR   | 1            |
| **GitHub Actions** (workflows) | Monthly   | All action updates in a single PR | 1            |

You receive **at most 2 PRs per month** from Dependabot.

### Peer Dependency Protection

`.npmrc` enforces `strict-peer-deps=true`. This hardens npm so that any peer dependency conflict fails the install immediately instead of silently producing a broken dependency tree.

### Dependency Review (PR Security Gate)

Every Pull Request triggers a `dependency-review` job that scans added or updated dependencies for known vulnerabilities, invalid licenses, and low OpenSSF Scorecard scores.

---

## Branching Strategy

This repository follows **GitHub Flow** (not Git Flow). There is no `develop` branch.

```
feature/my-change  ──▶  Pull Request  ──▶  main
                             │
                             ▼
                  CI runs: format, lint,
                  typecheck, test, build, e2e
```

- **`main`** requires CI to pass before merging.
- Force-pushes to `main` are disabled.

---

## Internationalisation

Routes are locale-prefixed: `/en/...` (English, default) and `/es/...` (Spanish).  
Visiting `/` redirects to `/en` automatically via `src/proxy.ts`.

### Adding a New Locale

1. Add it to `locales` in `src/i18n/config.ts`
2. Create `src/i18n/messages/<locale>.json`
3. Add a loader entry in `src/app/[locale]/dictionaries.ts`

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Variables are validated at startup with Zod (`src/lib/env.ts`). Missing or malformed values throw at build time.

---

## Important Notes

### `src/proxy.ts`

Next.js 16 renamed the legacy `middleware.ts` convention to `proxy.ts`. **Do not rename this file to `middleware`** — it will not be recognised by the framework.

### `npm ci` failures with peer dependencies

If you see `ERESOLVE` errors during `npm ci`, check `.github/dependabot.yml` for any `ignore` rules that document known ecosystem incompatibilities. Never use `--legacy-peer-deps` or `--force` as a workaround; the correct fix is to wait for the upstream plugin to support the newer version, or to pin the dependency range in `package.json`.
