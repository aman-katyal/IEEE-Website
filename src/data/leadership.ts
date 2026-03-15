// ─── Purdue IEEE Leadership Data ────────────────────────────────
// This file now imports data from leadership.json to support Decap CMS.

import leadershipData from "./leadership.json";

export interface Leader {
  role: string;
  name: string;
  email: string;
  /** Optional image URL — replace placeholders with real photos */
  image?: string;
  committees?: string;
}

export const leaders: Leader[] = leadershipData.leaders as Leader[];
