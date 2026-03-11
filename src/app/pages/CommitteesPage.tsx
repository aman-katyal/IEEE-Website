import { Committees } from "../components/Committees";
import { CornerstoneCommittees } from "../components/CornerstoneCommittees";
import { JoinCTA } from "../components/JoinCTA";
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
