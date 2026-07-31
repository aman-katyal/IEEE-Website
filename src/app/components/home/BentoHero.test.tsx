import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BentoHero } from './BentoHero';
import { MemoryRouter } from 'react-router';
import * as nextThemes from 'next-themes';
import * as homePageContext from '../../../context/HomePageContext';
import * as sanityHooks from '../../../hooks/useSanityData';

// Mock dependencies
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../../context/HomePageContext', () => ({
  useHomePageData: vi.fn(),
}));

vi.mock('../../../hooks/useSanityData', () => ({
  useCommittees: vi.fn(),
  useSiteSettings: vi.fn(),
}));

// Mock Skeleton component to simplify testing its loading behavior
vi.mock('boneyard-js/react', () => ({
  Skeleton: ({ children, loading, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'skeleton'} data-loading={loading}>
      {children}
    </div>
  ),
}));

// Mock child components that might have complex logic/animations
vi.mock('./CyclingStat', () => ({
  CyclingStat: () => <div data-testid="cycling-stat" />,
}));
vi.mock('./LabStatusRack', () => ({
  LabStatusRack: () => <div data-testid="lab-status-rack" />,
}));
vi.mock('../shared/MagneticButton', () => ({
  MagneticButton: ({ children, to }: any) => <a href={to}>{children}</a>,
}));


describe('BentoHero', () => {
  const mockHomeData = {
    heroTitle: 'Fostering innovation and excellence',
    heroSubtitle: '— IEEE Mission Statement',
    heroImage: 'https://example.com/image.jpg',
    aboutTitle: 'Student Organization of the Year',
    aboutContent: 'Test about content',
    stats: [
      { value: 10, label: 'Committees', sublabel: 'Technical', suffix: '' }
    ],
    hqLocation: 'EE 115',
    discordMembers: '1,200+ Members',
    campusLocation: 'Purdue West Lafayette'
  };

  const mockCommittees = [
    { id: 'rov', shortName: 'ROV', name: 'Remotely Operated Vehicles' }
  ];

  const mockSettings = {
    duesDescription: '$15 / semester'
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (nextThemes.useTheme as any).mockReturnValue({ theme: 'dark' });

    (homePageContext.useHomePageData as any).mockReturnValue({
      data: mockHomeData,
      loading: false,
    });

    (sanityHooks.useCommittees as any).mockReturnValue({
      committees: mockCommittees,
      loading: false,
    });

    (sanityHooks.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
    });
  });

  const renderComponent = () => render(
    <MemoryRouter>
      <BentoHero />
    </MemoryRouter>
  );

  it('renders correctly with fully populated data', () => {
    renderComponent();

    // Check Hero Block
    expect(screen.getByText(/Fostering/)).toBeInTheDocument();
    expect(screen.getByText(/innovation/)).toBeInTheDocument();
    expect(screen.getByText(/— IEEE Mission Statement/)).toBeInTheDocument();
    expect(screen.getByText('Explore Committees')).toBeInTheDocument();

    // Check Telemetry
    expect(screen.getByText('EE 115')).toBeInTheDocument();
    expect(screen.getByText('1 Committees')).toBeInTheDocument();
    expect(screen.getByText('Join Now →')).toBeInTheDocument();
    expect(screen.getByText('1,200+ Members')).toBeInTheDocument();
    expect(screen.getByText('Purdue West Lafayette')).toBeInTheDocument();

    // Check About Us
    expect(screen.getByText(/Student Organization/)).toBeInTheDocument();
    expect(screen.getByText('Test about content')).toBeInTheDocument();
  });

  it('handles loading state properly', () => {
    (homePageContext.useHomePageData as any).mockReturnValue({
      data: null,
      loading: true,
    });

    renderComponent();

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-loading', 'true');
  });

  it('handles empty state safely', () => {
    (homePageContext.useHomePageData as any).mockReturnValue({
      data: null,
      loading: false,
    });

    (sanityHooks.useCommittees as any).mockReturnValue({
      committees: [],
      loading: false,
    });

    (sanityHooks.useSiteSettings as any).mockReturnValue({
      settings: null,
      loading: false,
    });

    renderComponent();

    // The skeleton should not be loading
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-loading', 'false');

    // Default static content should still render
    expect(screen.getByText('Explore Committees')).toBeInTheDocument();
    expect(screen.getByText('Join Purdue IEEE')).toBeInTheDocument();
    expect(screen.getByText('Read Our Heritage')).toBeInTheDocument();
  });

  it('applies light theme styles correctly', () => {
    (nextThemes.useTheme as any).mockReturnValue({ theme: 'light' });

    renderComponent();

    // Check if the background elements receive the correct opacity for light mode
    // We query the background grid div, which gets opacity 0.3 in light mode and 0.25 in dark mode
    const gridBg = document.querySelector('.ieee-grid-bg');
    expect(gridBg).toHaveStyle({ opacity: '0.3' });
  });

  it('applies dark theme styles correctly', () => {
    (nextThemes.useTheme as any).mockReturnValue({ theme: 'dark' });

    renderComponent();

    const gridBg = document.querySelector('.ieee-grid-bg');
    expect(gridBg).toHaveStyle({ opacity: '0.25' });
  });
});
