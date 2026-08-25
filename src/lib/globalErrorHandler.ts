/**
 * Global Unhandled Rejection and Error Logging Handler
 * Captures unhandled promise rejections and uncaught errors in production safely.
 */

type ErrorListener = (error: Error, isUnhandledRejection: boolean) => void;

const listeners: Set<ErrorListener> = new Set();
let initialized = false;

export function addGlobalErrorListener(listener: ErrorListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function dispatchGlobalError(error: Error, isUnhandledRejection = false): void {
  for (const listener of listeners) {
    try {
      listener(error, isUnhandledRejection);
    } catch {
      // Ignore errors within listeners to prevent cascades
    }
  }
}

export function initGlobalErrorHandler(): () => void {
  if (typeof window === 'undefined' || initialized) {
    return () => {};
  }

  initialized = true;

  const handleRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const error = reason instanceof Error ? reason : new Error(String(reason || 'Unhandled Promise Rejection'));
    dispatchGlobalError(error, true);
  };

  const handleError = (event: ErrorEvent) => {
    const error = event.error instanceof Error ? event.error : new Error(event.message || 'Uncaught runtime error');
    dispatchGlobalError(error, false);
  };

  window.addEventListener('unhandledrejection', handleRejection);
  window.addEventListener('error', handleError);

  return () => {
    window.removeEventListener('unhandledrejection', handleRejection);
    window.removeEventListener('error', handleError);
    listeners.clear();
    initialized = false;
  };
}
