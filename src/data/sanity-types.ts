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

export interface AlumniCompany {
  _key?: string;
  name: string;
  domain?: string;
  roleOrField?: string;
}

export interface HomePageData {
  _id?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  aboutTitle?: string;
  aboutContent?: string;
  stats?: StatItem[];
  alumniCompanies?: AlumniCompany[];
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

export interface OfficeHoursData {
  _id: string;
  officerName: string;
  role: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  startTime: string;
  endTime: string;
  location: string;
  email?: string;
  notes?: string;
}

export interface JoinStep {
  _key?: string;
  icon?: "users" | "credit-card" | "calendar" | "check" | string;
  title: string;
  description: string;
}

export interface DuesOption {
  _key?: string;
  name: string;
  subtitle?: string;
  price: string;
}

export interface JoinPageData {
  _id?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  steps?: JoinStep[];
  connectTitle?: string;
  connectDescription?: string;
  discordButtonText?: string;
  discordUrl?: string;
  duesTitle?: string;
  duesDescription?: string;
  duesBenefits?: string[];
  membershipYearTitle?: string;
  duesOptions?: DuesOption[];
  paymentButtonText?: string;
  paymentUrl?: string;
  paymentSearchNote?: string;
  exemptionNote?: string;
}


