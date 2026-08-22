/**
 * Web Vitals Telemetry Logger (LCP, CLS, INP / FID).
 * Monitors Core Web Vitals and logs performance health scores.
 */

export interface WebVitalMetric {
  name: 'CLS' | 'LCP' | 'INP' | 'FID';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export type WebVitalCallback = (metric: WebVitalMetric) => void;

export function getVitalRating(name: WebVitalMetric['name'], value: number): WebVitalMetric['rating'] {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'INP':
    case 'FID':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
  }
}

/**
 * Initializes performance observers for Core Web Vitals telemetry.
 */
export function initWebVitals(onMetric?: WebVitalCallback): () => void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  const observers: PerformanceObserver[] = [];

  const handleMetric = (name: WebVitalMetric['name'], value: number) => {
    const metric: WebVitalMetric = {
      name,
      value: Math.round(value * 100) / 100,
      rating: getVitalRating(name, value),
    };
    if (onMetric) {
      onMetric(metric);
    }
  };

  // 1. Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        handleMetric('LCP', lastEntry.startTime);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.push(lcpObserver);
  } catch (e) {}

  // 2. Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value || 0;
          handleMetric('CLS', clsValue);
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    observers.push(clsObserver);
  } catch (e) {}

  // 3. First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0] as PerformanceEventTiming;
      if (firstInput) {
        const fid = firstInput.processingStart - firstInput.startTime;
        handleMetric('FID', fid);
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
    observers.push(fidObserver);
  } catch (e) {}

  return () => {
    observers.forEach((obs) => obs.disconnect());
  };
}
