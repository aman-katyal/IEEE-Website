import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input aria-label="test-input" />);
    expect(screen.getByLabelText("test-input")).toBeInTheDocument();
  });

  it("applies placeholder correctly", () => {
    render(<Input placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("handles value changes", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="input" />);
    const input = screen.getByLabelText("input");
    
    await user.type(input, "Hello World");
    expect(input).toHaveValue("Hello World");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled aria-label="disabled-input" />);
    expect(screen.getByLabelText("disabled-input")).toBeDisabled();
  });

  it("applies the correct type attribute", () => {
    render(<Input type="password" aria-label="password-input" />);
    expect(screen.getByLabelText("password-input")).toHaveAttribute("type", "password");
  });

  it("applies custom class names", () => {
    render(<Input className="custom-input" aria-label="input" />);
    expect(screen.getByLabelText("input")).toHaveClass("custom-input");
  });
});
