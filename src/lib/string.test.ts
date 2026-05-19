import { describe, expect, it } from 'vitest';

import { truncate } from './string';

describe('truncate', () => {
  it('returns the original string when shorter than max', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string when exactly max length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('breaks on the nearest preceding whitespace and appends an ellipsis', () => {
    expect(truncate('the quick brown fox jumps', 15)).toBe('the quick brown…');
  });

  it('falls back to hard cut when no whitespace fits within max', () => {
    expect(truncate('supercalifragilisticexpialidocious', 10)).toBe(
      'supercalif…',
    );
  });

  it('returns the original string when max is zero or negative', () => {
    expect(truncate('hello', 0)).toBe('hello');
    expect(truncate('hello', -5)).toBe('hello');
  });

  it('trims trailing whitespace before the ellipsis', () => {
    expect(truncate('one two   three', 6)).toBe('one…');
  });
});
