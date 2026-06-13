import { describe, expect, it } from 'vitest';

import { getInitials } from './get-initials';

describe('getInitials', () => {
  it('returns "?" for empty or undefined input', () => {
    expect(getInitials()).toBe('?');
    expect(getInitials('')).toBe('?');
    expect(getInitials('   ')).toBe('?');
  });

  it('returns the first letter for a single-word name', () => {
    expect(getInitials('Ada')).toBe('A');
    expect(getInitials('grace')).toBe('G');
  });

  it('returns first + last letter for multi-word names', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL');
    expect(getInitials('Margaret Hamilton')).toBe('MH');
  });

  it('uses first and last words when there are 3+ tokens', () => {
    expect(getInitials('Mary Jane Watson')).toBe('MW');
    expect(getInitials('Jean Luc Picard')).toBe('JP');
  });

  it('handles extra whitespace gracefully', () => {
    expect(getInitials('  Ada   Lovelace  ')).toBe('AL');
  });

  it('uppercases the result', () => {
    expect(getInitials('ada lovelace')).toBe('AL');
  });

  it('takes whole grapheme clusters, not broken UTF-16 halves', () => {
    // Emoji (surrogate pair): charAt(0) would return a lone surrogate.
    expect(getInitials('😀 Smith')).toBe('😀S');
    // Base letter + combining acute accent (U+0301): the mark stays attached.
    expect(getInitials('éllen')).toBe('É');
    // ZWJ emoji sequence: the full family cluster, not a split fragment.
    expect(getInitials('👨‍👩‍👧 Family')).toBe('👨‍👩‍👧F');
    // Regional-indicator flag: two code points, one grapheme.
    expect(getInitials('🇫🇷 France')).toBe('🇫🇷F');
  });
});
