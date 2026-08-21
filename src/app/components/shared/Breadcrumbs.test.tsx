import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders home link and breadcrumb items with structured data", () => {
    const items = [
      { label: "Committees", href: "/committees" },
      { label: "Remotely Operated Vehicles" },
    ];

    const { container } = render(
      <MemoryRouter>
        <Breadcrumbs items={items} />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Committees")).toBeInTheDocument();
    expect(screen.getByText("Remotely Operated Vehicles")).toBeInTheDocument();

    const currentItem = screen.getByText("Remotely Operated Vehicles");
    expect(currentItem).toHaveAttribute("aria-current", "page");

    // Check JSON-LD script
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    const data = JSON.parse(script?.innerHTML || "{}");
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toHaveLength(3);
  });
});
