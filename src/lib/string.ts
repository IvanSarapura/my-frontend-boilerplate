/**
 * Truncate a string to at most `max` characters, breaking on the nearest
 * preceding whitespace so words are not cut mid-character. When truncation
 * happens, an ellipsis (`…`) is appended.
 *
 * Returns the original string when it fits, the original when `max` is zero
 * or negative (no work to do), and an ellipsis-terminated word-aligned slice
 * otherwise.
 */
export function truncate(str: string, max: number): string {
  if (max <= 0 || str.length <= max) return str;

  // If `max` already lands on a word boundary (next char is whitespace), keep
  // the full slice — no mid-word cut is happening, so no backtracking needed.
  if (/\s/.test(str.charAt(max))) {
    return `${str.slice(0, max).trimEnd()}…`;
  }

  const slice = str.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  // `lastSpace === 0` means the only space sits at index 0 (leading whitespace
  // before one long word). No useful word-boundary exists, so fall back to a
  // hard cut at `max`.
  const cutAt = lastSpace > 0 ? lastSpace : max;
  return `${slice.slice(0, cutAt).trimEnd()}…`;
}
