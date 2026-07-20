import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePage } from './HomePage';
import { MemoryRouter } from 'react-router-dom';
import * as useSanityData from '../../hooks/useSanityData';
import * as useGoogleCalendarEvents from '../../hooks/useGoogleCalendarEvents';

// Mock hooks
vi.mock('../../hooks/useSanityData', () => ({
  useHomePage: vi.fn(),
  useCommittees: vi.fn(),
  useSiteSettings: vi.fn(),
  usePartners: vi.fn(),
}));

vi.mock('../../hooks/useGoogleCalendarEvents', () => ({
  useGoogleCalendarEvents: vi.fn(),
}));

describe('HomePage', () => {
  const mockHomeData = {
    heroTitle: 'Fostering innovation and excellence',
    heroSubtitle: '— IEEE Mission Statement',
    aboutTitle: 'At Purdue, we strive to be the best',
    aboutContent: 'Test about content',
    stats: [
      { value: 10, label: 'Committees', sublabel: 'Technical' }
    ],
    sysUptime: 'ACTIVE',
    semester: 'SP_2026',
    hqLocation: 'EE 115 / EE 224',
    discordMembers: '1,200+ Members',
    campusLocation: 'Purdue West Lafayette'
  };

  const mockCommittees = [
    { id: 'rov', shortName: 'ROV', name: 'Remotely Operated Vehicles' }
  ];

  const mockSettings = {
    discordUrl: 'https://discord.gg/test',
    ctaBenefits: ['Benefit 1', 'Benefit 2'],
    duesDescription: '$15 / semester'
  };

  const mockPartners = [
    { name: 'Partner 1', tier: 'Gold' }
  ];

  const mockEvents = [
    {
      id: '1',
      title: 'Test Event',
      start: new Date('2026-03-20T10:00:00'),
      end: new Date('2026-03-20T11:00:00'),
      location: 'Test Lab'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useSanityData.useHomePage as any).mockReturnValue({
      data: mockHomeData,
      loading: false,
      error: null
    });

    (useSanityData.useCommittees as any).mockReturnValue({
      committees: mockCommittees,
      loading: false,
      error: null
    });

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null
    });

    (useSanityData.usePartners as any).mockReturnValue({
      partners: mockPartners,
      loading: false,
      error: null
    });

    (useGoogleCalendarEvents.useGoogleCalendarEvents as any).mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null
    });
  });

  it('renders loading state when data is fetching', () => {
    (useSanityData.useHomePage as any).mockReturnValue({
      data: null,
      loading: true,
      error: null
    });

    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // BentoHero uses skeleton loading
    const skeleton = container.querySelector('[data-boneyard="bento-hero"]');
    expect(skeleton).toBeDefined();
  });

  it('renders hero section with correct content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Fostering/i)).toBeInTheDocument();
    expect(screen.getByText(/innovation/i)).toBeInTheDocument();
    expect(screen.getByText(/IEEE Mission Statement/i)).toBeInTheDocument();
  });

  it('renders about section with correct content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/strive to be the best/i)).toBeInTheDocument();
    expect(screen.getByText('Test about content')).toBeInTheDocument();
  });

  it('renders stats section with correct content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Committees')).toBeInTheDocument();
    expect(screen.getByText('Technical')).toBeInTheDocument();
    expect(screen.getByText('HQ Location:')).toBeInTheDocument();
  });

  it('renders events section with correct content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Test Event').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Test Lab').length).toBeGreaterThan(0);
  });

  it('renders join CTA section with correct content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Ready to/i)).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Benefit 1')).toBeInTheDocument();
    expect(screen.getByText('Benefit 2')).toBeInTheDocument();
  });
});
