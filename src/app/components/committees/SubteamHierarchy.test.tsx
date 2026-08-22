import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SubteamHierarchy, type Subteam } from "./SubteamHierarchy";

describe("SubteamHierarchy Component", () => {
  const subteams: Subteam[] = [
    {
      id: "mech",
      name: "Mechanical & Chassis",
      leadName: "Alex Vance",
      description: "Designs water-tight chassis, thruster mounts, and robotic manipulators.",
      meetingTime: "Wednesdays 6:00 PM",
      focusAreas: ["SolidWorks", "CNC Machining", "FEA Analysis"],
    },
    {
      id: "elec",
      name: "Electrical & Power",
      leadName: "Morgan Chen",
      description: "Develops custom motor driver PCBs and battery management systems.",
      meetingTime: "Thursdays 7:00 PM",
      focusAreas: ["Altium Designer", "Battery Management", "CAN Bus"],
    },
  ];

  it("renders subteams and toggles expandable section", () => {
    render(<SubteamHierarchy subteams={subteams} />);

    expect(screen.getByText("Subteams & Technical Focus")).toBeInTheDocument();
    expect(screen.getByText("Mechanical & Chassis")).toBeInTheDocument();
    expect(screen.getByText("Electrical & Power")).toBeInTheDocument();

    const elecToggle = screen.getByRole("button", { name: /Electrical & Power/i });
    fireEvent.click(elecToggle);

    expect(
      screen.getByText(/Develops custom motor driver PCBs/i)
    ).toBeInTheDocument();
  });
});
