import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAsyncAction } from './useAsyncAction';

describe('useAsyncAction', () => {
  it('manages loading state and returns result on success', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success_data');
    const { result } = renderHook(() => useAsyncAction(asyncFn));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    let output: string | null = null;
    await act(async () => {
      output = await result.current.execute();
    });

    expect(output).toBe('success_data');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('captures errors and resets loading state when async operation fails', async () => {
    const failureError = new Error('Network failed');
    const asyncFn = vi.fn().mockRejectedValue(failureError);
    const { result } = renderHook(() => useAsyncAction(asyncFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(failureError);
  });
});
