// ─── Committee Data Barrel File ─────────────────────────────────
// Re-exports all committee data from JSON content files.
// Import from this file: import { committees, getCommitteeById } from "../../data/committees";

import type { Committee, CornerstoneCommittee } from "./types";

import aescData from "../content/committees/aesc.json";
import csocietyData from "../content/committees/csociety.json";
import embsData from "../content/committees/embs.json";
import mttsData from "../content/committees/mtts.json";
import racingData from "../content/committees/racing.json";
import rovData from "../content/committees/rov.json";
import smcData from "../content/committees/smc.json";
import softwareSaturdaysData from "../content/committees/software-saturdays.json";
import edsData from "../content/committees/eds.json";
import cornerstoneData from "../content/cornerstone.json";

console.log("AESC Data:", aescData);
console.log("Committees Data Loaded:", [
  aescData, csocietyData, embsData, mttsData, racingData, rovData, smcData, softwareSaturdaysData, edsData
]);
console.log("Cornerstone Data:", cornerstoneData);

/** All technical committees */
export const committees: Committee[] = [
  aescData as Committee,
  csocietyData as Committee,
  embsData as Committee,
  mttsData as Committee,
  racingData as Committee,
  rovData as Committee,
  smcData as Committee,
  softwareSaturdaysData as Committee,
  edsData as Committee,
];

/** Look up a committee by its URL slug */
export function getCommitteeById(id: string) {
  return committees.find((c) => c.id === id);
}

/** Cornerstone (support) committees */
export const cornerstoneCommittees = cornerstoneData.groups as CornerstoneCommittee[];
