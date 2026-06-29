/**
 * Single source of truth for the routes exercised by the E2E suite. Specs
 * compose their own page sets from these so a route rename is one edit, not a
 * sweep across files.
 */
export const ROUTES = {
  home: '/en',
  homeEs: '/es',
  examples: '/en/examples',
  minimal: '/en/examples/minimal',
  marketing: '/en/examples/marketing',
  appShell: '/en/examples/app-shell',
  contact: '/en/contact',
  contactEs: '/es/contact',
  posts: '/en/posts',
} as const;
