import { describe, expect, it } from 'vitest';

import { getPaginationRange } from './get-pagination-range';

describe('getPaginationRange', () => {
  it('returns an empty list when totalPages is 0', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 0 })).toEqual([]);
  });

  it('returns [1] when totalPages is 1', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 1 })).toEqual([1]);
  });

  it('returns all pages without ellipsis when the total fits the visible threshold', () => {
    expect(getPaginationRange({ currentPage: 3, totalPages: 5 })).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it('extends the visible window when currentPage is near the start', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 10 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      10,
    ]);
  });

  it('extends the visible window when currentPage is near the end', () => {
    expect(getPaginationRange({ currentPage: 10, totalPages: 10 })).toEqual([
      1,
      'ellipsis',
      6,
      7,
      8,
      9,
      10,
    ]);
  });

  it('places ellipsis on both sides when currentPage is in the middle', () => {
    expect(getPaginationRange({ currentPage: 5, totalPages: 10 })).toEqual([
      1,
      'ellipsis',
      4,
      5,
      6,
      'ellipsis',
      10,
    ]);
  });

  it('honors custom siblingCount in the middle', () => {
    expect(
      getPaginationRange({ currentPage: 10, totalPages: 20, siblingCount: 2 }),
    ).toEqual([1, 'ellipsis', 8, 9, 10, 11, 12, 'ellipsis', 20]);
  });

  it('honors custom boundaryCount', () => {
    expect(
      getPaginationRange({ currentPage: 10, totalPages: 20, boundaryCount: 2 }),
    ).toEqual([1, 2, 'ellipsis', 9, 10, 11, 'ellipsis', 19, 20]);
  });

  it('returns adjacent pages without ellipsis when totalPages is 2', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 2 })).toEqual([
      1, 2,
    ]);
  });

  it('handles boundaryCount larger than totalPages', () => {
    expect(
      getPaginationRange({ currentPage: 1, totalPages: 2, boundaryCount: 2 }),
    ).toEqual([1, 2]);
  });
});
