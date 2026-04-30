# Contributing

## Development setup

```bash
nvm use          # switch to the required Node version
npm install      # install dependencies (husky hooks set up automatically)
cp .env.local.example .env.local
```

## Before committing

The pre-commit hook runs `lint-staged` automatically:

- **ESLint** (`--fix`) on `*.{ts,tsx,mts}`
- **Prettier** (`--write`) on `*.{ts,tsx,mts,css,json,md}`

The commit-msg hook validates the message format via commitlint.

## Commit message format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore` · `perf` · `ci` · `build` · `revert`

## Running checks locally

```bash
npm run format:check   # verify formatting
npm run lint           # ESLint
npm run typecheck      # TypeScript (no emit)
npm test               # unit + component tests
npm run test:coverage  # tests + coverage thresholds (70%)
npm run test:e2e       # Playwright E2E (requires running dev server)
npm run build          # production build
```

## Pull requests

Use the PR template. All CI jobs must pass before merging.
