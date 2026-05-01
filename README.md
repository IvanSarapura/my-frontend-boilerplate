# my-frontend-boilerplate

<p align="center">
  A production-ready Next.js boilerplate with strict type safety, automated testing, and hardened CI/CD.
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
</p>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Git Conventions](#git-conventions)
  - [Commit Format](#commit-format)
  - [Allowed Types](#allowed-types)
  - [Scopes](#scopes)
  - [Examples](#examples)
  - [Tips to Avoid Failures](#tips-to-avoid-failures)
- [CI / CD](#ci--cd)
  - [Pipeline](#pipeline)
  - [Artifact Strategy](#artifact-strategy)
  - [Concurrency](#concurrency)
- [Dependency Management](#dependency-management)
  - [Dependabot Configuration](#dependabot-configuration)
  - [Peer Dependency Protection](#peer-dependency-protection)
  - [Dependency Review (PR Security Gate)](#dependency-review-pr-security-gate)
- [Branching Strategy](#branching-strategy)
- [Internationalisation](#internationalisation)
- [Environment Variables](#environment-variables)
- [Important Notes](#important-notes)

---

## Overview

This boilerplate provides a **minimal yet professional** foundation for modern React applications. It ships with a complete developer experience out of the box: strict TypeScript, automated testing at multiple levels, enforced code quality via Git hooks, and a hardened GitHub Actions pipeline that catches issues before they reach `main`.

Key principles:

- **Zero-config DX**: Clone, install, and start coding.
- **Fail fast**: CI catches type errors, lint violations, test failures, and security issues on every PR.
- **Dependency hygiene**: Automated updates without noise, strict peer-dependency enforcement, and vulnerability scanning.

---

## Tech Stack

| Category   | Tool                                                 | Version | Purpose                         |
| ---------- | ---------------------------------------------------- | ------- | ------------------------------- |
| Framework  | [Next.js](https://nextjs.org/)                       | 16      | React framework (App Router)    |
| UI         | [React](https://react.dev/)                          | 19      | UI library                      |
| Language   | [TypeScript](https://www.typescriptlang.org/)        | 5       | Strict type safety              |
| Compiler   | React Compiler                                       | 1.0.0   | Automatic memoization           |
| Validation | [Zod](https://zod.dev/)                              | 4       | Runtime env validation          |
| Formatting | [Prettier](https://prettier.io/)                     | 3       | Code formatting                 |
| Linting    | [ESLint](https://eslint.org/)                        | 9       | Flat config linting             |
| Unit Tests | [Vitest](https://vitest.dev/)                        | 4       | Unit / component testing        |
| Test Utils | [Testing Library](https://testing-library.com/)      | 16      | DOM testing utilities           |
| E2E Tests  | [Playwright](https://playwright.dev/)                | 1       | End-to-end testing              |
| Git Hooks  | [Husky](https://typicode.github.io/husky/)           | 9       | Pre-commit hooks                |
| Staging    | [lint-staged](https://github.com/okonet/lint-staged) | 16      | Pre-commit quality checks       |
| Commits    | [commitlint](https://commitlint.js.org/)             | 19      | Conventional commit enforcement |
| CSS        | [stylelint](https://stylelint.io/)                   | 17      | CSS linting (standard config)   |

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

---

## Available Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start development server (Turbopack) |
| `npm run build`         | Build for production                 |
| `npm start`             | Start production server              |
| `npm run lint`          | Run ESLint across the project        |
| `npm run typecheck`     | TypeScript type check (no emit)      |
| `npm run format`        | Format all files with Prettier       |
| `npm run format:check`  | Check formatting without writing     |
| `npm test`              | Run unit / component tests once      |
| `npm run test:watch`    | Run tests in watch mode              |
| `npm run test:coverage` | Run tests with v8 coverage report    |
| `npm run test:e2e`      | Run Playwright E2E tests             |
| `npm run test:e2e:ui`   | Open Playwright UI mode              |
| `npm run stylelint`     | Lint CSS files                       |
| `npm run stylelint:fix` | Auto-fix stylelint violations        |

---

## Project Structure

```
my-frontend-boilerplate/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                   # Main CI pipeline
│   │   └── dependency-review.yml    # PR dependency security scan
│   └── dependabot.yml               # Automated dependency updates
├── e2e/
│   ├── home.spec.ts                 # Locale routing + heading assertions
│   └── smoke.spec.ts                # Health endpoint + 404 + skip-link
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── dictionaries.ts      # Server-only message loader
│   │   │   ├── layout.tsx           # Locale validation + generateStaticParams
│   │   │   ├── page.tsx             # Home page (translated)
│   │   │   ├── error.tsx            # Error boundary (Client Component)
│   │   │   ├── not-found.tsx        # 404 page
│   │   │   ├── loading.tsx          # Loading spinner
│   │   │   └── posts/
│   │   │       └── page.tsx         # Posts via JSONPlaceholder API
│   │   ├── api/health/
│   │   │   └── route.ts             # Health check → GET /api/health
│   │   ├── layout.tsx               # Root layout — JSON-LD, OG metadata, fonts
│   │   ├── globals.css              # @layer reset/base/utilities + design tokens
│   │   ├── error.tsx                # Global fallback error boundary
│   │   ├── not-found.tsx            # Global 404
│   │   ├── manifest.ts              # Web app manifest
│   │   ├── robots.ts                # robots.txt
│   │   ├── sitemap.ts               # sitemap.xml
│   │   └── opengraph-image.tsx      # Auto-generated OG image
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx           # Button component (variants × sizes)
│   │   └── layouts/
│   │       └── container.tsx        # Responsive max-width container
│   ├── hooks/
│   │   ├── use-media-query.ts       # Reactive media query hook
│   │   └── use-toggle.ts            # Boolean toggle with explicit setter
│   ├── i18n/
│   │   ├── config.ts                # Locale types, defaultLocale, getMessages()
│   │   ├── messages/en.json
│   │   └── messages/es.json
│   ├── lib/
│   │   ├── env.ts                   # Zod env schema — fails on invalid config
│   │   ├── utils.ts                 # cx() for conditional CSS classes
│   │   └── json-ld.ts               # Structured data helper
│   ├── proxy.ts                     # Locale routing — redirects / → /en
│   └── types/
│       └── index.ts                 # Shared TypeScript utility types
├── .env.local.example
├── .npmrc                           # npm configuration (strict peers, engine strict)
├── next.config.ts
├── package.json
└── README.md
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

Scopes are optional but highly recommended to identify the affected area:

| Scope        | Area                                       |
| ------------ | ------------------------------------------ |
| `app`        | Next.js App Router code                    |
| `components` | UI or layout components                    |
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
quality ──┐
           ├──▶ build ──▶ e2e
test    ──┘
```

| Job         | Description                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| **quality** | format check → lint → typecheck → security audit → commitlint validation (PR only)                           |
| **test**    | full unit/component suite with v8 coverage report; coverage artifact uploaded (7-day retention)              |
| **build**   | production build; bundle-size summary posted to job summary; build artifact packaged as tarball and uploaded |
| **e2e**     | Playwright Chromium tests against the built artifact; Playwright report uploaded (7-day retention)           |

### Artifact Strategy

- Jobs that upload or download artifacts (`test`, `build`, `e2e`) are granted `actions: write` permissions so that `actions/upload-artifact@v4` and `actions/download-artifact@v4` can communicate with the GitHub Actions API.
- Build and report artifacts are retained for **7 days** to allow re-running E2E jobs or inspecting failures without rebuilding.
- `.next/cache` is cached between runs using `actions/cache@v4`, keyed on `package-lock.json` plus source files.

### Concurrency

Concurrent runs on the same branch are cancelled automatically (`cancel-in-progress: true`) to avoid wasting runner minutes.

---

## Dependency Management

### Dependabot Configuration

Dependabot is configured to keep dependencies up to date without creating noise.

| Ecosystem                      | Frequency | Grouping                          | Max open PRs |
| ------------------------------ | --------- | --------------------------------- | ------------ |
| **npm** (package.json)         | Monthly   | All dependencies in a single PR   | 1            |
| **GitHub Actions** (workflows) | Monthly   | All action updates in a single PR | 1            |

You receive **at most 2 PRs per month** from Dependabot, each with a clean `chore(deps)` prefix. If you prefer manual control, delete `.github/dependabot.yml` and run `npm audit` periodically.

> **Note:** Dependabot branches are deleted automatically when their PR is closed or merged. If old branches remain, remove them manually from the repo settings.

### Peer Dependency Protection

`.npmrc` enforces `strict-peer-deps=true`. This hardens npm so that any peer dependency conflict (for example, a plugin that does not yet support a new major version of its host package) fails the install immediately instead of silently producing a broken dependency tree.

> **Why this matters:** Without `strict-peer-deps`, npm 7+ attempts to auto-resolve peer conflicts. This can result in a lockfile that installs successfully but contains incompatible versions that break at runtime. The strict flag forces the issue to surface during `npm ci`, protecting both CI and local development.

### Dependency Review (PR Security Gate)

Every Pull Request triggers a `dependency-review` job that scans added or updated dependencies for:

- **Known vulnerabilities** (GitHub Advisory Database)
- **Invalid or unexpected open-source licenses**
- **Low OpenSSF Scorecard scores** (supply-chain health)

If the PR introduces a vulnerable package, the check fails and a summary comment is posted to the PR. This prevents broken or insecure dependency updates from ever reaching `main`, complementing the `ignore` rules in `dependabot.yml`.

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

### Why no `develop` branch?

In modern CI/CD, a long-lived `develop` branch creates more problems than it solves:

- **Delayed integration**: Changes sit in `develop` for days or weeks, increasing merge risk.
- **Double maintenance**: You must keep CI green on two branches instead of one.
- **Decision fatigue**: Contributors constantly ask "do I target `develop` or `main`?"
- **Obsolete model**: Vincent Driessen, creator of Git Flow (2010), no longer recommends it for most teams.

Instead, **Pull Requests to `main` act as your quality gate**. The CI pipeline runs the full suite before anything can merge. If you need a staging environment, use deploy previews (Vercel, Netlify, Cloudflare Pages) or a dedicated `staging` branch — not `develop`.

### Protected Branches

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
