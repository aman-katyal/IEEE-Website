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

  it('renders fallback content when no CMS data is provided', () => {
    (useSanityData.useAboutPage as any).mockReturnValue({
      data: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <AboutUsPage />
      </MemoryRouter>
    );

    // Static sections (heritage & impact)
    expect(screen.getByText('Established 1903')).toBeInTheDocument();
    expect(screen.getByText('Professional Growth')).toBeInTheDocument();

    // Fallback dynamic sections
    // Note: title is broken into spans, so we can test the h2 role with its text content
    // use a custom matcher since text is split across multiple spans
    expect(screen.getByText((content, element) => element?.textContent === 'At Purdue, we strive to be the best ')).toBeInTheDocument();
    expect(screen.getByText((content, element) => element?.textContent === 'Applying academics to extracurriculars ')).toBeInTheDocument();
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

    expect(screen.getByText((content, element) => element?.textContent === 'Custom Title Here ')).toBeInTheDocument();

    expect(screen.getByText('Custom content body here.')).toBeInTheDocument();

    // Fallback content shouldn't be present
    expect(screen.queryByText((content, element) => element?.textContent === 'At Purdue, we strive to be the best ')).not.toBeInTheDocument();
  });
});
