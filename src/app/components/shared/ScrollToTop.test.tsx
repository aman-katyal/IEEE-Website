import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ScrollToTop } from "./ScrollToTop";

describe("ScrollToTop", () => {
  it("calls window.scrollTo(0, 0) on mount", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockRestore();
  });

  it("returns null (renders nothing to the DOM)", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { container } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
    vi.restoreAllMocks();
  });
});
