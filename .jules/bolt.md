## 2024-07-30 - Precision Timing for Caching
**Learning:** `Date.now()` is subject to system clock adjustments and is less accurate for calculating intervals/elapsed time than `performance.now()`, which is monotonic and precise to sub-millisecond ranges.
**Action:** Always prefer `performance.now()` over `Date.now()` when calculating cache expiration intervals, measuring elapsed time, or benchmarking, especially in browser or performance-sensitive environments.

## 2023-11-20 - Localized State in BentoHero Hover
**Learning:** In React, lifting state that updates very frequently (like hover interactions) to the top level of a large component tree (like the BentoHero which includes massive images and nested UI elements) forces the entire tree to re-render, creating noticeable lag and CPU usage. The derived states depending on large arrays also get recalculated every time unless memoized.
**Action:** Always localize high-frequency state (hover/scroll/mouse positions) into small, isolated wrapper components. If computing complex arrays, `useMemo` is crucial when dealing with potential re-renders.

## 2024-05-18 - React Rendering in Interactive Hero Components
**Learning:** In interactive hero components with complex layouts (like `BentoHero`), frequently changing state (e.g., hover states on individual items) can trigger full re-renders. If these renders recalculate complex arrays or objects (like mapping over a list of committees to build `RackSlot`s), it causes unnecessary memory allocation and performance degradation.
**Action:** Always memoize derived data arrays (using `useMemo`) that are generated from props or stable data sources when the component relies on high-frequency state updates like hover or scroll.

## 2026-07-25 - Magnetic Components MouseMove Reflow Optimization
**Learning:** Frequent calls to `getBoundingClientRect()` within rapid event handlers like `onMouseMove` cause severe performance degradation due to forced synchronous reflows. Caching the layout measurements on `onMouseEnter` is an effective optimization strategy for hover-based interactions.
**Action:** Always cache bounding box coordinates during entry events (`onMouseEnter`, `onDragStart`) and reuse the cached dimensions during rapid continuous events (`onMouseMove`, `onDrag`) to prevent forced layout thrashing.

## 2024-05-18 - Hoisting Static Data in React
**Learning:** Defining static arrays or configuration objects (like default lists or category mapping) inside a React component body forces the JavaScript engine to allocate new memory on every single render. This triggers frequent Garbage Collection (GC) pauses and negatively impacts rendering performance.
**Action:** Always move static arrays and objects (that do not depend on props or component state) completely out of the component function's body into the file's outer scope. Use UPPER_SNAKE_CASE for these constants to clearly distinguish them.

## 2026-08-06 - Array Search Inside Sort Callback (O(N^2) Bottleneck)
**Learning:** Using `Array.prototype.indexOf` inside an `Array.prototype.sort` callback creates an O(N^2) complexity bottleneck, because `indexOf` performs a linear search on every comparison.
**Action:** Always pre-compute a lookup table (e.g., using a `Map`) before the sort operation. A `Map.get()` lookup inside the sort callback takes O(1) time, reducing the overall sorting complexity to an efficient O(N log N).

## 2026-08-10 - Synchronous Scroll Blocking
**Learning:** Binding scroll event listeners without `{ passive: true }` blocks the main thread from scrolling the page until the event handler completes, causing jank and layout thrashing, especially when components update layout state on scroll.
**Action:** Always add `{ passive: true }` to `addEventListener('scroll')` to allow the browser to scroll smoothly independently of script execution.

## 2026-08-26 - Optimize Map Access in Tight Loops
**Learning:** Using `Map.has(key)` followed by `Map.get(key)` inside tight loops (like `sort` or `map` callbacks) performs redundant hash lookups, doubling overhead.
**Action:** Always prefer a single `Map.get(key) ?? fallback` to halve the number of hash lookups and improve performance.

## 2026-08-29 - Optimize Array Filter and Reduce
**Learning:** Chaining `.filter(...).reduce(...)` multiple times over the same array to calculate distinct totals performs redundant array traversals, resulting in O(3N) operations instead of O(N). In performance-critical hooks like finance dashboards, this can cause unnecessary calculation overhead.
**Action:** Replace multiple chained array passes over the same dataset with a single `for...of` loop or a single `.reduce()` that aggregates all the necessary variables in one O(N) pass.
## 2024-10-24 - Cache Intl.NumberFormat
**Learning:** Instantiating `Intl.NumberFormat` repeatedly is a huge performance bottleneck.
**Action:** Cache the `Intl.NumberFormat` instances globally when using standard locales and options. The cache key should correspond to variable parameters (e.g., decimals).
