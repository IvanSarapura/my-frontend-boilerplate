# Development Workflow Guide

How to ship changes with this boilerplate the way high-performing teams do: short-lived branches, blocking CI, preview deployments, controlled promotion and feature flags — with the industry evidence behind each practice.

This guide is intentionally educational. If you only want the operating rules, read the [Feature Workflow](./README.md#feature-workflow) summary in the README; come back here when you want to understand _why_ each rule exists. Every claim links to a primary source in [References](#references).

## Table of Contents

- [The branching model](#the-branching-model)
- [Anatomy of a change](#anatomy-of-a-change)
- [Small PRs, short-lived branches](#small-prs-short-lived-branches)
- [The three safety layers](#the-three-safety-layers)
- [Big features without long branches](#big-features-without-long-branches)
- [Hotfixes](#hotfixes)
- [How this boilerplate maps to the workflow](#how-this-boilerplate-maps-to-the-workflow)
- [References](#references)

---

## The branching model

This repository uses **GitHub Flow** — a trunk-based model with one long-lived branch (`main`) and short-lived feature branches that merge back through pull requests. There is no `develop`, no release branches, no staging branch.

That is not a simplification for convenience; it is the documented industry standard for continuously delivered web software:

- **The inventor of the `develop` branch says so.** Git Flow — the model that popularized `develop` — comes from Vincent Driessen's 2010 article. In 2020 he added a note of reflection to that same article: _"If your team is doing continuous delivery of software, I would suggest to adopt a much simpler workflow (like GitHub flow) instead of trying to shoehorn git-flow into your team."_ Git Flow remains a fit only _"if you are building software that is explicitly versioned, or if you need to support multiple versions of your software in the wild."_
- **The DORA research (Google Cloud) backs it with data.** Across years of State of DevOps studies, teams that practice trunk-based development — three or fewer active branches, merging to trunk at least daily, no code freezes — achieve higher delivery speed, stability and availability. Elite performers are ~3× more likely to practice it than low performers.
- **Atlassian classifies Git Flow as legacy.** Their official Git tutorial opens with: _"Gitflow is a legacy Git workflow that was originally a disruptive and novel strategy… Gitflow has fallen in popularity in favor of trunk-based workflows, which are now considered best practices for modern continuous software development and DevOps practices."_
- **Martin Fowler reaches the same conclusion** in _Patterns for Managing Source Code Branches_: frequent integration into a healthy, release-ready mainline beats long-lived feature isolation — smaller merges, earlier conflict detection, refactoring stays possible.

**When Git Flow _is_ the right call:** explicitly versioned software with scheduled releases — mobile apps gated by store review, on-premise software customers install themselves, libraries supporting several major versions in parallel. A SaaS or web app has exactly one version in production and you control when it updates, so none of the structural reasons for `develop` apply. If your project needs Git Flow, add `develop` back to the `branches` triggers in `.github/workflows/ci.yml` and mirror the branch protection — it is a one-line change.

## Anatomy of a change

Every change — feature, fix, chore — follows the same cycle:

```
main ──┬─────────────────────────────────────▶ squash merge ──▶ deploy
       │                                            ▲
       └──▶ feat/contact-autosave ──▶ PR ──▶ review ┘
            (lives days, not weeks)     │
                                        ├─▶ CI (blocking)
                                        └─▶ preview deployment
```

1. **Branch off an up-to-date `main`**: `git switch main && git pull && git switch -c feat/contact-autosave`. Prefixes mirror the Conventional Commit types this repo already enforces: `feat/…`, `fix/…`, `chore/…`, `docs/…`.
2. **Commit small, with Conventional Commits** (`feat(contact): persist draft to localStorage`). commitlint validates the format; the pre-push hook runs the local quality gate before anything leaves your machine.
3. **Open the PR early — as a draft if unfinished.** A PR is not "I'm done"; it is where the work becomes visible: CI runs on every push, and the preview deployment rebuilds with every commit so anyone can exercise the real app.
4. **Green checks + review, then squash merge.** The whole branch becomes a single clean commit on `main` (`feat(contact): autosave drafts (#42)`). `main` history stays linear, and every commit on it is a deployable — and revertible — unit.
5. **Delete the branch.** Feature branches are disposable by design; GitHub can do this automatically on merge. The PR and its history remain.
6. **`main` deploys.** Automatically, or through a controlled promote step (see [safety layers](#the-three-safety-layers)).

Never commit directly to `main` — branch protection should make that impossible, not just discouraged (see [Branch Protection](./README.md#branch-protection)).

## Small PRs, short-lived branches

The single highest-leverage habit in this whole guide:

- **DORA:** branches in trunk-based development _"typically last no more than a few hours"_; the research thresholds for high performance are three or fewer active branches and merging to trunk at least once a day. Long-lived branches erode every benefit measured.
- **Google's engineering practices:** _"The right size for a CL is one self-contained change."_ As a heuristic, ~100 changed lines is a comfortable review; ~1,000 is usually too large. Small changes are _"reviewed more quickly"_ and _"more thoroughly"_ — reviewers can actually reason about the impact, which is where bugs get caught.
- **Fowler:** _"if it hurts, do it more often"_ — small frequent integrations are individually trivial; big rare ones are individually dangerous.

Signals that a PR should be split: the diff mixes refactoring with behavior changes, the description needs the word "also", or review comments concentrate on one file while the other twenty get rubber-stamped. Google's splitting strategies apply directly: stack dependent PRs, separate refactors from features, split by layer or by sub-feature.

## The three safety layers

"How do I test changes without touching production?" is the right question — and the modern answer is a chain of three independent layers, not an integration branch:

| Layer                  | When           | Question it answers                    |
| ---------------------- | -------------- | -------------------------------------- |
| **Preview deployment** | Before merge   | Does the app work with this change?    |
| **Promote**            | Merge → domain | When does production start serving it? |
| **Feature flag**       | In production  | Who sees it, and when do we launch?    |

### 1. Preview deployments (before merge)

When the repository is connected to a platform like Vercel, **every push to a non-production branch triggers a real production build of that exact commit**, deployed to a unique ephemeral URL (e.g. `my-app-git-feat-payments-you.vercel.app`). A bot comments the URL on the PR; every new push updates it; merging or closing the PR retires it.

This is the job a shared `develop`/staging environment used to do, done better:

- **Isolated per PR** — one branch's experiment can never contaminate another's test run.
- **Zero drift** — you verify _the exact commit_ you are about to merge, not a `develop` branch that has diverged from what will actually ship.
- **Real infrastructure** — actual production build, server components, Server Actions; not your `localhost`.

Vercel separates environment variables per environment (**Development / Preview / Production**), so previews run with sandbox credentials (Stripe test mode, staging database) while production keeps the real ones. This pairs with this repo's env contract: production builds fail fast unless `NEXT_PUBLIC_*` vars are explicitly set (see [Environment Variables](./README.md#environment-variables)).

### 2. Promote and instant rollback (merge ≠ deploy)

By default, merging to `main` auto-deploys to production. For more control, disable domain auto-assignment: each merge then produces a **staged** production deployment that serves no traffic until you press **Promote**. Deployments are immutable, so **instant rollback** is just re-pointing the domain at the previous deployment — seconds, no rebuild.

This is the "cushion before production" that `develop` pretended to be — placed after `main`, where it actually protects what ships.

### 3. Feature flags (deploy ≠ launch)

A feature flag lets code sit in production, deployed and dormant, until you decide to turn it on:

```tsx
{
  env.NEXT_PUBLIC_FEATURE_PAYMENTS === 'true' && <CheckoutButton />;
}
```

Pete Hodgson's canonical article on martinfowler.com calls these **release toggles**: _"Release Toggles allow incomplete and un-tested codepaths to be shipped to production as latent code which may never be turned on."_ They are what makes trunk-based development viable for large features (next section), and they separate _deploying code_ (frequent, boring, safe) from _launching features_ (a business decision). Turning a misbehaving feature off is instantaneous — no revert, no redeploy.

Start with an environment variable validated in `src/lib/env.ts`; graduate to a flag service (Vercel Edge Config, LaunchDarkly, Unleash) when you need percentage rollouts or per-user targeting. Two disciplines keep flags healthy: **release toggles are short-lived** — delete them once the feature is fully launched (Hodgson: treat toggles as _"inventory which comes with a carrying cost"_), and **decouple the decision from the decision point** — one module answers "is X enabled?", the codebase asks that module, never `process.env` directly.

## Big features without long branches

A payments system does not fit in a two-day branch — and the amateur answer ("let the branch live a month") recreates every pathology of `develop`: late integration, a final mega-conflict, a 4,000-line unreviewable PR. The professional answer is **incremental delivery behind a flag**:

```
PR #1  feat(payments): add Stripe SDK, env vars, webhook skeleton   → main (flag OFF)
PR #2  feat(payments): checkout page UI behind flag                 → main (flag OFF)
PR #3  feat(payments): subscription webhooks + persistence          → main (flag OFF)
PR #4  feat(payments): admin billing view                           → main (flag OFF)
PR #5  feat(payments): enable for internal accounts                 → main (dark launch)
PR #6  feat(payments): roll out 10% → 100%                          → main (launch)
```

Each PR is small, reviewed properly, verified on its own preview, and merged within days. The payments code lives in production for weeks — dormant — before any user sees it (a **dark launch**). "Launching" is flipping a flag, not a terrifying merge; rolling back is flipping it off. This is how Stripe-, Shopify- and GitHub-scale teams ship, and it is precisely the capability DORA's data associates with elite delivery performance.

## Hotfixes

Production breaks → same mechanics, no exceptions: `fix/stripe-webhook-timeout` off `main` → PR (CI runs in full — discipline does not get suspended during emergencies, which is when mistakes are most likely) → squash merge → deploy. If the incident is live, **instant rollback first**, fix calmly second.

Because `main` _is_ production, there are no cherry-picks and no second branch to synchronize — in practice one of the most-cited reasons teams abandon `develop`.

## How this boilerplate maps to the workflow

Already wired in this repository:

| Piece                                   | Where                                                                             |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| Conventional Commits, enforced          | commitlint + husky hooks                                                          |
| Local quality gate before push          | pre-push hook (format, lint, typecheck, tests)                                    |
| Blocking CI on every PR                 | `.github/workflows/ci.yml` (+ dependency review, secret scan)                     |
| Production env fail-fast (safe deploys) | `src/lib/env.ts` — see [Environment Variables](./README.md#environment-variables) |
| Branch protection recipe                | [README → Branch Protection](./README.md#branch-protection)                       |
| E2E against the real production build   | Playwright `webServer` (CI serves the prebuilt artifact)                          |

Platform decisions you make when deploying (all zero-config on Vercel's free tier: import the repo and previews work immediately):

- **Preview deployments per PR** — automatic once the repo is connected.
- **Promote / instant rollback** — optional; disable domain auto-assignment when you want the manual gate.
- **Feature flags** — start with a `NEXT_PUBLIC_FEATURE_*` env var validated in `src/lib/env.ts`.

## References

- Vincent Driessen — [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/) (origin of Git Flow; see the 2020 "Note of reflection" recommending GitHub Flow for continuous delivery)
- GitHub Docs — [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)
- DORA (Google Cloud) — [Trunk-based development capability](https://dora.dev/capabilities/trunk-based-development/)
- Atlassian — [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) ("a legacy Git workflow… fallen in popularity in favor of trunk-based workflows")
- Paul Hammant et al. — [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/)
- Martin Fowler — [Patterns for Managing Source Code Branches](https://martinfowler.com/articles/branching-patterns.html)
- Pete Hodgson (martinfowler.com) — [Feature Toggles (aka Feature Flags)](https://martinfowler.com/articles/feature-toggles.html)
- Google Engineering Practices — [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html)
- Vercel Docs — [Environments](https://vercel.com/docs/deployments/environments) · [Promoting Deployments](https://vercel.com/docs/deployments/promoting-a-deployment)
- Conventional Commits — [conventionalcommits.org](https://www.conventionalcommits.org/)
