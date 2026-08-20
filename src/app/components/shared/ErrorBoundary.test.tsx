import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

const ThrowError = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  it("renders children normally", () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("renders fallback UI when a child throws", () => {
    // Suppress console.error for the expected error
    const spy = vi.spyOn(console, "error");
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("shows reload button", () => {
    const spy = vi.spyOn(console, "error");
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const button = screen.getByRole("button", { name: /reload page/i });
    expect(button).toBeInTheDocument();

    spy.mockRestore();
  });
});
