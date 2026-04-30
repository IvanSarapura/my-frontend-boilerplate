# my-frontend-boilerplate

A professional, minimal Next.js frontend boilerplate with a complete DX and CI/CD setup ready to clone and build on.

## Stack

| Tool            | Version | Purpose                         |
| --------------- | ------- | ------------------------------- |
| Next.js         | 16      | React framework (App Router)    |
| React           | 19      | UI library                      |
| TypeScript      | 5       | Type safety (strict mode)       |
| React Compiler  | 1.0.0   | Automatic memoization           |
| Prettier        | 3       | Code formatting                 |
| ESLint          | 9       | Linting (flat config)           |
| Vitest          | 4       | Unit / component testing        |
| Testing Library | 16      | DOM testing utilities           |
| Husky           | 9       | Git hooks                       |
| lint-staged     | 16      | Pre-commit quality checks       |
| commitlint      | 19      | Conventional commit enforcement |

## Getting Started

### Prerequisites

- Node.js `>=18.18.0` — use [nvm](https://github.com/nvm-sh/nvm): `nvm use`

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
| `npm test`              | Run tests once                   |
| `npm run test:watch`    | Run tests in watch mode          |
| `npm run test:coverage` | Run tests with coverage report   |

## Git Conventions

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/). The `commit-msg` hook enforces this automatically.

```
feat: add user authentication
fix: resolve layout shift on mobile
docs: update README setup section
chore: upgrade vitest to v4
```

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with metadata (OG + Twitter cards)
    page.tsx            # Home page
    page.module.css     # Home page styles
    globals.css         # Global styles and CSS custom properties
    error.tsx           # Error boundary (Client Component)
    not-found.tsx       # 404 page
    loading.tsx         # Loading skeleton
    page.test.tsx       # Example unit test
    favicon.ico
```

## CI/CD

GitHub Actions runs on push/PR to `main` and `develop`.

```
quality ──┐
           ├──▶ build
test    ──┘
```

- **quality** — format check → lint → typecheck
- **test** — full test suite with coverage (uploaded as artifact)
- **build** — production build (runs only if both quality and test pass)

Concurrent runs on the same branch are cancelled automatically.
