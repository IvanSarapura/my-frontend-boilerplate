// Stub for the `server-only` import used by modules that must not be bundled
// into client code (see src/lib/env.server.ts, src/i18n/dictionaries.ts).
//
// Next.js provides `server-only` internally at build time and Webpack/Turbopack
// resolve it via their own aliases. Standalone Vite (used by Vitest) does not
// know about that resolution, so we alias `server-only` to this empty stub in
// vitest.config.ts. The real package would throw if reached from a client
// bundle — under tests we want server modules to be importable directly.
export {};
