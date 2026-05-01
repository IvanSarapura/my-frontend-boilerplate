# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-05-01

### Added

- **i18n** — built-in locale routing via `src/proxy.ts`; `/` redirects to `/en` (default) or `/es`
- **SEO** — `generateWebsiteJsonLd` JSON-LD schema injected in root layout; full OpenGraph + Twitter card metadata; `viewport` export
- **Testing** — Vitest 4 + React Testing Library; 24 unit tests across 8 files; 70 % coverage thresholds
- **stylelint** — `stylelint-config-standard` applied to all CSS modules; `stylelint` + `stylelint:fix` scripts; CSS linting in `lint-staged`
- **CI/CD** — GitHub Actions pipeline with four jobs: `quality` → `test` → `build` → `e2e`; bundle-size summary step; Playwright report artifact
- **VSCode** — `.vscode/launch.json` with server-side, client-side, and full-stack debug configurations
- **Security** — error boundary hides raw `error.message` in non-development environments (HSTS, CSP, security headers in `next.config.ts`)
- **Components** — `Button` (primary/secondary/ghost × sm/md/lg), `Container`, `useToggle` hook
- **API** — `GET /api/health` returns `{ status, timestamp }` with ISO 8601 timestamp
- **DX** — Husky v9 pre-commit + commit-msg hooks; commitlint conventional config; Prettier; ESLint with import-sort and a11y plugins
- **Architecture** — Zod-validated environment variables (`src/lib/env.ts`); CSS design tokens in `globals.css`; `server-only` guardrails on server utilities

[Unreleased]: https://github.com/your-org/my-frontend-boilerplate/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/my-frontend-boilerplate/releases/tag/v0.1.0
