import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PreviewBanner } from "./PreviewBanner";
import { MemoryRouter, Route, Routes } from "react-router";

describe("PreviewBanner Component", () => {
  it("renders banner when preview query parameter is present", () => {
    render(
      <MemoryRouter initialEntries={["/?preview=true"]}>
        <Routes>
          <Route path="/" element={<PreviewBanner />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Live Preview Mode Active/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /exit preview/i })).toBeInTheDocument();
  });

  it("does not render banner when preview query parameter is absent", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<PreviewBanner />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText(/Live Preview Mode Active/i)).not.toBeInTheDocument();
  });
});
