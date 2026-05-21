/**
 * Semantic `staleTime` constants for TanStack Query.
 *
 * Centralizing these values prevents magic-number drift across the codebase
 * (one author writing `60 * 1000`, another `60_000`, another `1 * 60 * 1000`)
 * and makes the intent of each query explicit at the call site:
 *
 *   useQuery({ queryKey, queryFn, staleTime: STALE_TIMES.STATIC })
 *
 * reads as "this data is static" rather than "this data has staleTime
 * Infinity for some forgotten reason".
 *
 * Pick the lowest tier that still matches reality — over-caching hides
 * mutations from the UI.
 */
export const STALE_TIMES = {
  /** Refetch on every mount / window-focus / reconnect. Real-time data. */
  LIVE: 0,

  /** Default for interactive UI data (comments, lists, search results). */
  INTERACTIVE: 60_000,

  /** Long-lived but eventually mutable (user preferences, dashboards). */
  LONG: 5 * 60_000,

  /**
   * Truly static data: i18n catalogs, taxonomies, enums, country lists,
   * config that only changes on deploy. Never considered stale; invalidate
   * explicitly via `queryClient.invalidateQueries` when needed.
   */
  STATIC: Number.POSITIVE_INFINITY,
} as const;

export type StaleTimeKey = keyof typeof STALE_TIMES;
