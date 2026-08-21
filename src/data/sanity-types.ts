export interface Leader {
  _id: string;
  role: string;
  name: string;
  email: string;
  category?: string;
  image?: string;
  committees?: string;
  order?: number;
}

export interface LeaderReference {
  _id: string;
}

export interface OfficersConfig {
  executiveOrder?: LeaderReference[];
  technicalOrder?: LeaderReference[];
  operationsOrder?: LeaderReference[];
  memberOrder?: LeaderReference[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  prefix?: string;
}

export interface HomePageData {
  _id?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  aboutTitle?: string;
  aboutContent?: string;
  aboutImage?: string;
  stats?: StatItem[];
  hqLocation?: string;
  discordMembers?: string;
  campusLocation?: string;
}

export interface AboutSectionData {
  _key?: string;
  eyebrow?: string;
  title?: string;
  content?: string;
  image?: string;
  layout?: "normal" | "reversed" | string;
  colorTheme?: "gold" | string;
}

export interface TimelineMilestone {
  _key?: string;
  year: string;
  title: string;
  category?: string;
  description: string;
  isGoldAccent?: boolean;
}

export interface AboutPageData {
  _id?: string;
  quote?: {
    text?: string;
    author?: string;
    authorTitle?: string;
  };
  quoteAuthor?: string;
  quoteAuthorTitle?: string;
  timeline?: TimelineMilestone[];
  sections?: AboutSectionData[];
}
