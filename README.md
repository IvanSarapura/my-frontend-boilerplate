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
  - [Typography](#typography)
  - [Responsive / Mobile-First](#responsive--mobile-first)
  - [Page Shell & Wireframes](#page-shell--wireframes)
  - [Keyboard Navigation](#keyboard-navigation)
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
  - [Analytics](#analytics)
  - [Error Tracking (Sentry / Rollbar / Bugsnag / …)](#error-tracking-sentry--rollbar--bugsnag--)
  - [Authentication](#authentication)
  - [Transactional Email](#transactional-email)
  - [Rate Limiting](#rate-limiting)
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

| Feature                           | Description                                                                                                                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 16 App Router**         | Server Components by default, React 19, React Compiler                                                                                                                                      |
| **Domain-Driven Architecture**    | `src/features/` keeps business logic organized and scalable                                                                                                                                 |
| **Custom Design System**          | 22 primitive UI components + 173 tree-shakeable icon components, all CSS Modules                                                                                                            |
| **Tri-State Theming**             | Light / dark / system with SSR-safe `ThemeProvider` + anti-FOUC                                                                                                                             |
| **Vendor-Agnostic Observability** | `reportError` hook wired into error boundaries; bring your own SDK                                                                                                                          |
| **Type-Safe API Client**          | Generic `fetch` wrapper with optional Zod runtime validation                                                                                                                                |
| **Server Actions**                | Modern form mutations with validation end-to-end                                                                                                                                            |
| **React Hook Form**               | Performant form handling integrated with Zod                                                                                                                                                |
| **TanStack Query**                | Client-side server state with prefetching and caching                                                                                                                                       |
| **i18n (en/es)**                  | Locale-prefixed routes, `NEXT_LOCALE` cookie + `Accept-Language` fallback                                                                                                                   |
| **MSW**                           | Deterministic tests by mocking network requests                                                                                                                                             |
| **Storybook**                     | Living styleguide with a11y audits; Chromatic-ready (opt-in, not bundled by default)                                                                                                        |
| **Complete SEO**                  | JSON-LD (WebSite + Organization auto-injected; Article + BreadcrumbList per page, XSS-escaped), per-page canonical + hreflang, multi-locale sitemap, OG, robots                             |
| **Security Headers**              | Nonce-based CSP (`'self'` + per-request nonce, Turbopack-compatible), HSTS, X-Frame-Options, X-Content-Type-Options, X-Permitted-Cross-Domain-Policies, Referrer-Policy, Permissions-Policy |
| **Partial Prerendering**          | Cache Components + per-request nonce isolated via `<Suspense>`                                                                                                                              |
| **3-Level Testing**               | Unit (Vitest), Component (Testing Library), E2E (Playwright)                                                                                                                                |

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

- **Node.js** `>=22.0.0 <23`
- **npm** `>=11 <12` (both ranges enforced by `engine-strict` in `.npmrc`)

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

| Script                    | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `npm run dev`             | Start development server                                 |
| `npm run build`           | Build for production                                     |
| `npm start`               | Start production server                                  |
| `npm run analyze`         | Build with the bundle analyzer (`ANALYZE=true`, webpack) |
| `npm run lint`            | Run ESLint across the project                            |
| `npm run typecheck`       | TypeScript type check (no emit)                          |
| `npm run format`          | Format all files with Prettier                           |
| `npm run format:check`    | Check formatting without writing                         |
| `npm test`                | Run unit / component tests once                          |
| `npm run test:watch`      | Run tests in watch mode                                  |
| `npm run test:coverage`   | Run tests with v8 coverage report                        |
| `npm run test:storybook`  | Run every story as a test in a real browser (a11y)       |
| `npm run test:e2e`        | Run Playwright E2E tests                                 |
| `npm run test:e2e:ui`     | Open Playwright UI mode                                  |
| `npm run stylelint`       | Lint CSS files                                           |
| `npm run stylelint:fix`   | Auto-fix stylelint violations                            |
| `npm run storybook`       | Start Storybook dev server on `:6006`                    |
| `npm run storybook:build` | Build Storybook for static deploy                        |

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
│   ├── preview.ts
│   └── preview-head.html            # Loads Geist into the preview iframe (Storybook is Vite, not SWC)
├── e2e/
│   ├── contact.spec.ts              # Contact form: happy path, validation, i18n
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
│   │   │   ├── layout.tsx           # Root layout — <html lang={locale}>, providers, metadata, generateStaticParams
│   │   │   ├── page.tsx             # Home page (translated)
│   │   │   ├── error.tsx            # Error boundary (Client Component)
│   │   │   ├── not-found.tsx        # 404 page
│   │   │   ├── loading.tsx          # Loading spinner (role="status")
│   │   │   └── opengraph-image.tsx  # Auto-generated OG image (inherits metadataBase)
│   │   ├── api/health/
│   │   │   └── route.ts             # Health check → GET /api/health
│   │   ├── global-error.tsx         # Top-level boundary for errors thrown in the root layout
│   │   ├── globals.css              # @layer reset/base/utilities + design tokens
│   │   ├── manifest.ts              # Web app manifest
│   │   ├── robots.ts                # robots.txt
│   │   └── sitemap.ts               # sitemap.xml
│   ├── components/
│   │   ├── head-scripts/             # Server component: nonced inline scripts (anti-FOUC + JSON-LD), wrapped in <Suspense>
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
│   │   │   ├── icon/                #   173 tree-shakeable icon components (named ESM exports) + IconBase wrapper. Feather-stroke + Material-fill, outline/filled pairs, rotation-derived variants
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
│   │   │   └── client.ts            # Generic type-safe fetch client (timeout + Zod)
│   │   ├── env.ts                   # Public env (NEXT_PUBLIC_*) validated with Zod
│   │   ├── env.server.ts            # Server-only secrets (server-only import guard)
│   │   ├── json-ld.ts
│   │   ├── observability.ts         # Vendor-agnostic reportError hook (no-op in prod)
│   │   ├── query-defaults.ts        # Shared TanStack Query default options
│   │   ├── string.ts                # String helpers
│   │   └── utils.ts
│   ├── mocks/
│   │   ├── handlers.ts              # MSW request handlers
│   │   └── node.ts                  # MSW server setup for Vitest
│   ├── proxy.ts                     # Locale routing — detects Accept-Language, redirects to /[locale]
│   └── types/
│       └── index.ts
├── public/
│   └── placeholder.svg              # Structural anchor — keeps public/ tracked so Storybook staticDirs resolves
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

| Component              | Purpose                                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Accordion`            | Compound: `Accordion` + `Item` + `Trigger` + `Content`                                                                                                                                                                                                                                                              |
| `Alert`                | Info / success / warning / error with dismissible variant                                                                                                                                                                                                                                                           |
| `Avatar`               | Image with automatic initials fallback + status indicator                                                                                                                                                                                                                                                           |
| `Badge`                | Status indicators                                                                                                                                                                                                                                                                                                   |
| `Button`               | Variants (primary, secondary, ghost, icon) — 3 sizes                                                                                                                                                                                                                                                                |
| `Card`                 | Container with variants                                                                                                                                                                                                                                                                                             |
| `Checkbox`             | Form field with label / error / helper                                                                                                                                                                                                                                                                              |
| `Dropdown`             | Compound menu powered by `@floating-ui/react`                                                                                                                                                                                                                                                                       |
| `IconBase` + 173 icons | Named ESM exports — only the icons you import ship to the bundle. `IconBase` is the shared SVG wrapper; per-icon components (`<CloseIcon />`, `<ChevronDownIcon />`, …) live in `icons/*.tsx`. Feather-stroke + Material-fill, outline/filled pairs, rotation-derived variants like `thumb-up` ↻180° = `thumb-down` |
| `Input`                | Text input with label, error, helper                                                                                                                                                                                                                                                                                |
| `Modal`                | Focus-trapped dialog (portal)                                                                                                                                                                                                                                                                                       |
| `Pagination`           | Accessible nav with MUI-style ellipsis collapsing                                                                                                                                                                                                                                                                   |
| `Radio`                | `Radio` + `RadioGroup` with context (controlled / uncontrolled)                                                                                                                                                                                                                                                     |
| `Select`               | Custom accessible dropdown with keyboard navigation                                                                                                                                                                                                                                                                 |
| `Skeleton`             | Shimmer placeholder, respects `prefers-reduced-motion`                                                                                                                                                                                                                                                              |
| `Spinner`              | Loading indicator with optional `decorative` mode (drops its own `role="status"` when nested in a labelled region)                                                                                                                                                                                                  |
| `Tabs`                 | Compound + roving tabindex + manual activation                                                                                                                                                                                                                                                                      |
| `Textarea`             | Multi-line input following the `Input` pattern                                                                                                                                                                                                                                                                      |
| `ThemeToggle`          | Cycles light → dark → system with dynamic ARIA label                                                                                                                                                                                                                                                                |
| `Toast`                | Notification system (context + hook)                                                                                                                                                                                                                                                                                |
| `ToggleSwitch`         | On/off toggle (rounded and rectangular variants)                                                                                                                                                                                                                                                                    |
| `Tooltip`              | Hover/focus tooltip powered by `@floating-ui/react`                                                                                                                                                                                                                                                                 |

> **`@floating-ui/react`** is the single approved exception to the zero-UI-dependency policy. It powers only `Tooltip` and `Dropdown` because anchored positioning — viewport collision, scroll/resize tracking, arrow placement, cross-browser quirks — requires hundreds of lines of math per component to implement correctly. The dependency is ~12 KB gzipped, MIT-licensed, tree-shakeable, and is the same foundation Radix UI, shadcn/ui and Mantine use. It only enters the bundle when your code imports `Tooltip`/`Dropdown`; to defer it on routes where they're not above-the-fold, see the opt-in `next/dynamic` recipe in `.agents/ONBOARDING.md` §5.4.
>
> **Floating-ui animation constraint:** floating-ui positions elements via an inline `transform: translate(x, y)`. CSS `@keyframes` declarations override inline styles for the same property during the animation. Never use `transform: translateY()` in entry/exit animations for floating-ui components — use the independent CSS `translate` property instead (`translate: 0 -4px`), which composes on top of the positioning transform without interfering.

**Available affordances (preserved by design).** As a boilerplate, some tokens and utilities ship unused so you can adopt them while adapting the template — they're options, not dead code:

- **`.focus-ring`** — a global utility in `globals.css` that applies the standard token-driven focus ring (`--color-focus-ring-*`) to any element. The same ring is shared across component modules via `composes: ring from '…/focus.module.css'`, so the focus style has a single source of truth.
- **`--color-disabled-fg`** — a disabled text-color token alongside the widely-used `--color-disabled-bg`. The default disabled pattern dims controls via `opacity: var(--opacity-disabled)`; apply this token instead if you prefer dimming by color.

### Typography

The typography system is a three-layer scale in `src/app/globals.css`: raw size primitives (`--text-xs` … `--text-6xl`), semantic tokens (`--font-display-*`, `--font-heading-*`, `--font-body-*`, `--font-caption`) that bundle size + line-height + weight + letter-spacing, and base styles on `h1..h6 / p / small` that consume those tokens.

Both the primitive and semantic layers are **intentionally available** as component-level APIs — pick whichever fits your product: reach for raw primitives (`var(--text-sm)`) when you want direct size control, or semantic tokens (`var(--font-heading-2)`) when you want size + line-height + weight + tracking bundled by intent. A token with no current consumer (e.g. `--font-display-1`, `--font-body-sm`) is an available option, not dead code.

**Fonts: Geist + Geist Mono via a dual-runtime architecture.**

| Runtime             | How Geist is loaded                                                                                            | What defines the family                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Next.js (prod/dev)  | `next/font/google` in `src/app/[locale]/layout.tsx` (SWC plugin generates self-hosted `@font-face` + preloads) | `--font-geist-sans` / `--font-geist-mono` on `<html>` |
| Storybook (`:6006`) | `<link rel="stylesheet">` to Google Fonts in `.storybook/preview-head.html` (Vite has no SWC plugin)           | `@font-face { font-family: 'Geist'; … }`              |

`globals.css` reconciles both with a single declaration using inline `var()` fallback:

```css
--font-sans:
  var(--font-geist-sans, 'Geist'), -apple-system, 'BlinkMacSystemFont',
  'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
```

In Next.js, the hashed family name from `next/font` wins. In Storybook, that var is undefined and the literal `'Geist'` resolves against the `@font-face` injected by `preview-head.html`. Single source of truth, no decorators, no patches. To swap the typeface, edit the `next/font` binding in `[locale]/layout.tsx` and the Google Fonts URL in `preview-head.html` — no component CSS needs to change.

### Responsive / Mobile-First

The UI is **mobile-first**: base styles target the smallest screen and every `@media (width >= …)` block only _enhances_ upward — it never resets. Styling is **CSS Modules + design tokens** (no Tailwind).

| Piece                               | Where                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| Breakpoint contract (single source) | `src/lib/breakpoints.ts` — `sm 640 / md 768 / lg 1024 / xl 1280` + `mediaUp()`     |
| Viewport hooks                      | `src/hooks/use-media-query.ts` — `useMediaQuery` / `useBreakpoint` / `useIsMobile` |
| Swipe gesture hook                  | `src/hooks/use-swipe.ts` — `useSwipe`                                              |
| Layout primitives                   | `src/components/layouts/` — `Container` / `Stack` / `Cluster` / `Grid`             |
| Mobile navigation                   | `src/components/layouts/mobile-nav.tsx` — hamburger + off-canvas drawer            |
| Touch / safe-area tokens            | `src/app/globals.css` — `--touch-target-min` (44px), `--touch-gap-min`, `--safe-*` |
| Viewport tests                      | `e2e/responsive.spec.ts` — anti-overflow matrix at 320/390/768/1024                |

Breakpoint px are literal in CSS because media queries can't read `var()`; `breakpoints.ts` is the canonical source for JS/tests — change a value there and update the matching px in the `*.module.css` files.

The full standard (philosophy, DO/DON'T, gutters, safe-area, gestures, performance, testing) lives in [`.agents/RESPONSIVE.md`](.agents/RESPONSIVE.md), and is codified as the project skill `.agents/skills/mobile-first-modules/` for reuse across projects.

### Page Shell & Wireframes

A layer of **content-agnostic structure primitives** plus **page-region blocks** so a real page never starts from a blank `<main>` with hand-rolled margins. Wrap content in `Container` and correct side gutters + max-width come for free at every breakpoint — the root cause of "content touching the edge" and inconsistent spacing.

**Pieces:**

| Piece                  | Where                                  | Responsibility                                                                           |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `Container` (`size`)   | `src/components/layouts/container.tsx` | Side gutters (16→24→32px) + max-width per `size`: `prose` / `default` / `wide` / `bleed` |
| `Section`              | `src/components/layouts/section.tsx`   | Semantic `<section>` with vertical rhythm (`--section-py`); `surface="muted"`            |
| `Header` / `NavLink`   | `src/components/layouts/`              | Sticky `<header>`; active-aware nav links (`aria-current` via `usePathname`)             |
| `Footer`               | `src/components/layouts/footer.tsx`    | Responsive multi-column footer (1→N) + legal row                                         |
| `Hero` / `FeatureGrid` | `src/components/blocks/`               | Page-region blocks: hero (eyebrow + headline + CTAs), feature card grid                  |

Layout primitives export from `@/components/layouts`, content blocks from `@/components/blocks`. Width and rhythm come from tokens in `src/app/globals.css` — `--layout-max-{prose,default,wide}` and `--section-py` — never hardcode them.

**How do I pick a starting layout?** Three navigable wireframes live in `src/app/[locale]/examples/` — **Minimal** (centered hero), **Marketing** (header + hero + features + CTA + footer), and **App-Shell** (header + sidebar + content). Browse them at `/en/examples`, or follow the demo home's **"Get started"** CTA, which links there.

**How do I use one?** Copy the preset you want into your own route, adapt the copy, and **delete `src/app/[locale]/examples/`** — it's a self-contained, throwaway segment (excluded from sitemap, `robots: { index: false }`). The only inbound link is the demo home's "Get started" CTA; repoint or drop it when you delete the folder. A typical composition:

```tsx
import { Container, Section } from '@/components/layouts';
import { Hero, FeatureGrid } from '@/components/blocks';

export default function Page() {
  return (
    <main>
      <Section>
        <Container>
          <Hero eyebrow="…" title="…" subtitle="…" actions={/* Buttons */} />
        </Container>
      </Section>
      <Section surface="muted">
        <Container>
          <FeatureGrid features={/* … */} />
        </Container>
      </Section>
    </main>
  );
}
```

**Anti-error checklist** (full version in `.agents/WIREFRAME.md §8`):

- Content always flows through `<Container>` — never set `max-width` / `margin: 0 auto` / inline padding on a page `.main` (a stylelint guardrail enforces this; see [`.stylelintrc.json`](.stylelintrc.json)).
- Mobile-first: base CSS is the smallest screen; `@media` only enhances upward.
- No horizontal overflow at 320px.
- Spacing from the `--space-*` scale and primitive gaps, not magic px.

The full phased design (gutter standard, width scale, the three presets, a11y contract) lives in `.agents/WIREFRAME.md`.

### Keyboard Navigation

Composite widgets need real keyboard support (arrow keys, `Home`/`End`, wrap-around). Rather than re-implementing it per component, pick the right tool for the widget's **archetype**:

| Widget archetype                                             | Use                                                        | Reference example |
| ------------------------------------------------------------ | ---------------------------------------------------------- | ----------------- |
| Static composite, real DOM focus (tablist, toolbar, menubar) | `useRovingFocus` (`src/hooks/use-roving-focus.ts`)         | `Tabs`            |
| Floating popover / menu / combobox (needs positioning)       | `@floating-ui/react` (`useFloating` + `useListNavigation`) | `Dropdown`        |
| Listbox with virtual focus (`aria-activedescendant`)         | virtual-focus pattern                                      | `Select`          |

`useRovingFocus` is the reusable primitive for the **static composite** archetype. Attach the ref + handler to the container; items are discovered by selector in DOM order, so there's no per-item registration. Activation (`Enter`/`Space`) stays in your component — the hook only moves focus.

```tsx
'use client';
import { useRovingFocus } from '@/hooks';

function Toolbar() {
  const { containerRef, onKeyDown } = useRovingFocus<HTMLDivElement>({
    orientation: 'horizontal', // 'vertical' | 'both'
    loop: true,
    manageTabIndex: true, // hook owns the roving tabindex (no external selection)
  });

  return (
    <div ref={containerRef} role="toolbar" onKeyDown={onKeyDown}>
      <button type="button">Bold</button>
      <button type="button">Italic</button>
      <button type="button">Underline</button>
    </div>
  );
}
```

Use `manageTabIndex: false` (the default) when an external state already decides which item is tabbable — that's how `Tabs` keeps the selected tab as the single tab stop. The full design, the Tabs migration, and the archetype decision matrix live in [`.agents/KEYBOARD-NAVIGATION.md`](.agents/KEYBOARD-NAVIGATION.md).

### Tri-State Theming

A first-class theming layer with three explicit choices: `light`, `dark`, and `system` (follow the OS preference). The architecture is intentionally SSR-safe and free of common anti-patterns.

**Pieces:**

| File                                          | Responsibility                                                       |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `src/components/providers/theme-provider.tsx` | `ThemeProvider` (uses `useSyncExternalStore`) + `useTheme` hook      |
| `src/components/ui/theme-toggle/`             | `ThemeToggle` primitive that cycles light → dark → system            |
| `src/hooks/use-theme.ts`                      | Re-export of `useTheme` for ergonomic feature-side imports           |
| `src/app/globals.css`                         | CSS contract with `:root` tokens and `[data-theme="dark"]` overrides |
| `src/app/[locale]/layout.tsx`                 | Provider mount + inline anti-FOUC script in `<head>`                 |

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

A thin wrapper around `fetch` with required **Zod schema validation** guarantees that what you receive matches what you expect:

```ts
import { apiClient } from '@/lib/api/client';
import { z } from 'zod';

const userSchema = z.object({ id: z.number(), name: z.string() });
const user = await apiClient('/api/user', {
  schema: userSchema,
  timeoutMs: 5000,
});
// user is typed AND validated at runtime
```

The `schema` is **required** — every response is validated against its Zod contract, so a new endpoint can never silently return unvalidated data (for a deliberate passthrough, pass `z.unknown()` explicitly). Beyond validation, the client enforces a request **timeout** (`timeoutMs`, default 10s) via an internal `AbortController` that composes with any caller-provided `signal`, and **guards** `res.json()` (raising a structured `ApiError` on a non-JSON response).

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
3. **React Hook Form** handles client-side UX with `useActionState` for server feedback (`features/contact/components/contact-form.tsx`). The form receives its visible labels through a localized `labels` prop from the page, so every string is translated per locale.

> **Why validate twice?** The client validates for instant UX feedback. The server validates because you can never trust the client.

---

## Testing Strategy

### Unit & Component Tests

Components and hooks are tested in isolation with Vitest and Testing Library.

**Coverage policy:**

- **Threshold:** 70% minimum for statements, branches, functions, and lines.
- **Per-file enforcement:** `vitest.config.ts` uses `perFile: true`, meaning every individual file must meet the threshold. A single file with 100% coverage cannot mask another with 0%.
- **Excluded from coverage:** CSS Modules (static, no executable logic), Storybook stories, MSW mocks, test files, E2E specs, and pure re-export barrels (`**/index.ts`) are excluded so they do not dilute the metric.

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

Playwright runs full browser tests against a **production build** in every environment — CI serves the prebuilt artifact, and locally the config runs `build && start` (reusing an already-running server if one is present). The `webServer` injects test values for `NEXT_PUBLIC_*`, so the production-mode server is fully configured and its output stays clean. Specs share a single route source (`e2e/routes.ts`) so a route rename is one edit.

Five specs (`a11y`, `contact`, `home`, `responsive`, `smoke` — 63 tests) cover locale routing, i18n, the contact form, accessibility, the responsive-viewport matrix, and API health. Page-level accessibility goes beyond point checks: `a11y.spec.ts` pins each preset's **accessibility tree** (landmark order + heading skeleton) with `toMatchAriaSnapshot`, so a semantic regression trips a test even when the individual landmark/heading assertions still pass.

On failure, CI annotates the PR inline (`github` reporter) and the HTML report embeds a screenshot and video.

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
- **Same typography as the app:** `.storybook/preview-head.html` loads Geist + Geist Mono into the preview iframe (Storybook's Vite pipeline does not run the Next.js SWC plugin, so `next/font` is inert here — see the [Typography](#typography) section for the full architecture)
- **Chromatic ready:** `@chromatic-com/storybook` is installed for visual regression testing and UI review
- **Onboarding guide:** `@storybook/addon-onboarding` ships an interactive walkthrough for writing your first stories. It's a learning aid, not a runtime dependency — once you're comfortable, remove it from the `addons` array in `.storybook/main.ts` and from `devDependencies`

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

### Analytics

No analytics provider ships by default (no vendor lock-in, no script on every page). `.env.local.example` includes a commented `NEXT_PUBLIC_ANALYTICS_ID` placeholder so the wiring is one step away — it is **not** read anywhere until you opt in. To enable a script-tag provider (Plausible, Fathom, GA, …), uncomment the var and load it with `next/script` (nonce-bound to satisfy the CSP in `src/proxy.ts`):

```tsx
// src/app/[locale]/layout.tsx — inside <head>
import Script from 'next/script';

const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
{
  analyticsId && (
    <Script
      src="https://plausible.io/js/script.js"
      data-domain={analyticsId}
      strategy="afterInteractive"
    />
  );
}
```

Remember to add the provider's origin to the CSP `connect-src`/`script-src` allowlist in `src/proxy.ts`. For Vercel's first-party analytics, install `@vercel/analytics` and render `<Analytics />` instead — no env var needed.

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

> **When to add it:** any production deployment that handles user-facing errors should adopt an error tracking SDK. Wire it into `reportError` and you're done — no boilerplate caller in the app needs to change. **When not to:** prototypes, internal tools, or apps in pre-launch with no traffic.
>
> **Rule of thumb:** any new surface that may throw at runtime (Error Boundaries, Server Actions, route handlers, jobs) should route errors through `reportError` — never `console.error` directly in production code.

### Authentication

No auth is bundled — it is a **product decision**, not a platform one. The natural gate is `src/proxy.ts`, which already intercepts every request (locale + CSP). Add a protected-route check there, keeping the session lookup behind a `getSession` helper so the rest of the app never couples to a vendor:

```ts
// src/proxy.ts — inside proxy(request), after the locale is resolved
const PROTECTED = ['/dashboard', '/account'];
if (PROTECTED.some(p => pathname.includes(p)) && !(await getSession(request))) {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/login`;
  return applySecurityResponseHeaders(
    NextResponse.redirect(url),
    nonce,
    cspHeader,
  );
}
```

**Providers:** Auth.js (NextAuth), Clerk, Better Auth, WorkOS, or your own cookie-based backend. Only the body of `getSession` (and a parallel `getCurrentUser()` for Server Components / Actions) changes if you switch vendors.

> **When to add it:** any app with per-user data or private routes. **When not to:** public marketing sites or docs.

### Transactional Email

`submitContactAction` (`src/features/contact/actions.ts`) validates with Zod but **does not send anything** — sending is the opt-in piece. Plug a provider in after a successful parse:

```ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // validate in env.server.ts
await resend.emails.send({
  from: 'Contact <noreply@yourdomain.com>',
  to: process.env.CONTACT_INBOX!,
  replyTo: parsed.data.email,
  subject: `New message from ${parsed.data.name}`,
  text: parsed.data.message,
});
```

**Providers:** Resend, Postmark, AWS SES, SendGrid. Add the API key as a **server-only secret** validated in `src/lib/env.server.ts` (never `NEXT_PUBLIC_*`), and route send failures through `reportError` so a provider outage never breaks the form UX.

### Rate Limiting

Not bundled — protect abusable surfaces (the contact Server Action, API routes like `/api/health`) by adding a limiter behind a helper so the store can change without touching callers:

```ts
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimit(key: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
```

> **Caveat:** an in-memory `Map` does **not** work on serverless (each instance has its own and they reset). For multi-instance production use a shared store such as `@upstash/ratelimit` (Redis), keyed by IP (`x-forwarded-for`) or user id. Return `429` when the limiter rejects.

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
secret-scan   (independent)

quality ──┬──▶ storybook
          ├──▶ test ──▶ coverage ──┐
          │                        ▼
          └──▶ ─────────────────▶ build ──▶ e2e
```

| Job             | Description                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **secret-scan** | gitleaks scans full git history for committed credentials; runs in parallel, off the critical path                                      |
| **quality**     | format check → lint → typecheck → security audit (prod gate: `--omit=dev`; full-tree audit: all deps) → commitlint validation (PR only) |
| **test**        | unit/component suite (Vitest, no coverage thresholds)                                                                                   |
| **coverage**    | same test suite with v8 coverage report and threshold enforcement; HTML report uploaded as artifact                                     |
| **storybook**   | build Storybook and run accessibility (a11y) audits against the stories                                                                 |
| **build**       | production build; bundle-size summary posted to job summary; build artifact packaged as tarball and uploaded                            |
| **e2e**         | Playwright Chromium tests against the built artifact; Playwright report uploaded (7-day retention)                                      |

### Artifact Strategy

- Jobs that upload or download artifacts are granted `actions: write` permissions.
- Build and report artifacts are retained for **7 days**.
- `.next/cache` is cached between runs using `actions/cache@v4`. The cache key includes `package-lock.json`, `next.config.ts`, `tsconfig.json`, and `src/**/*.{ts,tsx}`, so a change to the build/TS config invalidates a stale cache.

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

Production safety without a `develop` branch comes from a chain, not an integration branch:

1. **CI on every PR** — format, lint, typecheck, tests, coverage, build, Storybook a11y and E2E must all pass before anything reaches `main`.
2. **Branch protection on `main`** (below) — merges require a PR with green checks.
3. **Preview deployments per PR** (e.g. Vercel) — each PR gets an isolated production-like environment for real verification; the modern replacement for a shared `develop` staging, with no drift between what you tested and what you merge.
4. **Merge ≠ deploy** — promoting `main` to production is a separate, controlled step (promote/rollback on your hosting platform).

If your project needs Git Flow instead (e.g. versioned, scheduled releases), add `develop` back to the `branches` triggers in `.github/workflows/ci.yml` and mirror the branch protection.

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

### No interpolation / pluralization layer (by design)

Dictionaries are **flat string maps** looked up by direct access (`dict.common.notFound`) — there is no `{token}` interpolation, ICU syntax, or pluralization. Dynamic values are composed in TSX with template literals (e.g. the footer copyright: `` `© ${year} ${brand} · ${dict.footer.rights}` ``). If you need interpolation, add a tiny helper (`format(template, vars)` that replaces `{name}` placeholders) or adopt a library like `intl-messageformat` for full ICU/plural support.

### Localized 404 vs. error boundaries

`src/app/[locale]/not-found.tsx` is a Server Component that **is** localized: Next.js gives `not-found` no `params`, so it reads the `NEXT_LOCALE` cookie (set by `proxy.ts`) via `cookies()` and feeds it to `getDictionary`. The error boundaries `src/app/[locale]/error.tsx` and `src/app/global-error.tsx` stay in English **on purpose** — they are Client Components, and `NEXT_LOCALE` is `httpOnly` (unreadable from client JS) while `getDictionary` is `server-only`, so they genuinely cannot localize without an extra round-trip. Keep their copy short and language-neutral, or wire your own client-side locale source if you need them translated.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_ORIGIN=https://jsonplaceholder.typicode.com
```

Public variables (`NEXT_PUBLIC_*`) are validated with Zod (`src/lib/env.ts`). In `development` and `test` they ship with defaults so a fresh clone runs zero-config. In **production** all three are required — `next build` (and `next start`) **fails with an explicit error** if any is unset, so a misconfigured deploy can never ship localhost metadata, a wrong sitemap or a demo-API CSP silently. Server-only secrets live in `src/lib/env.server.ts` (no defaults, guarded by `server-only`) and also throw at startup if missing or malformed.

`NEXT_PUBLIC_API_ORIGIN` is the origin of the demo posts/comments API. It feeds both the API services (`src/features/posts/api/`) and the CSP `connect-src` allowlist in `src/proxy.ts`, so swapping in a real API is a single env change — the CSP stays in sync by construction. The value is normalized to a bare origin (no path, no trailing slash) by the Zod schema.

---

## Important Notes

### `src/proxy.ts`

Next.js 16 uses `proxy.ts` (exporting a `proxy` function) instead of the legacy `middleware.ts` convention. **Do not rename this file or its export** — the framework will not recognise it.

The `proxy` function does three things on every request:

1. **Locale routing.** Detects the visitor's preferred locale (cookie `NEXT_LOCALE` takes priority over `Accept-Language`) and redirects `/(path)` to `/[locale]/(path)` before the request reaches any page.
2. **Locale cookie sync.** Sets/updates `NEXT_LOCALE` (1-year, `sameSite=lax`, `httpOnly`, `secure` in production) so the user's explicit choice persists across visits. The cookie is read server-side only (here + Server Actions); the client-side locale comes from the URL prefix, so `httpOnly` costs nothing.
3. **CSP nonce.** Generates a fresh `crypto.randomUUID()` nonce per request, builds the `Content-Security-Policy` header with `script-src 'self' 'nonce-XYZ'` (`'strict-dynamic'` is intentionally **omitted** — it disables the `'self'` allowlist and Turbopack's chunk loader injects lazy `<script>` chunks without the nonce, which would block hydration in production), and propagates it through both request headers (for `next/headers`-based reading in Server Components) and response headers (for browser enforcement). The CSP is intentionally **not** defined in `next.config.ts` — nonces must be generated per request, which static config cannot do.

API routes, static assets, metadata files, and prefetches are excluded via the `matcher` config. Those excluded routes still receive the static headers from `next.config.ts` (including `X-Frame-Options: SAMEORIGIN`, which covers framing), but **not** the per-request nonce CSP — the nonce only matters for the HTML responses that embed scripts. A static CSP is deliberately not added in `next.config.ts` because it would duplicate the `Content-Security-Policy` header on the routes the proxy already covers.

**CSP violation reporting (opt-in).** The policy has no `report-to`/`report-uri` by default, so violations are invisible in production until you wire observability. When you do, add a `report-to` directive (and the matching `Reporting-Endpoints` response header) in `buildCspHeader`/`applySecurityResponseHeaders` (`src/proxy.ts`) pointing at your collector — `src/lib/observability.ts` is the stub where that integration belongs. Keep it opt-in to avoid shipping a vendor endpoint by default.

> **Note on hydration mismatch:** browsers strip the `nonce` attribute from the DOM after using it for CSP enforcement (per the CSP3 spec §6.6.4.6 — anti-exfiltration measure). React's hydration will flag a benign attribute mismatch on those `<script>` tags as a result; the relevant elements use `suppressHydrationWarning` for this reason. The CSP enforcement itself is unaffected — the script ran because it carried the valid nonce at parse time.
>
> **Note on Partial Prerendering:** the inline `<script nonce>` elements that depend on `headers()` are isolated in a dedicated server component wrapped in `<Suspense>` at the call site. This preserves the static shell of the layout (PPR keeps working) while only the nonced scripts resolve per request.

### SEO metadata

Every page sets its own `metadata` via Next's Metadata API. Per-page canonical + hreflang come from `buildAlternates(locale, path)` (`src/lib/seo.ts`), so deep pages canonical to themselves rather than the homepage. `WebSite` + `Organization` JSON-LD are injected globally by `HeadScripts`; `Article` and `BreadcrumbList` are opt-in per page (see `app/[locale]/posts/[id]/page.tsx`). All JSON-LD is emitted through `serializeJsonLd()` (`src/lib/json-ld.ts`), which escapes `<`, `>`, `&` and the U+2028/U+2029 line separators so an injected value can never break out of the inline `<script>` block.

### `npm ci` failures with peer dependencies

If you see `ERESOLVE` errors during `npm ci`, check `.github/dependabot.yml` for any `ignore` rules that document known ecosystem incompatibilities. Never use `--legacy-peer-deps` or `--force` as a workaround; the correct fix is to wait for the upstream plugin to support the newer version, or to pin the dependency range in `package.json`.

> **ESLint v9 pin:** `eslint-plugin-import` does not yet support ESLint v10. Dependabot's major-version bump for ESLint is blocked in `.github/dependabot.yml` until upstream compatibility is confirmed. Do not manually upgrade ESLint past v9.

### Coverage policy

- **CSS Modules** (`*.module.css`) are excluded from coverage because they contain no executable JavaScript logic. Including them would artificially lower the metric. The same applies to Storybook stories, MSW mocks, E2E specs, and pure re-export barrels (`**/index.ts`).
- **Per-file thresholds** are enforced. If you add a new file, it must reach 70% coverage on its own. You cannot rely on other files to compensate.
- **Structurally unreachable branches** (SSR-only guards, defensive checks behind disabled UI) are marked with a documented `/* v8 ignore … */` pragma rather than chased with synthetic tests.
- **Console output in tests:** If a component intentionally logs to `console.error` (e.g. an error boundary), wrap the render in a `vi.spyOn(console, 'error').mockImplementation(() => {})` to prevent Vitest from treating it as a test runner error.

### Lint-staged performance

ESLint and Stylelint run with `--cache` in the pre-commit hook. The first commit after cloning may take longer as caches are built; subsequent commits are significantly faster. Cache files (`.eslintcache`, `.stylelintcache`) are gitignored and safe to delete at any time.

### Pre-commit Node heap

`.husky/pre-commit` exports `NODE_OPTIONS='--max-old-space-size=4096'` before invoking `lint-staged`. This raises V8's heap ceiling so eslint/prettier/stylelint can process large staged sets without being killed by the OS (`SIGKILL`). Combined with `eslint-plugin-react-compiler`'s type-aware analysis on the React tree, the default ~2 GB heap can be insufficient on WSL2 / Linux for repos with many JSX files (the icon system alone is 173 modules). Raise the limit further (e.g. `6144`) only if the symptom returns; do not bypass it by skipping the hook.

> **Why exported in the hook, not inline in `lint-staged`?** `lint-staged` does **not** run commands through a shell, so an env-var prefix like `NODE_OPTIONS=... eslint --fix` is interpreted as a binary name and fails with `ENOENT`. Exporting the variable in the hook makes it available to every child process (eslint, prettier, stylelint) without depending on shell-quoting.

### Structural files in `public/`

`public/placeholder.svg` is a 1×1 transparent SVG whose only purpose is to keep the `public/` directory tracked by git. Git does not track empty directories, and Storybook's `staticDirs: ['../public']` config fails fast with `parseStaticDir` ENOENT on fresh CI clones if the directory is missing. **Do not delete this file** unless you replace it with a real static asset.
