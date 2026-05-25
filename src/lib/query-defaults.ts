// Semantic `staleTime` tiers for TanStack Query. Use the lowest tier that
// matches reality — over-caching hides mutations from the UI.
export const STALE_TIMES = {
  /** Refetch on every mount / window-focus / reconnect. Real-time data. */
  LIVE: 0,

  /** Default for interactive UI data (comments, lists, search results). */
  INTERACTIVE: 60_000,

  /** Long-lived but eventually mutable (user preferences, dashboards). */
  LONG: 5 * 60_000,

  /** Changes only on deploy (i18n catalogs, enums). Invalidate explicitly. */
  STATIC: Number.POSITIVE_INFINITY,
} as const;

export type StaleTimeKey = keyof typeof STALE_TIMES;
