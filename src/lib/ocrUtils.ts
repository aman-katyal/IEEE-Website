/**
 * Receipt OCR Text Parser & Heuristic Extraction Utility.
 * Extracts vendor name, transaction date, and total amount from receipt OCR text.
 */

export interface ExtractedReceiptData {
  vendorName?: string;
  totalAmount?: number;
  transactionDate?: string; // YYYY-MM-DD
  confidence: number; // 0 to 1
}

const KNOWN_VENDORS = [
  "DigiKey",
  "Mouser Electronics",
  "McMaster-Carr",
  "Amazon",
  "SparkFun",
  "Adafruit",
  "Home Depot",
  "Target",
  "Best Buy",
  "Micro Center",
  "PCBWay",
  "JLCPCB",
  "Oshpark",
  "SendCutSend",
];

/**
 * Parses raw text from a receipt OCR scan to auto-fill reimbursement vouchers.
 */
export function parseReceiptText(text: string): ExtractedReceiptData {
  if (!text || typeof text !== "string") {
    return { confidence: 0 };
  }

  let vendorName: string | undefined;
  let totalAmount: number | undefined;
  let transactionDate: string | undefined;
  let score = 0;

  // 1. Detect Vendor
  for (const vendor of KNOWN_VENDORS) {
    const regex = new RegExp(`\\b${vendor}\\b`, "i");
    if (regex.test(text)) {
      vendorName = vendor;
      score += 0.35;
      break;
    }
  }

  if (!vendorName) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      vendorName = lines[0].slice(0, 40);
      score += 0.15;
    }
  }

  // 2. Detect Total Amount
  const totalMatches = text.match(/(?:total|amount due|grand total|balance due|charged)[^\d$]*\$?\s*([0-9]+(?:\.[0-9]{2}))/i);
  if (totalMatches && totalMatches[1]) {
    totalAmount = parseFloat(totalMatches[1]);
    score += 0.4;
  } else {
    // Fallback: search for dollar amounts and take the maximum reasonable amount
    const anyAmounts = Array.from(text.matchAll(/\$\s*([0-9]+(?:\.[0-9]{2}))/g)).map((m) =>
      parseFloat(m[1])
    );
    if (anyAmounts.length > 0) {
      totalAmount = Math.max(...anyAmounts);
      score += 0.2;
    }
  }

  // 3. Detect Date
  // Formats: MM/DD/YYYY, YYYY-MM-DD, MM-DD-YYYY
  const dateMatch = text.match(/\b(202[0-9][-/.](?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12][0-9]|3[01]))\b/) ||
                    text.match(/\b((?:0[1-9]|1[0-2])[-/.](?:0[1-9]|[12][0-9]|3[01])[-/.](?:202[0-9]|2[0-9]))\b/);

  if (dateMatch && dateMatch[1]) {
    try {
      const parsed = new Date(dateMatch[1]);
      if (!isNaN(parsed.getTime())) {
        transactionDate = parsed.toISOString().split("T")[0];
        score += 0.25;
      }
    } catch (e) {}
  }

  return {
    vendorName,
    totalAmount,
    transactionDate,
    confidence: Math.min(Math.round(score * 100) / 100, 1),
  };
}
