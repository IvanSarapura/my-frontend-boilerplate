# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Layout system** — `Container` width tokens + size variants, `Section` vertical-rhythm primitive, `Stack`/`Cluster`/`Grid` primitives, and `Hero`/`FeatureGrid` content blocks
- **Page shell** — sticky `Header` with active-aware `NavLink`, responsive multi-column `Footer`, and navigable example presets (Minimal, Marketing, App-Shell, Portfolio) as deletable `(examples)` routes
- **ThemeSwitch** — `ToggleSwitch`-based light/dark switch with opt-in icons and `outlined`/`outlined-max` variants; chromeless "bare" header menu and selectable header size variants
- **Keyboard nav** — reusable `useRovingFocus` hook (Tabs migrated to it)
- **DX** — `.vscode/launch.json` debug configs now tracked in git; stylelint enforced as a CI gate in the `quality` job

### Changed

- **i18n** — `getDictionary` self-defends against invalid locales (falls back to the default instead of throwing a 500)
- **Select** — rebuilt on floating-ui with the WAI-ARIA combobox pattern
- **Comments demo** — caches per-post comments on the client (React Query `staleTime`) and receives slimmed `{ id, title }` props
- **Theme** — interactive hover/active states tokenized with a state-layer model

### Removed

- Dead `getMessages` i18n loader (superseded by `getDictionary`)

### Fixed

- **a11y** — collapsed accordion panels taken out of the tab order (`inert`); toast auto-dismiss pauses on hover/focus; `ToggleSwitch` exposes `role="switch"`; `Select` announces the active option via `aria-activedescendant`; page background made inert behind modal/drawer; hardened form id generation and modal naming
- **Security** — `apiClient` requires a Zod schema and no longer leaks upstream `statusText`

## [0.1.0] - 2026-05-01

### Added

- **i18n** — built-in locale routing via `src/proxy.ts`; `/` redirects to `/en` (default) or `/es`
- **SEO** — `generateWebsiteJsonLd` JSON-LD schema injected in root layout; full OpenGraph + Twitter card metadata; `viewport` export
- **Testing** — Vitest 4 + React Testing Library; 74 test files; 70 % coverage thresholds
- **stylelint** — `stylelint-config-standard` applied to all CSS modules; `stylelint` + `stylelint:fix` scripts; CSS linting in `lint-staged`
- **CI/CD** — GitHub Actions pipeline with seven jobs (`quality`, `secret-scan`, `test`, `coverage`, `build`, `storybook`, `e2e`); bundle-size summary step; Playwright report artifact
- **VSCode** — `.vscode/launch.json` with server-side, client-side, and full-stack debug configurations
- **Security** — error boundary hides raw `error.message` in non-development environments (HSTS, CSP, security headers in `next.config.ts`)
- **Components** — `Button` (primary/secondary/ghost × sm/md/lg), `Container`, `useToggle` hook
- **API** — `GET /api/health` returns `{ status, timestamp }` with ISO 8601 timestamp
- **DX** — Husky v9 pre-commit + commit-msg hooks; commitlint conventional config; Prettier; ESLint with import-sort and a11y plugins
- **Architecture** — Zod-validated environment variables (`src/lib/env.ts`); CSS design tokens in `globals.css`; `server-only` guardrails on server utilities

[Unreleased]: https://github.com/your-org/my-frontend-boilerplate/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/my-frontend-boilerplate/releases/tag/v0.1.0
