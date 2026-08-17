import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Navigation } from "./Navigation";
import { MemoryRouter } from "react-router";
import * as useSanityData from "../../../hooks/useSanityData";
import * as nextThemes from "next-themes";

const mockNavigate = vi.fn();
let mockPathname = "/";

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: mockPathname,
      search: "",
      hash: "",
      state: null,
      key: "default",
    }),
  };
});

vi.mock("../../../hooks/useSanityData", () => ({
  useCommittees: vi.fn(),
  useSiteSettings: vi.fn(),
  prefetchData: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

describe("Navigation", () => {
  const mockCommittees = [
    { id: "rov", shortName: "ROV", name: "Remotely Operated Vehicles" },
    { id: "embs", shortName: "EMBS", name: "Engineering in Medicine & Biology" },
    { id: "cs", shortName: "Computer Society", name: "Computer Society" },
  ];

  const mockSettings = {
    discordUrl: "https://discord.gg/test-discord",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockPathname = "/";

    (useSanityData.useCommittees as any).mockReturnValue({
      committees: mockCommittees,
      loading: false,
      error: null,
    });

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null,
    });

    (nextThemes.useTheme as any).mockReturnValue({
      theme: "dark",
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderNav = (path = "/") => {
    mockPathname = path;
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Navigation />
      </MemoryRouter>
    );
  };

  it("renders desktop navigation with brand logo and all main route links", () => {
    renderNav();

    expect(screen.getByText("PURDUE")).toBeInTheDocument();
    expect(screen.getByText("IEEE")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /^about/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^committees/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^events/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^officers/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join ieee/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /discord/i, hidden: true })).toHaveAttribute(
      "href",
      "https://discord.gg/test-discord"
    );
  });

  it("falls back to default discord URL if settings.discordUrl is empty", () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: null,
      loading: false,
      error: null,
    });

    renderNav();
    expect(screen.getByRole("link", { name: /discord/i, hidden: true })).toHaveAttribute(
      "href",
      "https://discord.gg/sPPQequ9ws"
    );
  });

  it("opens Committees dropdown on mouse enter and renders list of committees", () => {
    renderNav();

    const committeesLink = screen.getByRole("link", { name: /^committees/i, hidden: true });
    fireEvent.mouseEnter(committeesLink.parentElement!);

    expect(screen.getByTestId("nav-dropdown-committees")).toBeInTheDocument();
    expect(screen.getByText("View All Committees")).toBeInTheDocument();
    expect(screen.getByText("ROV")).toBeInTheDocument();
    expect(screen.getByText("EMBS")).toBeInTheDocument();
    expect(screen.getByText("Computer Society")).toBeInTheDocument();

    // Prefetches committees query
    expect(useSanityData.prefetchData).toHaveBeenCalled();
  });

  it("opens About dropdown on mouse enter and renders sub-items", () => {
    renderNav();

    const aboutLink = screen.getByRole("link", { name: /^about/i, hidden: true });
    fireEvent.mouseEnter(aboutLink.parentElement!);

    expect(screen.getByTestId("nav-dropdown-about")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Partners")).toBeInTheDocument();
    expect(screen.getByText("Constitution")).toBeInTheDocument();
  });

  it("closes dropdown on mouse leave after timeout", () => {
    renderNav();

    const aboutLink = screen.getByRole("link", { name: /^about/i, hidden: true });
    fireEvent.mouseEnter(aboutLink.parentElement!);
    expect(screen.getByTestId("nav-dropdown-about")).toBeInTheDocument();

    fireEvent.mouseLeave(aboutLink.parentElement!);
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByTestId("nav-dropdown-about")).not.toBeInTheDocument();
  });

  it("prefetches leader query on hovering Officers link", () => {
    renderNav();

    const officersLink = screen.getByRole("link", { name: /^officers/i, hidden: true });
    fireEvent.mouseEnter(officersLink);

    expect(useSanityData.prefetchData).toHaveBeenCalled();
  });

  it("prefetches specific committee data when hovering subitem in dropdown", () => {
    renderNav();

    const committeesLink = screen.getByRole("link", { name: /^committees/i, hidden: true });
    fireEvent.mouseEnter(committeesLink.parentElement!);

    const rovItem = screen.getByText("ROV");
    fireEvent.mouseEnter(rovItem);

    expect(useSanityData.prefetchData).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ id: "rov" })
    );
  });

  it("navigates when desktop links and dropdown sub-items are clicked", () => {
    renderNav();

    const eventsLink = screen.getByRole("link", { name: /^events/i, hidden: true });
    fireEvent.click(eventsLink);
    expect(mockNavigate).toHaveBeenCalledWith("/calendar");

    const joinBtn = screen.getByRole("button", { name: /join ieee/i, hidden: true });
    fireEvent.click(joinBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/join");

    // Click dropdown sub-item
    const committeesLink = screen.getByRole("link", { name: /^committees/i, hidden: true });
    fireEvent.mouseEnter(committeesLink.parentElement!);
    const rovItem = screen.getByText("ROV");
    fireEvent.click(rovItem);
    expect(mockNavigate).toHaveBeenCalledWith("/committee/rov");
  });

  it("toggles mobile menu open and close via mobile hamburger button", () => {
    renderNav();

    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });
    expect(screen.queryByTestId("mobile-nav-drawer")).not.toBeInTheDocument();

    // Open drawer
    fireEvent.click(toggleButton);
    expect(screen.getByRole("button", { name: /close navigation menu/i })).toBeInTheDocument();
    expect(screen.getByTestId("mobile-nav-drawer")).toBeInTheDocument();

    // Mobile drawer renders links & dropdown items
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Join Discord")).toBeInTheDocument();

    // Close drawer
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("mobile-nav-drawer")).not.toBeInTheDocument();
  });

  it("navigates and closes mobile menu when a mobile item is clicked", () => {
    renderNav();

    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("mobile-nav-drawer")).toBeInTheDocument();

    const mobileEventsLink = screen.getByRole("link", { name: /^events$/i });
    fireEvent.click(mobileEventsLink);

    expect(mockNavigate).toHaveBeenCalledWith("/calendar");
    expect(screen.queryByTestId("mobile-nav-drawer")).not.toBeInTheDocument();
  });

  it("navigates to join page when mobile Join IEEE button is clicked", () => {
    renderNav();

    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(toggleButton);

    const mobileJoinBtn = screen.getByRole("button", { name: /^join ieee$/i });
    fireEvent.click(mobileJoinBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/join");
    expect(screen.queryByTestId("mobile-nav-drawer")).not.toBeInTheDocument();
  });

  it("applies active styles when route matches current path", () => {
    renderNav("/calendar");

    const eventsLink = screen.getByRole("link", { name: /^events/i, hidden: true });
    expect(eventsLink.style.color).toBe("var(--text-primary)");
  });

  it("supports light mode styles without errors", () => {
    (nextThemes.useTheme as any).mockReturnValue({
      theme: "light",
    });

    renderNav();

    const aboutLink = screen.getByRole("link", { name: /^about/i, hidden: true });
    fireEvent.mouseEnter(aboutLink.parentElement!);
    expect(screen.getByTestId("nav-dropdown-about")).toBeInTheDocument();
  });

  it("updates nav background on scroll", () => {
    const { container } = renderNav();
    const nav = container.querySelector("nav");
    expect(nav).toHaveStyle({ background: "transparent" });

    // Simulate window scroll
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(nav).toHaveStyle({ background: "var(--boiler-black)" });
  });
});
