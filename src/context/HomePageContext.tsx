import { createContext, useContext } from "react";
import { useHomePage } from "../hooks/useSanityData";

// ─── Type mirrors the return shape of useHomePage ─────────────────
export type HomePageContextValue = ReturnType<typeof useHomePage>;

const defaultValue: HomePageContextValue = {
  data: null,
  loading: true,
  error: null,
  refetch: (() => Promise.resolve({} as any)) as any,
};

export const HomePageContext = createContext<HomePageContextValue>(defaultValue);

export function useHomePageData(): HomePageContextValue {
  return useContext(HomePageContext);
}
