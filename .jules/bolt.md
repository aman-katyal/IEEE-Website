## 2023-11-20 - Localized State in BentoHero Hover
**Learning:** In React, lifting state that updates very frequently (like hover interactions) to the top level of a large component tree (like the BentoHero which includes massive images and nested UI elements) forces the entire tree to re-render, creating noticeable lag and CPU usage. The derived states depending on large arrays also get recalculated every time unless memoized.
**Action:** Always localize high-frequency state (hover/scroll/mouse positions) into small, isolated wrapper components. If computing complex arrays, `useMemo` is crucial when dealing with potential re-renders.

## 2024-05-18 - React Rendering in Interactive Hero Components
**Learning:** In interactive hero components with complex layouts (like `BentoHero`), frequently changing state (e.g., hover states on individual items) can trigger full re-renders. If these renders recalculate complex arrays or objects (like mapping over a list of committees to build `RackSlot`s), it causes unnecessary memory allocation and performance degradation.
**Action:** Always memoize derived data arrays (using `useMemo`) that are generated from props or stable data sources when the component relies on high-frequency state updates like hover or scroll.

## 2026-07-25 - Magnetic Components MouseMove Reflow Optimization
**Learning:** Frequent calls to `getBoundingClientRect()` within rapid event handlers like `onMouseMove` cause severe performance degradation due to forced synchronous reflows. Caching the layout measurements on `onMouseEnter` is an effective optimization strategy for hover-based interactions.
**Action:** Always cache bounding box coordinates during entry events (`onMouseEnter`, `onDragStart`) and reuse the cached dimensions during rapid continuous events (`onMouseMove`, `onDrag`) to prevent forced layout thrashing.
