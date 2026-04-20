// ─── Purdue IEEE Leadership Data ────────────────────────────────
// Interface for Leader data.

export interface Leader {
  _id: string;
  role: string;
  name: string;
  email: string;
  category?: string;
  /** Optional image URL */
  image?: string;
  committees?: string;
}
