import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CornerstoneCommittees } from "./CornerstoneCommittees";
import { useCornerstoneCommittees } from "../../../hooks/useSanityData";

vi.mock("../../../hooks/useSanityData", () => ({
  useCornerstoneCommittees: vi.fn(),
}));

const mockCommittees = [
  {
    id: "involvement",
    name: "Involvement Team",
    description: "Helps with involvement.",
    leads: [
      {
        role: "Involvement Chair",
        name: "Alice",
        description: "Alice desc",
        email: "alice@example.com",
      },
    ],
  },
  {
    id: "operations",
    name: "Operations Team",
    description: "Handles operations.",
    leads: [
      {
        role: "Ops Chair",
        name: "Bob",
        description: "Bob desc",
        email: "bob@example.com",
      },
    ],
  },
];

describe("CornerstoneCommittees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state when loading is true", () => {
    vi.mocked(useCornerstoneCommittees).mockReturnValue({
      committees: [],
      loading: true,
      error: null,
    });

    const { container } = render(<CornerstoneCommittees />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders error state when error is present", () => {
    vi.mocked(useCornerstoneCommittees).mockReturnValue({
      committees: [],
      loading: false,
      error: new Error("Failed to load"),
    });

    render(<CornerstoneCommittees />);
    expect(screen.getByText(/Error loading cornerstone committees: Failed to load/i)).toBeInTheDocument();
  });

  it("renders all committees when no filterId is provided", () => {
    vi.mocked(useCornerstoneCommittees).mockReturnValue({
      committees: mockCommittees as any,
      loading: false,
      error: null,
    });

    render(<CornerstoneCommittees />);

    // Check both sections are rendered
    expect(screen.getByText("Involvement Team")).toBeInTheDocument();
    expect(screen.getByText("Operations Team")).toBeInTheDocument();

    // Check leads are rendered
    expect(screen.getByText("Involvement Chair")).toBeInTheDocument();
    expect(screen.getByText("Chair: Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();

    expect(screen.getByText("Ops Chair")).toBeInTheDocument();
    expect(screen.getByText("Chair: Bob")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  it("renders only filtered committees when filterId is provided", () => {
    vi.mocked(useCornerstoneCommittees).mockReturnValue({
      committees: mockCommittees as any,
      loading: false,
      error: null,
    });

    render(<CornerstoneCommittees filterId="involvement" />);

    // Should render Involvement Team
    expect(screen.getByText("Involvement Team")).toBeInTheDocument();
    expect(screen.getByText("Involvement Chair")).toBeInTheDocument();

    // Should NOT render Operations Team
    expect(screen.queryByText("Operations Team")).not.toBeInTheDocument();
    expect(screen.queryByText("Ops Chair")).not.toBeInTheDocument();
  });
});
