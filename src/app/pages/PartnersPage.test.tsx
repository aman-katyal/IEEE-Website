import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PartnersPage } from "./PartnersPage";
import { MemoryRouter } from "react-router";
import * as useSanityData from "../../hooks/useSanityData";

// Mock hooks
vi.mock("../../hooks/useSanityData", () => ({
  usePartners: vi.fn(),
  useSiteSettings: vi.fn(),
}));

describe("PartnersPage", () => {
  const mockPartners = [
    { name: "Gold Partner 1", tier: "Gold", domain: "gold1.com" },
    { name: "Silver Partner 1", tier: "Silver", domain: "silver1.com" },
    { name: "Bronze Partner 1", tier: "Bronze", domain: "bronze1.com" },
  ];

  const mockSettings = {
    partnersHeroTitle: "Test Partner Title",
    partnersHeroSubtitle: "Test Partner Subtitle",
    partnersProspectusUrl: "https://prospectus.test",
    showCorporateTiers: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useSanityData.usePartners as any).mockReturnValue({
      partners: mockPartners,
      loading: false,
      error: null,
    });

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null,
    });
  });

  it("renders loading state when data is fetching", () => {
    (useSanityData.usePartners as any).mockReturnValue({
      partners: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading Partners.../i)).toBeInTheDocument();
  });

  it("renders correct content from site settings", () => {
    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Partner Title")).toBeInTheDocument();
    expect(screen.getByText("Test Partner Subtitle")).toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: /Branch Constitution/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Become a Partner/i }),
    ).toHaveAttribute("href", "mailto:industry@purdueieee.org");
    expect(
      screen.getByRole("link", { name: /Sponsorship Prospectus/i }),
    ).toHaveAttribute("href", "https://prospectus.test");
  });

  it("renders unified corporate partners & sponsors directory when tiers are hidden (default)", () => {
    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Our Corporate Partners & Sponsors"),
    ).toBeInTheDocument();
    expect(screen.getByText("Gold Partner 1")).toBeInTheDocument();
    expect(screen.getByText("Silver Partner 1")).toBeInTheDocument();
    expect(screen.getByText("Bronze Partner 1")).toBeInTheDocument();

    // Tiers headers should not appear when showCorporateTiers is false
    expect(screen.queryByText("Silver Partners")).not.toBeInTheDocument();
    expect(screen.queryByText("Bronze Partners")).not.toBeInTheDocument();
  });

  it("renders interactive tier comparison matrix when showCorporateTiers is true", () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: { ...mockSettings, showCorporateTiers: true },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Corporate Partnership Tiers")).toBeInTheDocument();
    expect(screen.getByText("Bronze")).toBeInTheDocument();
    expect(screen.getByText("Silver")).toBeInTheDocument();
    expect(screen.getByText("Gold")).toBeInTheDocument();
    expect(screen.getByText("Platinum")).toBeInTheDocument();
    expect(screen.getByText("Resume Book access")).toBeInTheDocument();
    expect(screen.getByText("Dedicated tech talks")).toBeInTheDocument();
    expect(screen.getByText("Lab branding")).toBeInTheDocument();
    expect(screen.getByText("Callout banner placement")).toBeInTheDocument();
    expect(screen.getByText("Hackathon sponsorship")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Become a Corporate Partner/i }),
    ).toHaveAttribute("href", "mailto:industry@purdueieee.org");
    expect(
      screen.getByRole("link", { name: /Download Sponsorship Packet PDF/i }),
    ).toHaveAttribute("href", "https://prospectus.test");
  });

  it("renders all partner tiers correctly when showCorporateTiers is true", () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: { ...mockSettings, showCorporateTiers: true },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Gold Partners")).toBeInTheDocument();
    expect(screen.getByText("Gold Partner 1")).toBeInTheDocument();

    expect(screen.getByText("Silver Partners")).toBeInTheDocument();
    expect(screen.getByText("Silver Partner 1")).toBeInTheDocument();

    expect(screen.getByText("Bronze Partners")).toBeInTheDocument();
    expect(screen.getByText("Bronze Partner 1")).toBeInTheDocument();
  });

  it("renders IEEE Gold Partner recognition callout", () => {
    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(
        /IEEE Exemplary Student Branch — Gold Partner Recognition/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders partners provided from Sanity CMS", () => {
    (useSanityData.usePartners as any).mockReturnValue({
      partners: [
        {
          name: "Texas Instruments",
          domain: "ti.com",
          websiteUrl: "https://www.ti.com",
          tier: "Gold",
        },
      ],
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Texas Instruments")).toBeInTheDocument();
    const logo = screen.getByRole("img", { name: /Texas Instruments logo/i });
    expect(logo).toHaveAttribute("width", "180");
    expect(logo).toHaveAttribute("height", "48");
    expect(logo).toHaveAttribute("loading", "lazy");
    expect(logo).toHaveAttribute("decoding", "async");

    const websiteLink = screen.getByRole("link", {
      name: /Visit Texas Instruments \(Gold Partner\) website/i,
    });
    expect(websiteLink).toHaveAttribute("href", "https://www.ti.com");
  });

  it("renders fallback content when settings are missing", () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Empowering the next generation/i),
    ).toBeInTheDocument();
  });
});
