import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AboutUsPage } from './AboutUsPage';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../hooks/useSanityData';
import * as nextThemes from 'next-themes';

vi.mock('../../hooks/useSanityData', () => ({
  useAboutPage: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('AboutUsPage', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    vi.clearAllMocks();

    window.scrollTo = vi.fn();

    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'light',
    });
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  it('calls window.scrollTo on mount', () => {
    (useSanityData.useAboutPage as any).mockReturnValue({
      data: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <AboutUsPage />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('renders clean structure when no CMS data is provided', () => {
    (useSanityData.useAboutPage as any).mockReturnValue({
      data: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <AboutUsPage />
      </MemoryRouter>
    );

    // Static layout sections (heritage & impact)
    expect(screen.getByText('Established 1903')).toBeInTheDocument();
    expect(screen.getByText('Professional Growth')).toBeInTheDocument();

    // No hardcoded fallback sections
    expect(screen.queryByText((_, element) => element?.textContent === 'At Purdue, we strive to be the best ')).not.toBeInTheDocument();
  });

  it('renders custom CMS content when provided', () => {
    const customSections = [
      {
        eyebrow: '// Custom Eyebrow',
        title: 'Custom Title Here',
        content: 'Custom content body here.',
        image: '',
        layout: 'normal'
      }
    ];

    (useSanityData.useAboutPage as any).mockReturnValue({
      data: { sections: customSections },
      loading: false,
    });

    render(
      <MemoryRouter>
        <AboutUsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('// Custom Eyebrow')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === 'Custom Title Here ')).toBeInTheDocument();
    expect(screen.getByText('Custom content body here.')).toBeInTheDocument();
  });

  it('renders historical timeline milestones dynamically from Sanity CMS data', () => {
    const mockTimeline = [
      {
        year: '1903',
        title: 'AIEE Purdue Branch Founded',
        category: 'Branch Origin',
        description: 'The American Institute of Electrical Engineers charters the Purdue Student Branch.',
        isGoldAccent: true,
      },
      {
        year: '1950s',
        title: 'Grand Prix & Racing Heritage',
        category: 'Motorsports',
        description: 'Purdue IEEE members engineer early electric and combustion vehicles.',
        isGoldAccent: false,
      },
      {
        year: '2008',
        title: 'ROV Underwater Robotics',
        category: 'Marine Robotics',
        description: 'Founded to engineer custom submersibles.',
        isGoldAccent: false,
      },
    ];

    (useSanityData.useAboutPage as any).mockReturnValue({
      data: { timeline: mockTimeline },
      loading: false,
    });

    render(
      <MemoryRouter>
        <AboutUsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('// HISTORICAL LINEAGE & ROOTS')).toBeInTheDocument();
    expect(screen.getByText('AIEE Purdue Branch Founded')).toBeInTheDocument();
    expect(screen.getByText('Grand Prix & Racing Heritage')).toBeInTheDocument();
    expect(screen.getByText('ROV Underwater Robotics')).toBeInTheDocument();
  });

  it('does not render timeline section when CMS data is empty (zero hardcoding)', () => {
    (useSanityData.useAboutPage as any).mockReturnValue({
      data: { timeline: [] },
      loading: false,
    });

    render(
      <MemoryRouter>
        <AboutUsPage />
      </MemoryRouter>
    );

    expect(screen.queryByText('// HISTORICAL LINEAGE & ROOTS')).not.toBeInTheDocument();
  });
});
