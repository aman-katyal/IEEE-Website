import { type ReactNode } from "react";
import { useHomePage } from "../hooks/useSanityData";
import { HomePageContext } from "./HomePageContext";

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
