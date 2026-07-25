import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConstitutionPage } from './ConstitutionPage';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../hooks/useSanityData';

// Mock hooks
vi.mock('../../hooks/useSanityData', () => ({
  useSiteSettings: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ theme: 'dark' })),
}));

describe('ConstitutionPage', () => {
  const mockSettings = {
    branchConstitution: {
      name: 'Custom Branch Constitution',
      description: 'Custom foundational governing document.',
      pdfUrl: '/custom-branch.pdf'
    },
    committeeBylaws: [
      { name: 'Custom Committee 1', pdfUrl: '/custom-committee-1.pdf' },
      { name: 'Custom Committee 2', pdfUrl: '/custom-committee-2.pdf' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null
    });
  });

  it('renders loading state when data is fetching', () => {
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

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders correctly with custom site settings', () => {
    render(
      <MemoryRouter>
        <ConstitutionPage />
      </MemoryRouter>
    );

    // Header
    expect(screen.getByText('Constitution and')).toBeInTheDocument();

    // Core Constitution
    expect(screen.getByText('Custom Branch Constitution')).toBeInTheDocument();
    expect(screen.getByText('Custom foundational governing document.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View PDF/i })).toHaveAttribute('href', '/custom-branch.pdf');

    // Committee Bylaws
    expect(screen.getByText('Custom Committee 1')).toBeInTheDocument();
    const link1 = screen.getAllByRole('link').find(el => el.getAttribute('href') === '/custom-committee-1.pdf');
    expect(link1).toBeInTheDocument();

    expect(screen.getByText('Custom Committee 2')).toBeInTheDocument();
    const link2 = screen.getAllByRole('link').find(el => el.getAttribute('href') === '/custom-committee-2.pdf');
    expect(link2).toBeInTheDocument();
  });

  it('renders fallback content when site settings are missing', () => {
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

    // Core Constitution Fallback
    expect(screen.getByText('Purdue IEEE Constitution')).toBeInTheDocument();
    expect(screen.getByText('The foundational governing document of the Purdue IEEE Student Branch.')).toBeInTheDocument();

    // Committee Bylaws Fallbacks
    expect(screen.getByText('CSociety Bylaws')).toBeInTheDocument();
    expect(screen.getByText('EMBS Bylaws')).toBeInTheDocument();
    expect(screen.getByText('MTT-S Bylaws')).toBeInTheDocument();
    expect(screen.getByText('SMC Bylaws')).toBeInTheDocument();
    expect(screen.getByText('Racing Bylaws')).toBeInTheDocument();
    expect(screen.getByText('ROV Bylaws')).toBeInTheDocument();
    expect(screen.getByText('Software Saturdays Bylaws')).toBeInTheDocument();
  });
});
