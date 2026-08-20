import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { CommitteeProjects } from "./CommitteeProjects";
import type { CommitteeSection } from "../../../data/committees/types";

describe("CommitteeProjects Component", () => {
  const mockSections: CommitteeSection[] = [
    {
      type: "projects",
      title: "Featured Robots",
      items: [
        {
          name: "X18 Narwhal",
          description: "Compact autonomous underwater vehicle for MATE 2024.",
          longDescription: "Detailed breakdown of X18 Narwhal hull design, thrusters, and autonomous navigation suite.",
          flagship: true,
          image: "https://example.com/narwhal.jpg",
          url: "https://purdueieee.org/rov/narwhal",
          tags: ["ROS2", "CAD", "PCB"],
        },
        {
          name: "Mini ROV",
          description: "Educational mini ROV for outreach workshops.",
          flagship: false,
          image: "https://example.com/minirov.jpg",
          tags: ["Outreach"],
        },
      ],
    },
  ];

  it("renders project cards with name, short description, and flagship badges", () => {
    render(
      <CommitteeProjects
        sections={mockSections}
        loading={false}
        isLight={false}
      />
    );

    expect(screen.getByText("X18 Narwhal")).toBeInTheDocument();
    expect(screen.getByText("Mini ROV")).toBeInTheDocument();
    expect(
      screen.getByText("Compact autonomous underwater vehicle for MATE 2024.")
    ).toBeInTheDocument();
    expect(screen.getByText(/Flagship/i)).toBeInTheDocument();
    expect(screen.getByText("ROS2")).toBeInTheDocument();
  });

  it("opens scrollable detail modal with longDescription and external link on card click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CommitteeProjects
        sections={mockSections}
        loading={false}
        isLight={false}
      />
    );

    const card = screen.getByText("X18 Narwhal");
    await user.click(card);

    // Modal should now display the longDescription
    expect(
      screen.getByText(/Detailed breakdown of X18 Narwhal hull design/i)
    ).toBeInTheDocument();

    // Modal should render external page CTA opening in a new tab
    const openPageBtn = screen.getByRole("link", { name: /Open Project Page/i });
    expect(openPageBtn).toBeInTheDocument();
    expect(openPageBtn).toHaveAttribute("href", "https://purdueieee.org/rov/narwhal");
    expect(openPageBtn).toHaveAttribute("target", "_blank");
    expect(openPageBtn).toHaveAttribute("rel", "noopener noreferrer");

    // Modal dialog content should have scrollable classes
    const dialogContent = container.parentElement?.querySelector("[data-slot='dialog-content']");
    expect(dialogContent).toHaveClass("max-h-[85vh]");
    expect(dialogContent).toHaveClass("overflow-y-auto");
  });

  it("falls back to short description in modal when longDescription is omitted", async () => {
    const user = userEvent.setup();
    render(
      <CommitteeProjects
        sections={mockSections}
        loading={false}
        isLight={false}
      />
    );

    const card = screen.getByText("Mini ROV");
    await user.click(card);

    expect(
      screen.getAllByText("Educational mini ROV for outreach workshops.").length
    ).toBeGreaterThan(0);
  });
});
