/**
 * Truncate to at most `max` characters on a word boundary, appending `…`.
 * Returns the original string when it fits or when `max <= 0`.
 */
export function truncate(str: string, max: number): string {
  if (max <= 0 || str.length <= max) return str;

  // `max` already lands on whitespace — no mid-word cut, no backtracking.
  if (/\s/.test(str.charAt(max))) {
    return `${str.slice(0, max).trimEnd()}…`;
  }

  const slice = str.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  // No usable word boundary (only leading space) → hard cut at `max`.
  const cutAt = lastSpace > 0 ? lastSpace : max;
  return `${slice.slice(0, cutAt).trimEnd()}…`;
}
