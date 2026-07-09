## Summary

<!-- What does this PR do? Why? -->

## Changes

-

## Quality gate (CI enforces these on every PR)

- [ ] `npm run format:check` — Prettier clean
- [ ] `npm run lint` — no ESLint errors
- [ ] `npm run stylelint` — no CSS violations
- [ ] `npm run typecheck` — no type errors
- [ ] `npm test` — all unit tests pass
- [ ] `npm run build` — production build succeeds

## Conditional checks (run the ones your change touches)

- [ ] `npm run test:coverage` — added files meet the 70% per-file threshold
- [ ] `npm run test:storybook` — components/stories changed (blocking a11y gate)
- [ ] `npm run test:e2e` — routes, layouts or user flows changed
- [ ] Manually tested in browser (or preview deployment)

## Checklist

- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/) spec
- [ ] Tests added/updated where applicable
