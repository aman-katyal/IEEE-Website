import type { CornerstoneCommittee } from "./types";

export const cornerstoneCommittees: CornerstoneCommittee[] = [
  {
    id: "operations",
    name: "Operations",
    description:
      "Manages logistics, infrastructure (servers/websites), and accounting for the organization.",
    leads: [
      { role: "Infrastructure", name: "Jonathon Reilly", email: "infrastructure@purdueieee.org" },
      { role: "Treasurer", name: "Tarakanath Peddi", email: "treas@purdueieee.org" },
    ],
  },
  {
    id: "member-involvement",
    name: "Member Involvement",
    description:
      "Handles social media (Public Relations), organizes club-wide events, and runs technical workshops (Learning Committee).",
    leads: [
      { role: "Events", name: "Su Park", email: "events@purdueieee.org" },
      { role: "Learning", name: "Soumil Verma", email: "learning@purdueieee.org" },
      { role: "Public Relations", name: "Shidan Wan", email: "social@purdueieee.org" },
    ],
  },
];
