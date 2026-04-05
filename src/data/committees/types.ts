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

export interface ImageStyle {
  crop?: boolean; // true = cover, false = contain
  size?: "small" | "medium" | "large" | "full";
}

export interface JoinConfig {
  /** 
   * 'default' -> Links to /join
   * 'link' -> Links to a custom URL (Discord, etc.)
   * 'message' -> Shows a text message instead of a button
   */
  type: "default" | "link" | "message";
  buttonText?: string;
  url?: string;
  message?: string;
}

export interface Metric {
  label: string;
  value: string | number;
}

export type CommitteeSection = 
  | { type: "text"; title: string; content: string; image?: any; layout?: "top" | "left" | "right"; imageStyle?: ImageStyle }
  | { type: "projects"; title: string; items: (CommitteeProject & { image?: any })[]; imageStyle?: ImageStyle }
  | { type: "gallery"; title: string; items: GalleryItem[] }
  | { type: "faq"; title: string; items: FAQ[] }
  | { type: "cta"; title: string; content: string; buttonText: string; buttonLink: string }
  | { type: "contact"; title: string; name: string; email: string; role?: string };

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
  image: any;
  
  /** Dynamic metrics (e.g. Members: 40, Founded: 2010) */
  metrics?: Metric[];

  tags: string[];
  chair: string;
  email: string;

  // ── Join Button Configuration ──
  joinConfig?: JoinConfig;

  // ── Flexible Content Sections ──
  sections?: CommitteeSection[];

  // ── Legacy/Optional fields ──
  projects?: CommitteeProject[];
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
