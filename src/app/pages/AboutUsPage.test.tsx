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

  it('renders historical timeline milestones and committee origins', () => {
    (useSanityData.useAboutPage as any).mockReturnValue({
      data: null,
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
    expect(screen.getByText('Historic IEEE Merger')).toBeInTheDocument();
    expect(screen.getByText('Computer Society (CS)')).toBeInTheDocument();
    expect(screen.getByText('Aerial Robotics (AESS)')).toBeInTheDocument();
    expect(screen.getByText('ROV Underwater Robotics')).toBeInTheDocument();
    expect(screen.getByText('EMBS & MTT-S Expansions')).toBeInTheDocument();
    expect(screen.getByText('Cornerstones & Modern Era')).toBeInTheDocument();
  });
});
