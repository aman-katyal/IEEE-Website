/**
 * Content Security Policy Violation Logger & Telemetry Helper
 */

export interface CSPViolationData {
  blockedURI: string;
  violatedDirective: string;
  originalPolicy: string;
  disposition: string;
}

type ViolationListener = (violation: CSPViolationData) => void;
const listeners: Set<ViolationListener> = new Set();
let initialized = false;

export function addCSPViolationListener(listener: ViolationListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function initCSPReporter(): () => void {
  if (typeof window === 'undefined' || initialized) return () => {};

  initialized = true;

  const handleViolation = (event: SecurityPolicyViolationEvent) => {
    const data: CSPViolationData = {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      disposition: event.disposition,
    };

    for (const listener of listeners) {
      try {
        listener(data);
      } catch {
        // Ignore listener failures
      }
    }
  };

  document.addEventListener('securitypolicyviolation', handleViolation);

  return () => {
    document.removeEventListener('securitypolicyviolation', handleViolation);
    listeners.clear();
    initialized = false;
  };
}
