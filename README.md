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
  - [Tri-State Theming](#tri-state-theming)
  - [Type-Safe API Client](#type-safe-api-client)
- [Data Fetching & State Management](#data-fetching--state-management)
  - [Server Components & use cache](#server-components--use-cache)
  - [TanStack Query](#tanstack-query)
  - [Server Actions + React Hook Form](#server-actions--react-hook-form)
- [Testing Strategy](#testing-strategy)
  - [Unit & Component Tests](#unit--component-tests)
  - [API Mocking with MSW](#api-mocking-with-msw)
  - [End-to-End Tests](#end-to-end-tests)
- [Storybook — Visual Documentation](#storybook--visual-documentation)
- [Optional Integrations](#optional-integrations)
  - [TanStack Query Devtools](#tanstack-query-devtools)
  - [Error Tracking (Sentry / Rollbar / Bugsnag / …)](#error-tracking-sentry--rollbar--bugsnag--)
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
  - [Branch Protection](#branch-protection)
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

| Feature                           | Description                                                        |
| --------------------------------- | ------------------------------------------------------------------ |
| **Next.js 16 App Router**         | Server Components by default, React 19, React Compiler             |
| **Domain-Driven Architecture**    | `src/features/` keeps business logic organized and scalable        |
| **Custom Design System**          | 23 primitive UI components built from scratch with CSS Modules     |
| **Tri-State Theming**             | Light / dark / system with SSR-safe `ThemeProvider` + anti-FOUC    |
| **Vendor-Agnostic Observability** | `reportError` hook wired into error boundaries; bring your own SDK |
| **Type-Safe API Client**          | Generic `fetch` wrapper with optional Zod runtime validation       |
| **Server Actions**                | Modern form mutations with validation end-to-end                   |
| **React Hook Form**               | Performant form handling integrated with Zod                       |
| **TanStack Query**                | Client-side server state with prefetching and caching              |
| **i18n (en/es)**                  | Locale-prefixed routes with `Accept-Language` detection            |
| **MSW**                           | Deterministic tests by mocking network requests                    |
| **Storybook**                     | Living styleguide with a11y audits and Chromatic integration       |
| **Complete SEO**                  | JSON-LD, Open Graph, sitemap, robots, manifest                     |
| **Security Headers**              | CSP, HSTS, X-Frame-Options, Permissions-Policy                     |
| **3-Level Testing**               | Unit (Vitest), Component (Testing Library), E2E (Playwright)       |

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
| `npm run dev`             | Start development server              |
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
│   ├── dependabot.yml               # Automated dependency updates
│   └── pull_request_template.md     # PR description template
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
│   │   │   ├── query-provider.tsx   # TanStack Query provider
│   │   │   ├── theme-provider.tsx   # Tri-state theming (useSyncExternalStore + anti-FOUC)
│   │   │   └── toast-provider.tsx   # Toast context + useToast hook
│   │   ├── ui/                      # Primitive UI components — folder-per-component
│   │   │   ├── accordion/           #   compound: Accordion + Item + Trigger + Content
│   │   │   ├── alert/               #   info / success / warning / error + dismissible
│   │   │   ├── avatar/              #   image + initials fallback + status indicator
│   │   │   ├── badge/               #   badge.tsx · badge.module.css · index.ts
│   │   │   ├── button/              #   button.tsx · button.test.tsx · button.stories.tsx · …
│   │   │   ├── card/
│   │   │   ├── checkbox/
│   │   │   ├── dropdown/            #   @floating-ui compound: Trigger + Content + Item + Separator
│   │   │   ├── icon/                #   centralized SVG icon registry (chevrons, status, sun/moon/monitor, …)
│   │   │   ├── input/
│   │   │   ├── modal/
│   │   │   ├── pagination/          #   accessible nav with ellipsis collapsing
│   │   │   ├── radio/               #   Radio + RadioGroup (context-driven)
│   │   │   ├── select/
│   │   │   ├── skeleton/
│   │   │   ├── spinner/
│   │   │   ├── tabs/                #   compound + roving tabindex + manual activation
│   │   │   ├── textarea/
│   │   │   ├── theme-toggle/        #   cycles light → dark → system with dynamic ARIA
│   │   │   ├── toaster/
│   │   │   ├── toggle-switch/
│   │   │   └── tooltip/             #   @floating-ui hover/focus + viewport-aware positioning
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
│   │   ├── use-modal-behavior.ts    # Focus, keyboard, backdrop behavior for Modal
│   │   ├── use-theme.ts             # Re-export of useTheme from theme-provider
│   │   └── use-toggle.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── dictionaries.ts          # Server-only message loader
│   │   ├── messages/en.json
│   │   └── messages/es.json
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts            # Generic type-safe fetch client
│   │   ├── env.ts
│   │   ├── json-ld.ts
│   │   ├── observability.ts         # Vendor-agnostic reportError hook (no-op in prod)
│   │   └── utils.ts
│   ├── mocks/
│   │   ├── handlers.ts              # MSW request handlers
│   │   └── node.ts                  # MSW server setup for Vitest
│   ├── proxy.ts                     # Locale routing — detects Accept-Language, redirects to /[locale]
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

Each component lives in its own subdirectory (`button/button.tsx`, `button/button.test.tsx`, `button/button.stories.tsx`, `button/button.module.css`, `button/index.ts`). Adding a new component never pollutes the parent directory. Context providers (`QueryProvider`, `ToastProvider`) live in `components/providers/` — separate from the stateless visual primitives in `components/ui/`. Complex interactive behavior is extracted into `src/hooks/` as dedicated hooks (e.g. `useModalBehavior`), keeping components responsible for rendering only.

| Component      | Purpose                                                          |
| -------------- | ---------------------------------------------------------------- |
| `Accordion`    | Compound: `Accordion` + `Item` + `Trigger` + `Content`           |
| `Alert`        | Info / success / warning / error with dismissible variant        |
| `Avatar`       | Image with automatic initials fallback + status indicator        |
| `Badge`        | Status indicators                                                |
| `Button`       | Variants (primary, secondary, ghost, icon) — 3 sizes             |
| `Card`         | Container with variants                                          |
| `Checkbox`     | Form field with label / error / helper                           |
| `Dropdown`     | Compound menu powered by `@floating-ui/react`                    |
| `Icon`         | Centralised SVG registry (chevrons, status, sun/moon/monitor, …) |
| `Input`        | Text input with label, error, helper                             |
| `Modal`        | Focus-trapped dialog (portal)                                    |
| `Pagination`   | Accessible nav with MUI-style ellipsis collapsing                |
| `Radio`        | `Radio` + `RadioGroup` with context (controlled / uncontrolled)  |
| `Select`       | Custom accessible dropdown with keyboard navigation              |
| `Skeleton`     | Shimmer placeholder, respects `prefers-reduced-motion`           |
| `Spinner`      | Loading indicator                                                |
| `Tabs`         | Compound + roving tabindex + manual activation                   |
| `Textarea`     | Multi-line input following the `Input` pattern                   |
| `ThemeToggle`  | Cycles light → dark → system with dynamic ARIA label             |
| `Toast`        | Notification system (context + hook)                             |
| `ToggleSwitch` | On/off toggle (rounded and rectangular variants)                 |
| `Tooltip`      | Hover/focus tooltip powered by `@floating-ui/react`              |

> **`@floating-ui/react`** is the single approved exception to the zero-UI-dependency policy. It powers only `Tooltip` and `Dropdown`. See `.agents/ANALYSIS-STATUS.md` §10 for the full rationale.

### Tri-State Theming

A first-class theming layer with three explicit choices: `light`, `dark`, and `system` (follow the OS preference). The architecture is intentionally SSR-safe and free of common anti-patterns.

**Pieces:**

| File                                          | Responsibility                                                       |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `src/components/providers/theme-provider.tsx` | `ThemeProvider` (uses `useSyncExternalStore`) + `useTheme` hook      |
| `src/components/ui/theme-toggle/`             | `ThemeToggle` primitive that cycles light → dark → system            |
| `src/hooks/use-theme.ts`                      | Re-export of `useTheme` for ergonomic feature-side imports           |
| `src/app/globals.css`                         | CSS contract with `:root` tokens and `[data-theme="dark"]` overrides |
| `src/app/layout.tsx`                          | Provider mount + inline anti-FOUC script in `<head>`                 |

**Why `useSyncExternalStore` instead of `useState + useEffect`?** The latter pattern produces a render-then-flash on every load because the effect runs _after_ the first paint. `useSyncExternalStore` keeps SSR and CSR consistent: the server snapshot is the neutral `system` baseline, and the client snapshot reads `localStorage` synchronously without an extra render.

**Why a module-scoped memory fallback?** When `localStorage` is unreadable (private mode, strict cookie policies, quota errors), the in-memory variable keeps the chosen theme alive for the current session.

**Why an inline script in `<head>`?** It runs synchronously before the first paint and applies `data-theme` from `localStorage`, eliminating the flash of incorrect theme on reload. The script is kept in sync with the provider via the shared storage key.

```tsx
'use client';
import { useTheme } from '@/hooks/use-theme';

function ThemeIndicator() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  // theme: 'light' | 'dark' | 'system'  — what the user picked
  // resolvedTheme: 'light' | 'dark'     — what the DOM actually shows
  return <ThemeToggle />; // or build your own UI on top of setTheme()
}
```

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

### Server Components & `use cache`

The default in Next.js 16. Use `async` Server Components and `fetch` for data needed at page load. The `posts` feature demonstrates this with the `use cache` directive and `cacheLife('minutes')` for fine-grained ISR-like caching per component:

```ts
// src/app/[locale]/posts/page.tsx
async function fetchPosts() {
  'use cache';
  cacheLife('minutes');
  return apiClient('https://api.example.com/posts');
}
```

This is enabled by `cacheComponents: true` in `next.config.ts`.

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

Components and hooks are tested in isolation with Vitest and Testing Library.

**Coverage policy:**

- **Threshold:** 70% minimum for statements, branches, functions, and lines.
- **Per-file enforcement:** `vitest.config.ts` uses `perFile: true`, meaning every individual file must meet the threshold. A single file with 100% coverage cannot mask another with 0%.
- **Excluded from coverage:** CSS Modules (static, no executable logic), Storybook stories, MSW mocks, and test files themselves are excluded so they do not dilute the metric.

**Test categories:**

- **Rendering:** Every component verifies correct DOM output and accessibility roles.
- **Interaction:** Components with keyboard support (Modal, Select) include tests for `Escape`, `Tab`, `ArrowDown`, `ArrowUp`, and `Enter`.
- **State:** Hooks and context providers verify state transitions and side effects.
- **i18n:** `i18n/config.ts` is tested to ensure locale loading and fallback behaviour.

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
- **Accessible by default:** `@storybook/addon-a11y` audits WCAG violations on every story
- **In-browser Vitest:** `@storybook/addon-vitest` runs the unit test suite inside the Storybook UI
- **Design tokens:** Storybook imports `globals.css` so components render with the exact same tokens as the app
- **Chromatic ready:** `@chromatic-com/storybook` is installed for visual regression testing and UI review

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

### Error Tracking (Sentry / Rollbar / Bugsnag / …)

The boilerplate ships a **vendor-agnostic error reporting hook** instead of bundling an SDK. The choice of vendor belongs to the product, not to the platform — locking it in by default would compromise "Zero-config DX" and impose a bundle cost on every clone.

```ts
// src/lib/observability.ts — already wired into both error.tsx boundaries
export function reportError(error: unknown, context?: ErrorContext): void;
```

In development the call surfaces a structured payload through `console.error('[observability]', …)`. In production it is a deliberate no-op. To adopt a vendor, replace **only the body** of `reportError` — every caller in the app keeps its current signature:

```ts
// After adopting Sentry
import * as Sentry from '@sentry/nextjs';

export function reportError(error: unknown, context: ErrorContext = {}): void {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[observability]', { error, ...context });
    return;
  }
  Sentry.captureException(error, {
    tags: { source: context.source, digest: context.digest },
    extra: context.extra,
  });
}
```

Then:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs   # creates sentry.*.config.ts + instrumentation.ts
```

> **When to add it**, **when not to**, and the full architectural reasoning live in `.agents/ANALYSIS-STATUS.md` §11. **Rule of thumb:** any new surface that may throw at runtime (Error Boundaries, Server Actions, route handlers, jobs) should route errors through `reportError` — never `console.error` directly in production code.

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

GitHub Actions runs on **push and pull requests to `main` and `develop`**.

### Pipeline

```
quality ──┬──▶ storybook
          ├──▶ test ──▶ coverage ──┐
          │                        ▼
          └──▶ ─────────────────▶ build ──▶ e2e
```

| Job           | Description                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **quality**   | format check → lint → typecheck → security audit (prod gate: `--omit=dev`; full-tree audit: all deps) → commitlint validation (PR only) |
| **test**      | unit/component suite (Vitest, no coverage thresholds)                                                                                   |
| **coverage**  | same test suite with v8 coverage report and threshold enforcement; HTML report uploaded as artifact                                     |
| **storybook** | static Storybook build to catch configuration or story errors                                                                           |
| **build**     | production build; bundle-size summary posted to job summary; build artifact packaged as tarball and uploaded                            |
| **e2e**       | Playwright Chromium tests against the built artifact; Playwright report uploaded (7-day retention)                                      |

### Artifact Strategy

- Jobs that upload or download artifacts are granted `actions: write` permissions.
- Build and report artifacts are retained for **7 days**.
- `.next/cache` is cached between runs using `actions/cache@v4`.

### Coverage Artifacts

The `coverage` job generates an HTML report and uploads it as a downloadable artifact. This allows reviewers to inspect per-file coverage without running tests locally. The report is available from the GitHub Actions "Summary" tab for any workflow run.

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

This repository follows **GitHub Flow** (not Git Flow). There is no long-lived `develop` branch for features.

```
feature/my-change  ──▶  Pull Request  ──▶  main
                             │
                             ▼
                  CI runs: format, lint,
                  typecheck, test, build, e2e
```

- **`main`** requires CI to pass before merging.
- Force-pushes to `main` are disabled.

### Branch Protection

For production-grade use, configure GitHub's Classic Branch Protection on `main` to enforce the rules above at the repository level. Without this, the CI pipeline runs but cannot prevent a merge if checks fail.

**Settings → Branches → Add branch protection rule → Branch name pattern: `main`**

| Setting                               | Value                        | Why                                |
| ------------------------------------- | ---------------------------- | ---------------------------------- |
| Require a pull request before merging | ✅ On                        | No direct pushes to `main`         |
| Required approvals                    | 1                            | At least one review before merge   |
| Dismiss stale reviews on new commits  | ✅ On                        | Re-approval required after changes |
| Require status checks to pass         | ✅ On                        | CI must be green before merge      |
| Require branches to be up to date     | ✅ On                        | No merging stale branches          |
| Required status checks                | `quality`, `coverage`, `e2e` | Full pipeline gate (see below)     |
| Require conversation resolution       | ✅ On                        | No unresolved PR comments          |
| Do not allow bypassing settings       | ✅ On                        | Admins also subject to rules       |
| Do not allow force pushes             | ✅ On                        | Protects commit history            |
| Do not allow deletions                | ✅ On                        | Prevents accidental branch removal |

**Why those three status checks?** They are the terminal nodes of the CI DAG:

- `quality` — format, lint, typecheck, security audit
- `coverage` — full test suite with per-file thresholds
- `e2e` — only runs if `build` passed, which only runs if `quality` + `coverage` passed

Requiring `quality`, `coverage`, and `e2e` implicitly gates the entire pipeline without listing all six jobs.

> **First-time setup note:** Status check names only appear in the GitHub search field after the CI workflow has run at least once on a PR branch. Push any change in a PR first to register the check names, then add them to the required list.

---

## Internationalisation

Routes are locale-prefixed: `/en/...` (English, default) and `/es/...` (Spanish).

Visiting `/` triggers `src/proxy.ts`, which reads the `Accept-Language` request header and redirects to the best-matching locale (falling back to `en` when the browser preference is not supported).

### Adding a New Locale

1. Add it to `locales` in `src/i18n/config.ts`
2. Create `src/i18n/messages/<locale>.json`
3. Add a loader entry in `src/i18n/dictionaries.ts`

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

Next.js 16 uses `proxy.ts` (exporting a `proxy` function) instead of the legacy `middleware.ts` convention. **Do not rename this file or its export** — the framework will not recognise it.

The `proxy` function reads the `Accept-Language` header to detect the visitor's preferred locale and redirects `/(path)` to `/[locale]/(path)` before the request reaches any page. API routes, static assets, and metadata files are excluded via the `matcher` config.

### `npm ci` failures with peer dependencies

If you see `ERESOLVE` errors during `npm ci`, check `.github/dependabot.yml` for any `ignore` rules that document known ecosystem incompatibilities. Never use `--legacy-peer-deps` or `--force` as a workaround; the correct fix is to wait for the upstream plugin to support the newer version, or to pin the dependency range in `package.json`.

> **ESLint v9 pin:** `eslint-plugin-import` does not yet support ESLint v10. Dependabot's major-version bump for ESLint is blocked in `.github/dependabot.yml` until upstream compatibility is confirmed. Do not manually upgrade ESLint past v9.

### Coverage policy

- **CSS Modules** (`*.module.css`) are excluded from coverage because they contain no executable JavaScript logic. Including them would artificially lower the metric.
- **Per-file thresholds** are enforced. If you add a new file, it must reach 70% coverage on its own. You cannot rely on other files to compensate.
- **Console output in tests:** If a component intentionally logs to `console.error` (e.g. an error boundary), wrap the render in a `vi.spyOn(console, 'error').mockImplementation(() => {})` to prevent Vitest from treating it as a test runner error.

### Lint-staged performance

ESLint and Stylelint run with `--cache` in the pre-commit hook. The first commit after cloning may take longer as caches are built; subsequent commits are significantly faster. Cache files (`.eslintcache`, `.stylelintcache`) are gitignored and safe to delete at any time.
