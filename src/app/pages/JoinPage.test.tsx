import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JoinPage } from './JoinPage';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../hooks/useSanityData';
import * as nextThemes from 'next-themes';

// Mock dependencies
vi.mock('../../hooks/useSanityData', () => ({
  useSiteSettings: vi.fn(),
  useJoinPage: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('JoinPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'light',
    });
    (useSanityData.useJoinPage as any).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('renders loading state initially', () => {
    (useSanityData.useJoinPage as any).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: null,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <JoinPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders correctly with custom site settings and join page data', () => {
    const mockJoinData = {
      heroTitle: 'Custom Join Header',
      heroSubtitle: 'Custom Join Subtitle',
      steps: [
        { title: 'Step One', description: 'Description One', icon: 'users' },
      ],
      connectTitle: 'Community Discord',
      duesTitle: 'Membership Fees',
      duesDescription: 'Custom dues description text.',
      duesBenefits: ['Custom Benefit 1', 'Custom Benefit 2'],
      duesOptions: [
        { name: 'Custom Option 1', subtitle: 'Subtitle 1', price: '$20 / year' },
      ],
      discordUrl: 'https://discord.gg/custom',
      paymentUrl: 'https://custom-payment.com',
    };

    (useSanityData.useJoinPage as any).mockReturnValue({
      data: mockJoinData,
      loading: false,
      error: null,
    });
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <JoinPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Custom Join Header')).toBeInTheDocument();
    expect(screen.getByText('Custom Join Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Step One')).toBeInTheDocument();
    expect(screen.getByText('Community Discord')).toBeInTheDocument();
    expect(screen.getByText('Custom dues description text.')).toBeInTheDocument();
    expect(screen.getByText('Custom Benefit 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Benefit 2')).toBeInTheDocument();
    expect(screen.getByText('Custom Option 1')).toBeInTheDocument();
    expect(screen.getByText('$20 / year')).toBeInTheDocument();

    // Check links
    const discordLink = screen.getByRole('link', { name: /Join Purdue IEEE Discord server/i });
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/custom');

    const paymentLink = screen.getByRole('link', { name: /Pay Purdue IEEE membership dues via TooCool/i });
    expect(paymentLink).toHaveAttribute('href', 'https://custom-payment.com');
  });

  it('renders cleanly without hardcoded fallback content when data is empty', () => {
    (useSanityData.useJoinPage as any).mockReturnValue({
      data: {},
      loading: false,
      error: null,
    });
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <JoinPage />
      </MemoryRouter>
    );

    expect(screen.queryByText('Standard Membership')).not.toBeInTheDocument();
    expect(screen.queryByText(/Access to industry networks/i)).not.toBeInTheDocument();
  });
});
