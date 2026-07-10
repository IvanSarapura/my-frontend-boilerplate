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

Report privately through GitHub's **Private Vulnerability Reporting**: open the
repository's [**Security** tab → **Report a vulnerability**][report], which
creates a private advisory visible only to you and the maintainers. Include:

- A description of the issue and its impact.
- Steps to reproduce or a proof of concept.
- Affected files, routes, or dependencies if known.

We aim to acknowledge reports within **3 working days** and to agree on a
remediation timeline once the report is triaged.

[report]: https://github.com/IvanSarapura/my-frontend-boilerplate/security/advisories/new

> **Adopting this boilerplate?** Enable Private Vulnerability Reporting on your
> fork (Settings → Code security → _Private vulnerability reporting_) and update
> the link above to point at your repository before going public.

## Scope Notes

- Dependency vulnerabilities are gated in CI via `npm audit` (high+) and the
  Dependency Review action — report anything those miss.
- If you spot a committed credential, treat it as compromised: rotate it
  first, then report.
