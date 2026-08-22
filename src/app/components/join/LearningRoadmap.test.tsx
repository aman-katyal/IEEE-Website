import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LearningRoadmap } from "./LearningRoadmap";

describe("LearningRoadmap Component", () => {
  it("renders roadmap stages and switches active stage on click", () => {
    render(<LearningRoadmap />);

    expect(screen.getByText("Freshman to Leader Roadmap")).toBeInTheDocument();
    expect(screen.getAllByText("Callouts & Discovery").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Foundations & Workshops/i })).toBeInTheDocument();

    const workshopStepBtn = screen.getByRole("button", { name: /Foundations & Workshops/i });
    fireEvent.click(workshopStepBtn);

    expect(
      screen.getByText(/Participate in beginner-friendly hands-on workshops/i)
    ).toBeInTheDocument();
  });
});
