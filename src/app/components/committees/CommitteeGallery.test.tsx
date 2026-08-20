import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CommitteeGallery } from "./CommitteeGallery";
import type { CommitteeSection } from "../../../data/committees/types";

describe("CommitteeGallery", () => {
  const mockSections: CommitteeSection[] = [
    {
      type: "gallery",
      title: "Projects & Builds",
      items: [
        {
          image: "https://example.com/robot.jpg",
          caption: "Undersea ROV Vehicle 2026",
          name: "ROV Prototype",
        },
        {
          image: "https://example.com/chassis.jpg",
          caption: "Chassis Assembly",
        },
      ],
    },
  ];

  it("renders gallery images with explicit dimensions and lazy loading", () => {
    render(
      <CommitteeGallery
        sections={mockSections}
        loading={false}
        isLight={false}
      />
    );

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);

    expect(images[0]).toHaveAttribute("src", "https://example.com/robot.jpg");
    expect(images[0]).toHaveAttribute("alt", "Undersea ROV Vehicle 2026");
    expect(images[0]).toHaveAttribute("width", "400");
    expect(images[0]).toHaveAttribute("height", "400");
    expect(images[0]).toHaveAttribute("loading", "lazy");
    expect(images[0]).toHaveAttribute("decoding", "async");
  });

  it("opens modal dialog on image click", () => {
    render(
      <CommitteeGallery
        sections={mockSections}
        loading={false}
        isLight={false}
      />
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("returns null when sections is empty", () => {
    const { container } = render(
      <CommitteeGallery sections={[]} loading={false} isLight={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
