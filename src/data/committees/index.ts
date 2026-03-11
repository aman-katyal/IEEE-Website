// ─── Committee Data Barrel File ─────────────────────────────────
// Re-exports all committee data from individual files.
// Import from this file: import { committees, getCommitteeById } from "../../data/committees";

export type { Committee, CommitteeProject, GalleryItem, FAQ, SocialLink, CustomSection, CornerstoneCommittee } from "./types";

import aesc from "./aesc";
import csociety from "./csociety";
import embs from "./embs";
import mtts from "./mtts";
import racing from "./racing";
import rov from "./rov";
import smc from "./smc";
import softwareSaturdays from "./software-saturdays";
import eds from "./eds";

/** All technical committees */
export const committees = [
  aesc,
  csociety,
  embs,
  mtts,
  racing,
  rov,
  smc,
  softwareSaturdays,
  eds,
] as const;

/** Look up a committee by its URL slug */
export function getCommitteeById(id: string) {
  return committees.find((c) => c.id === id);
}

/** Cornerstone (support) committees */
export { cornerstoneCommittees } from "./cornerstone";
