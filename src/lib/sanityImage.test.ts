import { describe, it, expect } from "vitest";
import { appendSanityUrlParams, urlForImage, buildSanityImageUrl, generateSanitySrcSet } from "./sanityImage";

describe("sanityImage", () => {
  describe("appendSanityUrlParams", () => {
    it("appends query parameters to a clean URL with sorted keys for cache normalization", () => {
      const result = appendSanityUrlParams(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg",
        { w: 1400, fit: "crop" }
      );
      // fit should precede w when sorted
      expect(result).toBe(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg?fit=crop&w=1400"
      );
    });

    it("safely merges with existing query parameters without double question marks", () => {
      const result = appendSanityUrlParams(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg?w=800",
        { w: 1400, q: 80 }
      );
      expect(result).toBe(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg?q=80&w=1400"
      );
    });

    it("returns empty string for empty input", () => {
      expect(appendSanityUrlParams("", { w: 100 })).toBe("");
    });

    it("ignores undefined and null parameter values", () => {
      const result = appendSanityUrlParams(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg",
        { w: 800, h: undefined, q: null }
      );
      expect(result).toBe("https://cdn.sanity.io/images/proj/dataset/img.jpg?w=800");
    });
  });

  describe("buildSanityImageUrl", () => {
    it("builds normalized CDN URL with automatic format and dimensions", () => {
      const url = buildSanityImageUrl("https://cdn.sanity.io/images/proj/dataset/img.jpg", {
        width: 600,
        height: 400,
        quality: 85,
      });
      expect(url).toBe(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg?auto=format&h=400&q=85&w=600"
      );
    });

    it("supports explicit format and blur options", () => {
      const url = buildSanityImageUrl("https://cdn.sanity.io/images/proj/dataset/img.jpg", {
        format: "webp",
        blur: 50,
      });
      expect(url).toBe(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg?blur=50&fm=webp"
      );
    });

    it("returns empty string when base URL is empty", () => {
      expect(buildSanityImageUrl("")).toBe("");
    });
  });

  describe("generateSanitySrcSet", () => {
    it("generates comma-separated srcset with width descriptors", () => {
      const srcset = generateSanitySrcSet(
        "https://cdn.sanity.io/images/proj/dataset/img.jpg",
        [480, 1024]
      );
      expect(srcset).toContain("480w");
      expect(srcset).toContain("1024w");
      expect(srcset).toContain("w=480");
      expect(srcset).toContain("w=1024");
    });

    it("returns empty string for empty base url", () => {
      expect(generateSanitySrcSet("")).toBe("");
    });
  });
});
