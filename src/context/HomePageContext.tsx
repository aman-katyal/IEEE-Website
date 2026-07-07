import { createContext, useContext, type ReactNode } from "react";
import { useHomePage } from "../hooks/useSanityData";

// ─── Type mirrors the return shape of useHomePage ─────────────────
type HomePageContextValue = ReturnType<typeof useHomePage>;

const defaultValue: HomePageContextValue = {
  data: null,
  loading: true,
  error: null,
  refetch: () => Promise.resolve(),
};

const HomePageContext = createContext<HomePageContextValue>(defaultValue);

/**
 * Provide homePage Sanity data once at the page level.
 * All descendant components call useHomePageData() instead of
 * calling useHomePage() independently, eliminating redundant
 * hook subscriptions for the same GROQ query.
 */
export function HomePageProvider({ children }: { children: ReactNode }) {
  const value = useHomePage();
  return (
    <HomePageContext.Provider value={value}>
      {children}
    </HomePageContext.Provider>
  );
}

export function useHomePageData(): HomePageContextValue {
  return useContext(HomePageContext);
}
