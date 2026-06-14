# Wireframe presets — reference only, safe to delete

These pages are **example starting points**, not part of the shipped app:

- **`/[locale]/examples`** — index listing the three presets.
- **`minimal/`** — centered hero, no chrome (coming-soon / single-screen apps).
- **`marketing/`** — sticky navbar + hero + feature grid + CTA band + footer.
- **`app-shell/`** — header + sidebar + content region (dashboard base).

They are excluded from `sitemap.ts` and carry `robots: { index: false }`, so they
never reach search engines.

## How to use

1. Open the presets in the browser (`/en/examples`) and pick one.
2. Copy its `page.tsx` (+ its `.module.css`) into your real route — e.g. the home
   page at `src/app/[locale]/page.tsx`.
3. Adapt the copy (it reads from `src/i18n/messages/*.json`) and swap the `Acme`
   placeholder brand.
4. **Delete this entire `examples/` folder.** No code imports it, so removal keeps
   `build`, `typecheck` and `lint` green. One runtime link points here: the demo
   home (`src/app/[locale]/page.tsx`) wires its **"Get started"** CTA to
   `/[locale]/examples`. Repoint or remove that CTA when you delete this folder
   (you'll be replacing the demo home anyway), or it 404s.

All presets are built only from the shared primitives in `@/components/layouts`,
`@/components/blocks` and `@/components/ui` — no preset-specific components.
