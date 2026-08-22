import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LabToolSafetyGuide } from "./LabToolSafetyGuide";

describe("LabToolSafetyGuide Component", () => {
  it("renders equipment list and filters by clearance level", () => {
    render(<LabToolSafetyGuide />);

    expect(screen.getByText("Equipment & Lab Safety Clearance Guide")).toBeInTheDocument();
    expect(screen.getByText("Digital Multimeter & Oscilloscope")).toBeInTheDocument();
    expect(screen.getByText("Tormach CNC Mill & Lathe")).toBeInTheDocument();

    const lvl4Btn = screen.getByRole("button", { name: "Level 4" });
    fireEvent.click(lvl4Btn);

    expect(screen.getByText("Tormach CNC Mill & Lathe")).toBeInTheDocument();
    expect(screen.queryByText("Digital Multimeter & Oscilloscope")).not.toBeInTheDocument();
  });
});
