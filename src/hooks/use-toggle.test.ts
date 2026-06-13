import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useToggle } from './use-toggle';

describe('useToggle', () => {
  it('returns false as default initial value', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('returns the provided initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('toggles the value when toggle() is called', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
    act(() => result.current[1]());
    expect(result.current[0]).toBe(false);
  });

  it('sets value directly via setValue()', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[2](true));
    expect(result.current[0]).toBe(true);
    act(() => result.current[2](false));
    expect(result.current[0]).toBe(false);
  });
});
