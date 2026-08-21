import { urlFor } from "./sanity";

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpg" | "png";
  fit?: "crop" | "fill" | "clip" | "scale";
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
  if (options?.format) {
    builder = builder.format(options.format);
  } else {
    builder = builder.auto("format");
  }

  return builder.url();
}

/**
 * Appends query parameters to a Sanity CDN URL safely without causing double-question-mark bugs.
 */
export function appendSanityUrlParams(
  url: string,
  params: Record<string, string | number>
): string {
  if (!url) return "";
  const [base, existingQuery] = url.split("?");
  const searchParams = new URLSearchParams(existingQuery || "");

  Object.entries(params).forEach(([key, val]) => {
    searchParams.set(key, String(val));
  });

  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
}
