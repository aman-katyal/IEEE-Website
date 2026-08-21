import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { usePageMeta } from "./usePageMeta";

describe("usePageMeta", () => {
  beforeEach(() => {
    document.title = "Purdue University IEEE Student Branch";
  });

  it("updates document.title on mount and restores on unmount", () => {
    const { unmount } = renderHook(() =>
      usePageMeta({ title: "Committees" })
    );
    expect(document.title).toBe("Committees | Purdue IEEE");

    unmount();
    expect(document.title).toBe("Purdue University IEEE Student Branch");
  });

  it("sets meta description if provided", () => {
    const { unmount } = renderHook(() =>
      usePageMeta({
        title: "About Us",
        description: "Learn about the Purdue IEEE team.",
      })
    );
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute("content")).toBe(
      "Learn about the Purdue IEEE team."
    );

    unmount();
  });
});
