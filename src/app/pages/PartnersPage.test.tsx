import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PartnersPage } from './PartnersPage';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../hooks/useSanityData';

// Mock hooks
vi.mock('../../hooks/useSanityData', () => ({
  usePartners: vi.fn(),
  useSiteSettings: vi.fn(),
}));

describe('PartnersPage', () => {
  const mockPartners = [
    { name: 'Gold Partner 1', tier: 'Gold', domain: 'gold1.com' },
    { name: 'Silver Partner 1', tier: 'Silver', domain: 'silver1.com' },
    { name: 'Bronze Partner 1', tier: 'Bronze', domain: 'bronze1.com' }
  ];

  const mockSettings = {
    partnersHeroTitle: 'Test Partner Title',
    partnersHeroSubtitle: 'Test Partner Subtitle',
    partnersProspectusUrl: 'https://prospectus.test'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useSanityData.usePartners as any).mockReturnValue({
      partners: mockPartners,
      loading: false,
      error: null
    });

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null
    });
  });

  it('renders loading state when data is fetching', () => {
    (useSanityData.usePartners as any).mockReturnValue({
      partners: [],
      loading: true,
      error: null
    });

    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading Partners.../i)).toBeInTheDocument();
  });

  it('renders correct content from site settings', () => {
    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Partner Title')).toBeInTheDocument();
    expect(screen.getByText('Test Partner Subtitle')).toBeInTheDocument();
    
    const prospectusLink = screen.getByRole('link', { name: /Download Prospectus/i });
    expect(prospectusLink).toHaveAttribute('href', 'https://prospectus.test');
  });

  it('renders all partner tiers correctly', () => {
    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Gold Partners')).toBeInTheDocument();
    expect(screen.getByText('Gold Partner 1')).toBeInTheDocument();

    expect(screen.getByText('Silver Partners')).toBeInTheDocument();
    expect(screen.getByText('Silver Partner 1')).toBeInTheDocument();

    expect(screen.getByText('Bronze Partners')).toBeInTheDocument();
    expect(screen.getByText('Bronze Partner 1')).toBeInTheDocument();
  });

  it('renders fallback content when settings are missing', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null
    });

    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Empowering the next generation/i)).toBeInTheDocument();
  });
});
