import { describe, it, expect } from "vitest";
import { appendSanityUrlParams, urlForImage } from "./sanityImage";

describe("sanityImage", () => {
  describe("appendSanityUrlParams", () => {
    it("appends query parameters to a clean URL", () => {
      const result = appendSanityUrlParams(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg",
        { w: 1400, fit: "crop" }
      );
      expect(result).toBe(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg?w=1400&fit=crop"
      );
    });

    it("safely merges with existing query parameters without double question marks", () => {
      const result = appendSanityUrlParams(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg?w=800",
        { w: 1400, q: 80 }
      );
      expect(result).toBe(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg?w=1400&q=80"
      );
    });

    it("returns empty string for empty input", () => {
      expect(appendSanityUrlParams("", { w: 100 })).toBe("");
    });
  });

  describe("urlForImage", () => {
    it("returns empty string for null source", () => {
      expect(urlForImage(null)).toBe("");
    });
  });
});
