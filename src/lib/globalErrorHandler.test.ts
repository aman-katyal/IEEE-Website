import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  initGlobalErrorHandler,
  addGlobalErrorListener,
  dispatchGlobalError,
} from './globalErrorHandler';

describe('globalErrorHandler', () => {
  let cleanup: () => void;

  beforeEach(() => {
    cleanup = initGlobalErrorHandler();
  });

  afterEach(() => {
    cleanup();
  });

  it('notifies registered listeners when dispatchGlobalError is called', () => {
    const listener = vi.fn();
    const unsubscribe = addGlobalErrorListener(listener);

    const testError = new Error('Test production error');
    dispatchGlobalError(testError, true);

    expect(listener).toHaveBeenCalledWith(testError, true);
    unsubscribe();
  });

  it('safely handles unregistering listener via cleanup return function', () => {
    const listener = vi.fn();
    const unsubscribe = addGlobalErrorListener(listener);

    unsubscribe();
    dispatchGlobalError(new Error('After unsubscribe'));

    expect(listener).not.toHaveBeenCalled();
  });
});
