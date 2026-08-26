import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DestinationsPage } from './DestinationsPage';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../hooks/useSanityData';
import * as nextThemes from 'next-themes';

vi.mock('../../hooks/useSanityData', () => ({
  useHomePage: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('DestinationsPage', () => {
  const mockCompanies = [
    {
      _key: 'spacex',
      name: 'SpaceX',
      domain: 'spacex.com',
      roleOrField: 'Aerospace & Space Systems',
      url: 'https://www.spacex.com/careers',
    },
    {
      _key: 'apple',
      name: 'Apple',
      domain: 'apple.com',
      roleOrField: 'Consumer Tech & Hardware',
      url: 'https://www.apple.com/careers',
    },
    {
      _key: 'ti',
      name: 'Texas Instruments',
      domain: 'ti.com',
      roleOrField: 'Semiconductors & Analog ICs',
      url: 'https://careers.ti.com',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'dark',
    });
  });

  it('renders header, breadcrumbs, and list of destination companies from CMS', () => {
    (useSanityData.useHomePage as any).mockReturnValue({
      data: {
        alumniCompanies: mockCompanies,
        alumniHighlightText: 'Top Tech Destinations',
      },
      loading: false,
    });

    render(
      <MemoryRouter>
        <DestinationsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('// ALUMNI & INTERNSHIP DESTINATIONS')).toBeInTheDocument();
    expect(screen.getByText('Where Our Engineers')).toBeInTheDocument();
    expect(screen.getByText('SpaceX')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Texas Instruments')).toBeInTheDocument();
    expect(screen.getByText('Top Tech Destinations')).toBeInTheDocument();
  });

  it('filters companies by search query', () => {
    (useSanityData.useHomePage as any).mockReturnValue({
      data: {
        alumniCompanies: mockCompanies,
      },
      loading: false,
    });

    render(
      <MemoryRouter>
        <DestinationsPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search companies, domains, or fields/i);
    fireEvent.change(searchInput, { target: { value: 'SpaceX' } });

    expect(screen.getByText('SpaceX')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    expect(screen.queryByText('Texas Instruments')).not.toBeInTheDocument();
  });

  it('filters companies by sector buttons', () => {
    (useSanityData.useHomePage as any).mockReturnValue({
      data: {
        alumniCompanies: mockCompanies,
      },
      loading: false,
    });

    render(
      <MemoryRouter>
        <DestinationsPage />
      </MemoryRouter>
    );

    const aeroFilter = screen.getByRole('button', { name: 'Aerospace & Defense' });
    fireEvent.click(aeroFilter);

    expect(screen.getByText('SpaceX')).toBeInTheDocument();
    expect(screen.queryByText('Texas Instruments')).not.toBeInTheDocument();
  });

  it('displays empty state when search finds no matches', () => {
    (useSanityData.useHomePage as any).mockReturnValue({
      data: {
        alumniCompanies: mockCompanies,
      },
      loading: false,
    });

    render(
      <MemoryRouter>
        <DestinationsPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search companies, domains, or fields/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Corp' } });

    expect(screen.getByText('No destination found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Search' })).toBeInTheDocument();
  });
});
