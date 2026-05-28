/**
 * Shared prop types for the layout primitives (Stack / Cluster / Grid).
 * `Gap` exposes a curated subset of the --space scale (not the full 1..16) to
 * keep the API small and rhythm-friendly instead of eight near-identical steps.
 */
export type Gap = 2 | 4 | 6 | 8;

/** Max columns for `<Grid>` on desktop (`lg`). */
export type Cols = 2 | 3 | 4;
