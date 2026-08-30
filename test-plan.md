1. **Move Router Configuration out of `main.tsx`**
   - Create a new file `src/app/router.tsx` to hold the router configuration and all the lazy-loaded page components.
   - The issue `react-refresh/only-export-components` occurs because `main.tsx` doesn't export any components. It performs the root render, which breaks React Fast Refresh if there are local components defined (like the lazy-loaded pages).
   - Moving the router (and `lazyWithRetry`) to a separate file `src/app/router.tsx` that exports the `router` will resolve the Fast Refresh warning in `main.tsx`.

2. **Update `src/main.tsx`**
   - Import `router` from `./app/router` instead of creating it in `main.tsx`.
   - Remove the definitions for `lazyWithRetry` and all the `lazyWithRetry` components.
   - Remove the `window.addEventListener("vite:preloadError")` from `main.tsx` as it should be with the router/lazy loading logic in `src/app/router.tsx`.

3. **Verify the change**
   - Run `npx eslint src/main.tsx` and `npx eslint src/app/router.tsx` to ensure the warnings are gone.
   - Run tests to make sure everything works properly.

4. **Complete pre-commit steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

5. **Submit Pull Request**
   - Submit the PR with the required title and description format.
