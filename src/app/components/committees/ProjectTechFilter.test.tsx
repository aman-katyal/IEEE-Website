import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProjectTechFilter } from "./ProjectTechFilter";

describe("ProjectTechFilter Component", () => {
  const allTags = ["ROS2", "C++", "Altium", "Computer Vision", "Python"];

  it("renders all technology tag buttons with active toggle support", () => {
    const onToggle = vi.fn();
    const onClear = vi.fn();

    render(
      <ProjectTechFilter
        allTags={allTags}
        selectedTags={["ROS2"]}
        onToggleTag={onToggle}
        onClearTags={onClear}
      />
    );

    expect(screen.getByText("Filter by Technology")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset (1)" })).toBeInTheDocument();

    const ros2Btn = screen.getByRole("button", { name: "ROS2" });
    expect(ros2Btn).toHaveAttribute("aria-pressed", "true");

    const cppBtn = screen.getByRole("button", { name: "C++" });
    expect(cppBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(cppBtn);
    expect(onToggle).toHaveBeenCalledWith("C++");

    const resetBtn = screen.getByRole("button", { name: "Reset (1)" });
    fireEvent.click(resetBtn);
    expect(onClear).toHaveBeenCalled();
  });
});
