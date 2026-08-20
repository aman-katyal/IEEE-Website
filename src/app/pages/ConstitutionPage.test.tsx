import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConstitutionPage } from './ConstitutionPage';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../hooks/useSanityData';
import * as nextThemes from 'next-themes';

// Mock dependencies
vi.mock('../../hooks/useSanityData', () => ({
  useSiteSettings: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ConstitutionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'light',
    });
  });

  it('renders loading state initially', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: null,
      loading: true,
      error: null
    });

    render(
      <MemoryRouter>
        <ConstitutionPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders correctly with custom site settings', () => {
    const mockSettings = {
      branchConstitution: {
        name: 'Custom Branch Constitution',
        description: 'Custom description for the constitution.',
        pdfUrl: '/custom-constitution.pdf'
      },
      committeeBylaws: [
        { name: 'Custom Committee 1', pdfUrl: '/custom-committee-1.pdf' },
        { name: 'Custom Committee 2', pdfUrl: '/custom-committee-2.pdf' }
      ]
    };

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null
    });

    render(
      <MemoryRouter>
        <ConstitutionPage />
      </MemoryRouter>
    );

    // Verify Core Constitution Section
    expect(screen.getByText('Branch Constitution')).toBeInTheDocument();
    expect(screen.getByText('Custom Branch Constitution')).toBeInTheDocument();
    expect(screen.getByText('Custom description for the constitution.')).toBeInTheDocument();
    
    // Check View PDF button
    const viewPdfBtn = screen.getByRole('link', { name: /View PDF/i });
    expect(viewPdfBtn).toBeInTheDocument();
    expect(viewPdfBtn).toHaveAttribute('href', '/custom-constitution.pdf');

    // Verify Committee Bylaws Section
    expect(screen.getByText('Technical Committee Bylaws')).toBeInTheDocument();
    expect(screen.getByText('Custom Committee 1')).toBeInTheDocument();
    const link1 = screen.getAllByRole('link').find(el => el.getAttribute('href') === '/custom-committee-1.pdf');
    expect(link1).toBeInTheDocument();

    expect(screen.getByText('Custom Committee 2')).toBeInTheDocument();
    const link2 = screen.getAllByRole('link').find(el => el.getAttribute('href') === '/custom-committee-2.pdf');
    expect(link2).toBeInTheDocument();
  });

  it('renders cleanly without hardcoded fallback documents when site settings are empty', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null
    });

    render(
      <MemoryRouter>
        <ConstitutionPage />
      </MemoryRouter>
    );

    expect(screen.queryByText('Purdue IEEE Constitution')).not.toBeInTheDocument();
    expect(screen.queryByText('CSociety Bylaws')).not.toBeInTheDocument();
  });
});
