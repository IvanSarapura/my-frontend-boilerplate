// One module-level Segmenter (construction isn't free). granularity 'grapheme'
// groups surrogate pairs, combining marks and ZWJ sequences into one unit, so
// the initial is never a broken half-character.
const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: 'grapheme',
});

function firstGrapheme(value: string): string {
  for (const { segment } of graphemeSegmenter.segment(value)) return segment;
  return '';
}

export function getInitials(name?: string | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  // filter(Boolean) guarantees non-empty parts.
  const first = firstGrapheme(parts[0]!);
  const last = parts.length > 1 ? firstGrapheme(parts[parts.length - 1]!) : '';
  return (first + last).toUpperCase();
}
