/**
 * Canonical responsive breakpoints (px) — the single source of truth.
 * CSS media queries can't read `var()` in their condition, so the literal px
 * also live in the *.module.css files; keep both in sync if these change.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Mobile-first media query (enhances upward) for a given breakpoint. */
export const mediaUp = (bp: Breakpoint) => `(width >= ${BREAKPOINTS[bp]}px)`;
