# Implementation Plan: Performance and Snappiness Optimization

This plan outlines the steps to optimize the Purdue IEEE website's performance, focusing on custom cursor smoothness, Sanity data fetching, and scrolling performance.

## Phase 1: Custom Cursor Optimization
Goal: Eliminate cursor lag and reduce main-thread overhead.

- [ ] Task: Red Phase - Write failing tests for Cursor performance (latency/frame drops)
    - [ ] Create `src/app/components/ui/CustomCursor.test.tsx`
    - [ ] Define tests to check for lag and excessive re-renders
- [ ] Task: Green Phase - Implement optimized CustomCursor
    - [ ] Refactor `CustomCursor.tsx` to use `useAnimationFrame` or optimized `onMouseMove` with `transform`
    - [ ] Ensure cursor uses `will-change: transform` and `pointer-events: none`
- [ ] Task: Refactor and Verify Coverage
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Custom Cursor Optimization' (Protocol in workflow.md)

## Phase 2: Sanity Data Fetching & Caching
Goal: Improve perceived load speed and reduce network latency.

- [ ] Task: Red Phase - Write failing tests for Sanity fetching and caching
    - [ ] Create tests for `src/app/hooks/useSanityData.ts` to verify caching logic
    - [ ] Define tests for skeleton states in committee pages
- [ ] Task: Green Phase - Implement Skeleton Loaders
    - [ ] Create `Skeleton` components in `src/app/components/ui/`
    - [ ] Integrate skeletons into `CommitteeDetail` and `Leadership` pages
- [ ] Task: Green Phase - Implement Client-side Caching & Prefetching
    - [ ] Update `useSanityData.ts` to include a simple in-memory cache
    - [ ] Implement a prefetching strategy for high-priority routes in `App.tsx` or `Link` components
- [ ] Task: Refactor and Verify Coverage
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Sanity Data Fetching & Caching' (Protocol in workflow.md)

## Phase 3: Runtime & Scrolling Smoothness
Goal: Ensure 60fps scrolling and fast image delivery.

- [ ] Task: Red Phase - Write failing tests/benchmarks for scrolling and lazy loading
    - [ ] Define tests to verify images have `loading="lazy"`
    - [ ] Benchmarking scroll performance on heavy pages
- [ ] Task: Green Phase - Implement GPU Acceleration & Lazy Loading
    - [ ] Audit components for `will-change` opportunities
    - [ ] Ensure all `<img>` tags use `loading="lazy"` and proper `width`/`height` attributes
    - [ ] Use `framer-motion`'s `layout` prop judiciously to avoid layout thrashing
- [ ] Task: Refactor and Verify Coverage
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Runtime & Scrolling Smoothness' (Protocol in workflow.md)

## Phase 4: Final Verification & Audit
Goal: Ensure all performance targets are met.

- [ ] Task: Conduct Final Performance Audit
    - [ ] Run Lighthouse audits on all major pages
    - [ ] Verify Core Web Vitals targets (LCP, CLS, INP)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification & Audit' (Protocol in workflow.md)
