import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Events } from "./Events";
import { useGoogleCalendarEvents } from "../../../hooks/useGoogleCalendarEvents";

vi.mock("../../../hooks/useGoogleCalendarEvents", () => ({
  useGoogleCalendarEvents: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark" })),
}));

vi.mock("react-router", () => ({
  Link: ({ children, to, className, style }: any) => (
    <a href={to} className={className} style={style} data-testid="mock-link">
      {children}
    </a>
  ),
}));

const mockEvents = [
  {
    id: "1",
    title: "Event 1",
    description: "Description 1",
    location: "Location 1",
    start: new Date(2026, 2, 15, 13, 0, 0), // March 15, 2026 13:00 Local
    end: new Date(2026, 2, 15, 17, 0, 0),
    isAllDay: false,
    addToCalendarUrl: "http://add.1",
    htmlLink: "http://link.1",
  },
  {
    id: "2",
    title: "Event 2",
    description: "Description 2",
    location: "Location 2",
    start: new Date(2026, 2, 16, 13, 0, 0), // March 16, 2026 13:00 Local
    end: new Date(2026, 2, 16, 17, 0, 0),
    isAllDay: true,
    addToCalendarUrl: "http://add.2",
    htmlLink: "http://link.2",
  },
  {
    id: "3",
    title: "Event 3",
    start: new Date(2026, 2, 17, 13, 0, 0), // March 17, 2026 13:00 Local
    end: new Date(2026, 2, 17, 17, 0, 0),
    isAllDay: false,
    addToCalendarUrl: "http://add.3",
  },
  {
    id: "4",
    title: "Event 4",
    start: new Date(2026, 2, 18, 13, 0, 0), // March 18, 2026 13:00 Local
    end: new Date(2026, 2, 18, 17, 0, 0),
    isAllDay: false,
    addToCalendarUrl: "http://add.4",
  },
  {
    id: "5",
    title: "Event 5",
    start: new Date(2026, 2, 19, 13, 0, 0), // March 19, 2026 13:00 Local
    end: new Date(2026, 2, 19, 17, 0, 0),
    isAllDay: false,
    addToCalendarUrl: "http://add.5",
  }
];

describe("Events Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeletons when loading is true", () => {
    vi.mocked(useGoogleCalendarEvents).mockReturnValue({
      events: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { container } = render(<Events />);

    // There are 3 skeletons rendered when loading
    const skeletons = container.querySelectorAll(".event-card");
    expect(skeletons.length).toBe(3);

    // The loading indicator "..." should be shown instead of "X events"
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("renders 'No upcoming events' message when there are no events", () => {
    vi.mocked(useGoogleCalendarEvents).mockReturnValue({
      events: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<Events />);

    expect(screen.getByText("No upcoming events right now. Check back soon!")).toBeInTheDocument();
    expect(screen.getByText("0 upcoming events")).toBeInTheDocument();
  });

  it("renders up to 4 events and highlights the next event in the sidebar", () => {
    vi.mocked(useGoogleCalendarEvents).mockReturnValue({
      events: mockEvents as any,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<Events />);

    // Main list has up to 4 events
    // Event 1 is the next event, so it appears twice (once in list, once in sidebar)
    expect(screen.getAllByText("Event 1").length).toBe(2);
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(screen.getByText("Event 3")).toBeInTheDocument();
    expect(screen.getByText("Event 4")).toBeInTheDocument();
    expect(screen.queryByText("Event 5")).not.toBeInTheDocument(); // 5th event is sliced out of the main list

    // Check "View All Events" button since length > 4
    expect(screen.getByText("View All Events")).toBeInTheDocument();

    // Check total events count
    expect(screen.getByText("5 upcoming events")).toBeInTheDocument();

    expect(screen.getByText("// Next Event")).toBeInTheDocument();

    // Sidebar details should show Description 1 and Location 1 (these might appear twice if shown in main card as well)
    const descElements = screen.getAllByText("Description 1");
    expect(descElements.length).toBeGreaterThanOrEqual(1);

    const locElements = screen.getAllByText("Location 1");
    expect(locElements.length).toBeGreaterThanOrEqual(1);
  });

  it("formats dates and times correctly", () => {
    vi.mocked(useGoogleCalendarEvents).mockReturnValue({
      events: [mockEvents[0]] as any,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<Events />);

    // Check main event card date formats
    expect(screen.getAllByText("MAR 15").length).toBeGreaterThan(0);

    // Day formatting
    expect(screen.getAllByText("SUN").length).toBeGreaterThan(0);

    // Sidebar next event summary format
    expect(screen.getByText("SUN · 2026")).toBeInTheDocument();

    // Time formatting, ignoring AM/PM case quirks
    const timeRegex = /1:00\s*(AM|PM)\s*–\s*5:00\s*(AM|PM)/i;
    const timeElements = screen.getAllByText(timeRegex);
    expect(timeElements.length).toBeGreaterThan(0);
  });
});
