import { describe, it, expect, vi } from "vitest";
import { escapeCsvCell, generateCsvString, downloadCsvFile } from "./csvUtils";

describe("csvUtils", () => {
  describe("escapeCsvCell", () => {
    it("wraps string in quotes", () => {
      expect(escapeCsvCell("hello")).toBe('"hello"');
    });

    it("escapes quotes inside cell", () => {
      expect(escapeCsvCell('hello "world"')).toBe('"hello ""world"""');
    });

    it("handles commas and newlines", () => {
      expect(escapeCsvCell("a,b")).toBe('"a,b"');
      expect(escapeCsvCell("a\nb")).toBe('"a\nb"');
    });

    it("handles null and undefined", () => {
      expect(escapeCsvCell(null)).toBe('""');
      expect(escapeCsvCell(undefined)).toBe('""');
    });
  });

  describe("generateCsvString", () => {
    it("generates formatted CSV with CRLF line endings", () => {
      const headers = ["Name", "Amount"];
      const rows = [
        ["Supplies", 150.5],
        ["Robotics Kits", 450],
      ];
      const csv = generateCsvString(headers, rows);
      expect(csv).toBe('"Name","Amount"\r\n"Supplies","150.5"\r\n"Robotics Kits","450"');
    });
  });

  describe("downloadCsvFile", () => {
    it("creates an anchor and triggers download", () => {
      const createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
      const revokeObjectURL = vi.fn();
      vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

      downloadCsvFile("test_export", ["Header"], [["Value"]]);

      expect(clickSpy).toHaveBeenCalled();
      expect(createObjectURL).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");

      clickSpy.mockRestore();
      vi.restoreAllMocks();
    });
  });
});
