// ─── Purdue IEEE Leadership Data ────────────────────────────────
// Edit this file to update leadership/contact info across the site.

export interface Leader {
  role: string;
  name: string;
  email: string;
  /** Optional image URL — replace placeholders with real photos */
  image?: string;
  committees?: string;
}

export const leaders: Leader[] = [
  {
    name: "Al Sultanbek",
    role: "President",
    committees: "SMC",
    email: "asultanb@purdue.edu",
  },
  {
    name: "Aiyan Alam",
    role: "Vice President of Operations",
    committees: "SMC, EMBS",
    email: "alam31@purdue.edu",
  },
  {
    name: "Max Vallone",
    role: "Vice President of Technical Committees",
    committees: "SMC",
    email: "mvallone@purdue.edu",
  },
  {
    name: "Aman Katyal",
    role: "Vice President of Member Involvement",
    committees: "ROV",
    email: "katyal0@purdue.edu",
  },
  {
    name: "Daniel Ng",
    role: "Secretary",
    committees: "SMC",
    email: "ng205@purdue.edu",
  },
  {
    name: "Saishri Bagde",
    role: "Head of Business Development",
    committees: "SMC",
    email: "sbagde@purdue.edu",
  },
  {
    name: "Jonathon Reilly",
    role: "Head of Infrastructure",
    committees: "AESS",
    email: "reilly53@purdue.edu",
  },
  {
    name: "Shidan Wan",
    role: "Head of Public Relations",
    committees: "ROV",
    email: "wan166@purdue.edu",
  },
  {
    name: "Su Park",
    role: "Head of Events",
    committees: "SMC",
    email: "park1784@purdue.edu",
  },
  {
    name: "Soumil Verma",
    role: "Head of Learning",
    committees: "Learning, SMC",
    email: "verma178@purdue.edu",
  },
  {
    name: "Tarakanath Peddi",
    role: "Lead Treasurer",
    committees: "Racing",
    email: "tpeddi@purdue.edu",
  },
  {
    name: "Dishan Bhattacharya",
    role: "Treasurer",
    committees: "Learning, Industrial Relations",
    email: "bhatt123@purdue.edu",
  },
  {
    name: "Mason Fleming",
    role: "EMBS Chair",
    committees: "EMBS",
    email: "fleminn@purdue.edu",
  },
  {
    name: "Ryan Wans",
    role: "MTT-S Chair",
    committees: "MTT-S",
    email: "wansr@purdue.edu",
  },
  {
    name: "Sia Gupta",
    role: "Chair of Racing",
    committees: "Racing",
    email: "gupta952@purdue.edu",
  },
  {
    name: "Rhea Virk",
    role: "ROV Captain",
    committees: "ROV",
    email: "rvirk@purdue.edu",
  },
  {
    name: "Lee Haglid",
    role: "Chair of SMC",
    committees: "SMC",
    email: "haglid@purdue.edu",
  },
  {
    name: "Jonah Femrite",
    role: "AESS Chair",
    committees: "AESS, SMC",
    email: "jfemrite@purdue.edu",
  },
  {
    name: "Aniket Iyer",
    role: "CSociety Chair",
    committees: "CSociety",
    email: "iyer185@purdue.edu",
  },
  {
    name: "Ryan Baker",
    role: "Software Saturdays Chair",
    committees: "Software Saturdays",
    email: "baker852@purdue.edu",
  },
];
