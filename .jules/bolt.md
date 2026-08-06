## 2024-07-30 - Precision Timing for Caching
**Learning:** `Date.now()` is subject to system clock adjustments and is less accurate for calculating intervals/elapsed time than `performance.now()`, which is monotonic and precise to sub-millisecond ranges.
**Action:** Always prefer `performance.now()` over `Date.now()` when calculating cache expiration intervals, measuring elapsed time, or benchmarking, especially in browser or performance-sensitive environments.
