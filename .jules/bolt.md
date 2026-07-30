## 2024-07-30 - Precision Timing for Caching
**Learning:** `Date.now()` is subject to system clock adjustments and is less accurate for calculating intervals/elapsed time than `performance.now()`, which is monotonic and precise to sub-millisecond ranges.
**Action:** Always prefer `performance.now()` over `Date.now()` when calculating cache expiration intervals, measuring elapsed time, or benchmarking, especially in browser or performance-sensitive environments.

## 2024-05-18 - Avoid unnecessary array maps in React Render

**Learning:** When generating a layout inside a mapping array function that performs heavy filtering and sorting like `getOrderedLeaders` in `OfficersPage`, it's best to hoist static constants out of the component scope and use `useMemo` to precompute the dictionary before mapping, thus avoiding `O(N)` heavy operations on every render.

**Action:** When finding complex filter/sort inside `.map()` arrays in render paths, evaluate if a single pass reduction utilizing `useMemo` mapping categories to leaders is possible to avoid the computation bottleneck, and ensure static constants used by the `useMemo` are hoisted outside the component to satisfy ESLint hooks.
