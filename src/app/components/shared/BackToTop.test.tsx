import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BackToTop } from "./BackToTop";

describe("BackToTop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("does not render when scroll is at top (scrollY <= 300)", () => {
    window.scrollY = 0;
    render(<BackToTop />);
    expect(screen.queryByRole("button", { name: /back to top/i })).not.toBeInTheDocument();
  });

  it("renders when scrollY > 300 and scrolls to top when clicked", () => {
    window.scrollY = 500;
    render(<BackToTop />);

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
