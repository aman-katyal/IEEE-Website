import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OfficeHoursSection } from "./OfficeHoursSection";
import type { OfficeHoursData } from "../../../data/sanity-types";

describe("OfficeHoursSection Component", () => {
  const sampleSlots: OfficeHoursData[] = [
    {
      _id: "oh-1",
      officerName: "Jane Doe",
      role: "President",
      dayOfWeek: "Tuesday",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      location: "BHEE 014",
      email: "president@purdueieee.org",
    },
  ];

  it("renders office hours slots when populated", () => {
    render(<OfficeHoursSection officeHours={sampleSlots} />);

    expect(screen.getByText(/Officer Office Hours/i)).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("2:00 PM – 4:00 PM")).toBeInTheDocument();
    expect(screen.getByText("BHEE 014")).toBeInTheDocument();
  });

  it("renders null when office hours array is empty or undefined", () => {
    const { container } = render(<OfficeHoursSection officeHours={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
