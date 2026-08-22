import { urlFor } from "./sanity";

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpg" | "png";
  fit?: "crop" | "fill" | "clip" | "scale";
  blur?: number;
}

/**
 * Builds an optimized image URL using the Sanity image pipeline.
 */
export function urlForImage(
  source: any,
  options?: ImageTransformOptions
): string {
  if (!source) return "";

  let builder = urlFor(source);

  if (options?.width) builder = builder.width(options.width);
  if (options?.height) builder = builder.height(options.height);
  if (options?.quality) builder = builder.quality(options.quality);
  if (options?.fit) builder = builder.fit(options.fit);
  if (options?.blur) builder = builder.blur(options.blur);
  if (options?.format) {
    builder = builder.format(options.format);
  } else {
    builder = builder.auto("format");
  }

  return builder.url();
}

/**
 * Appends query parameters to a Sanity CDN URL safely without causing double-question-mark bugs,
 * and sorts query keys for deterministic edge cache key normalization.
 */
export function appendSanityUrlParams(
  url: string,
  params: Record<string, string | number | undefined | null>
): string {
  if (!url) return "";
  const [base, existingQuery] = url.split("?");
  const searchParams = new URLSearchParams(existingQuery || "");

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      searchParams.set(key, String(val));
    }
  });

  // Sort query parameters alphabetically for edge cache hit normalization
  searchParams.sort();

  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
}

/**
 * Pure immutable builder for Sanity image CDN URLs with normalized parameters.
 */
export function buildSanityImageUrl(
  baseCdnUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!baseCdnUrl) return "";

  const params: Record<string, string | number | undefined> = {
    w: options.width,
    h: options.height,
    q: options.quality,
    fit: options.fit,
    blur: options.blur,
    fm: options.format,
    auto: options.format ? undefined : "format",
  };

  return appendSanityUrlParams(baseCdnUrl, params);
}

/**
 * Generates a responsive srcset string with deterministic width descriptors for Sanity image CDN URLs.
 */
export function generateSanitySrcSet(
  baseCdnUrl: string,
  widths: number[] = [480, 768, 1024, 1440, 1920]
): string {
  if (!baseCdnUrl) return "";

  return widths
    .map((w) => `${buildSanityImageUrl(baseCdnUrl, { width: w, quality: 80 })} ${w}w`)
    .join(", ");
}

