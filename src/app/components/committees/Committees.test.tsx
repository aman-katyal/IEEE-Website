import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Committees } from './Committees';
import * as useSanityData from '../../../hooks/useSanityData';

vi.mock('../../../hooks/useSanityData', () => ({
  useCommittees: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

describe('Committees Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders committee cards without "Active" status badges', () => {
    const mockCommittees = [
      {
        id: 'rov',
        name: 'Remotely Operated Vehicles',
        shortName: 'ROV',
        tagline: 'Underwater robotics',
        description: 'Building underwater rovs',
        longDescription: 'Long description',
        status: 'Active',
        statusColor: 'var(--electric-blue)',
        statusBg: 'rgba(0, 98, 155, 0.1)',
        image: 'rov.jpg',
        tags: ['Robotics', 'Hardware'],
        chair: 'ROV Chair',
        email: 'rov@purdueieee.org',
        metrics: [],
      },
      {
        id: 'legacy-team',
        name: 'Legacy Team',
        shortName: 'Legacy',
        tagline: 'Archived team',
        description: 'Past projects',
        longDescription: 'Long description',
        status: 'Archived',
        statusColor: '#ff0000',
        statusBg: '#330000',
        image: 'legacy.jpg',
        tags: ['Software'],
        chair: 'Legacy Chair',
        email: 'legacy@purdueieee.org',
        metrics: [],
      },
    ];

    (useSanityData.useCommittees as any).mockReturnValue({
      committees: mockCommittees,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Committees />
      </MemoryRouter>
    );

    // Verify committee titles render
    expect(screen.getByText('ROV')).toBeInTheDocument();
    expect(screen.getByText('Legacy')).toBeInTheDocument();

    // Verify 'Active' label is NOT present
    expect(screen.queryByText(/Active · 2025–26/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Active$/i)).not.toBeInTheDocument();

    // Verify non-active status IS rendered
    expect(screen.getByText('Archived')).toBeInTheDocument();

    // Verify pseudo-code count label is NOT present
    expect(screen.queryByText(/sys\.committees\.count/i)).not.toBeInTheDocument();

    // Verify natural count label is rendered
    expect(screen.getByText(/Committees:/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders loading skeleton and does not render pseudo-code label when loading', () => {
    (useSanityData.useCommittees as any).mockReturnValue({
      committees: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <Committees />
      </MemoryRouter>
    );

    expect(screen.queryByText(/sys\.committees\.count/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Committees:/i)).toBeInTheDocument();
  });
});

