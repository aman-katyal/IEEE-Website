import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNetworkSync } from './useNetworkSync';

describe('useNetworkSync', () => {
  it('initializes with current navigator.onLine state', () => {
    const { result } = renderHook(() => useNetworkSync());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.wasOffline).toBe(false);
    expect(result.current.revalidateCount).toBe(0);
  });

  it('triggers onReconnect and updates state when browser goes online', () => {
    const onReconnectMock = vi.fn();
    const onDisconnectMock = vi.fn();

    const { result } = renderHook(() =>
      useNetworkSync({
        onReconnect: onReconnectMock,
        onDisconnect: onDisconnectMock,
      })
    );

    // Simulate going offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.wasOffline).toBe(true);
    expect(onDisconnectMock).toHaveBeenCalledTimes(1);

    // Simulate coming back online
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.revalidateCount).toBe(1);
    expect(onReconnectMock).toHaveBeenCalledTimes(1);
  });

  it('cleans up event listeners on unmount', () => {
    const onReconnectMock = vi.fn();
    const { unmount } = renderHook(() => useNetworkSync({ onReconnect: onReconnectMock }));

    unmount();

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(onReconnectMock).not.toHaveBeenCalled();
  });
});
