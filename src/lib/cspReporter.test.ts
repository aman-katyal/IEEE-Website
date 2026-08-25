import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initCSPReporter, addCSPViolationListener } from './cspReporter';

describe('cspReporter', () => {
  let cleanup: () => void;

  beforeEach(() => {
    cleanup = initCSPReporter();
  });

  afterEach(() => {
    cleanup();
  });

  it('notifies listeners when securitypolicyviolation event is dispatched', () => {
    const listener = vi.fn();
    const unsubscribe = addCSPViolationListener(listener);

    const event = new Event('securitypolicyviolation') as SecurityPolicyViolationEvent;
    Object.defineProperty(event, 'blockedURI', { value: 'https://evil.com/script.js' });
    Object.defineProperty(event, 'violatedDirective', { value: 'script-src' });
    Object.defineProperty(event, 'originalPolicy', { value: "default-src 'self'" });
    Object.defineProperty(event, 'disposition', { value: 'enforce' });

    document.dispatchEvent(event);

    expect(listener).toHaveBeenCalledWith({
      blockedURI: 'https://evil.com/script.js',
      violatedDirective: 'script-src',
      originalPolicy: "default-src 'self'",
      disposition: 'enforce',
    });

    unsubscribe();
  });
});
