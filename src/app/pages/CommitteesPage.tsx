import { Committees } from "../components/committees/Committees";
import { CornerstoneCommittees } from "../components/committees/CornerstoneCommittees";
import { JoinCTA } from "../components/home/JoinCTA";
import { useEffect } from "react";

export function CommitteesPage() {
  // Ensure we start at the top of the page on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: "40px", background: "var(--boiler-black)" }}>
      <Committees />
      <CornerstoneCommittees />
      <JoinCTA />
    </div>
  );
}
