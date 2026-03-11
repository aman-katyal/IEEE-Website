// ─── Committee Data Types ───────────────────────────────────────
// Shared interfaces used by every committee data file.

export interface CommitteeProject {
  name: string;
  description: string;
}

export interface GalleryItem {
  src: string;
  caption: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface CustomSection {
  title: string;
  /** Supports plain text or markdown-like content */
  content: string;
}

export interface Committee {
  /** URL slug — used in routes like /committee/rov */
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string;
  status: string;
  statusColor: string;
  statusBg: string;
  image: string;
  members: number;
  founded: string;
  awards: number;
  tags: string[];
  chair: string;
  email: string;
  projects: CommitteeProject[];

  // ── Optional extended fields (add these per-committee as needed) ──
  gallery?: GalleryItem[];
  faqs?: FAQ[];
  recruitmentInfo?: string;
  meetingSchedule?: string;
  socialLinks?: SocialLink[];
  customSections?: CustomSection[];
}

// Cornerstone (support) committees — shown separately on the site
export interface CornerstoneCommittee {
  id: string;
  name: string;
  description: string;
  leads: { role: string; name: string; email: string; description?: string }[];
}
