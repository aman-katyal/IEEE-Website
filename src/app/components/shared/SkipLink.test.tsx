import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkipLink } from "./SkipLink";

describe("SkipLink Component", () => {
  it("renders with default target and accessible label", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#main-content");
    expect(link).toHaveClass("sr-only");
    expect(link).toHaveClass("focus:not-sr-only");
  });

  it("supports custom target IDs and labels for internal sub-navigation", () => {
    render(
      <SkipLink targetId="#committee-details" label="Skip to committee info" />
    );
    const link = screen.getByRole("link", { name: /skip to committee info/i });
    expect(link).toHaveAttribute("href", "#committee-details");
  });
});
