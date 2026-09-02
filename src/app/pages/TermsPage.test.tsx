import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TermsPage } from './TermsPage';
import { MemoryRouter } from 'react-router';

import * as useSanityData from '../../hooks/useSanityData';

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

vi.mock('../../hooks/useSanityData', () => ({
  useSiteSettings: vi.fn(),
}));

describe('TermsPage', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null,
    });
  });

  it('renders terms of use heading and key sections', () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /terms of use/i })).toBeInTheDocument();
    expect(screen.getByText(/1\. Acceptance of Terms/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Member Code of Conduct/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Lab & Equipment Access/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Projects & Open Source/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Governance & Bylaws/i)).toBeInTheDocument();
  });

  it('renders links to constitution and back to home', () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    const constitutionLinks = screen.getAllByRole('link', { name: /constitution/i });
    expect(constitutionLinks.length).toBeGreaterThan(0);
    expect(constitutionLinks[0]).toHaveAttribute('href', '/constitution');
  });

  it('renders custom terms sections from Sanity CMS', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {
        termsTitle: 'Custom Terms & Conditions',
        termsEffectiveDate: 'Effective Fall 2026',
        termsSections: [
          { title: 'Custom Section A', content: 'Custom content A', icon: 'file' },
        ],
      },
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Custom Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByText('Effective Fall 2026')).toBeInTheDocument();
    expect(screen.getByText('Custom Section A')).toBeInTheDocument();
    expect(screen.getByText('Custom content A')).toBeInTheDocument();
  });
});
