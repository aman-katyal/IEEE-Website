import { describe, it, expect } from "vitest";
import { parseReceiptText } from "./ocrUtils";

describe("parseReceiptText OCR Extraction Suite", () => {
  it("extracts vendor, total amount, and date from DigiKey receipt text", () => {
    const rawOcr = `
      DIGIKEY ELECTRONICS
      Invoice #10928374
      Date: 2026-03-15
      Sold To: Purdue University IEEE
      
      Item 1: STM32 Nucleo Board - $25.00
      Item 2: Jumper Wires 100pk - $12.50
      Shipping: $7.50
      
      TOTAL: $45.00
      Payment Method: VISA **** 1234
    `;

    const data = parseReceiptText(rawOcr);
    expect(data.vendorName).toBe("DigiKey");
    expect(data.totalAmount).toBe(45.00);
    expect(data.transactionDate).toBe("2026-03-15");
    expect(data.confidence).toBeGreaterThan(0.7);
  });

  it("handles empty or garbage OCR text gracefully", () => {
    const data = parseReceiptText("");
    expect(data.confidence).toBe(0);
    expect(data.vendorName).toBeUndefined();
    expect(data.totalAmount).toBeUndefined();
  });
});
