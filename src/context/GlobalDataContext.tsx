import { createContext, useContext, type ReactNode } from "react";
import { useSiteSettings, useCommittees } from "../hooks/useSanityData";

type GlobalDataContextValue = {
  siteSettings: ReturnType<typeof useSiteSettings>;
  committeesData: ReturnType<typeof useCommittees>;
};

const defaultValue: GlobalDataContextValue = {
  siteSettings: {
    settings: undefined,
    loading: true,
    error: null,
    refetch: () => Promise.resolve(),
  },
  committeesData: {
    committees: [],
    loading: true,
    error: null,
    refetch: () => Promise.resolve(),
  }
};

const GlobalDataContext = createContext<GlobalDataContextValue>(defaultValue);

export function GlobalDataProvider({ children }: { children: ReactNode }) {
  const siteSettings = useSiteSettings();
  const committeesData = useCommittees();

  return (
    <GlobalDataContext.Provider value={{ siteSettings, committeesData }}>
      {children}
    </GlobalDataContext.Provider>
  );
}

export function useGlobalData(): GlobalDataContextValue {
  return useContext(GlobalDataContext);
}
