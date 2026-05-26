# Security Policy

## Supported Versions

This is a boilerplate template; security fixes land on `main`. Projects
generated from it should track `main` and rebase periodically to pick up
patches.

| Version | Supported                     |
| ------- | ----------------------------- |
| `main`  | ✅                            |
| tags    | ❌ (snapshots — no backports) |

## Reporting a Vulnerability

**Do not open a public issue for security problems.**

Report privately to the maintainer (see the contact below). Include:

- A description of the issue and its impact.
- Steps to reproduce or a proof of concept.
- Affected files, routes, or dependencies if known.

We aim to acknowledge reports within **3 working days** and to agree on a
remediation timeline once the report is triaged.

> **Maintainer contact:** replace this line with your team's private channel
> or the maintainer email before sharing the repo.

## Scope Notes

- Dependency vulnerabilities are gated in CI via `npm audit` (high+) and the
  Dependency Review action — report anything those miss.
- If you spot a committed credential, treat it as compromised: rotate it
  first, then report.
