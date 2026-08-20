import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JoinPage } from './JoinPage';
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

describe('JoinPage', () => {
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
        <JoinPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders correctly with custom site settings', () => {
    const mockSettings = {
      duesDescription: 'Custom dues description text.',
      duesBenefits: ['Custom Benefit 1', 'Custom Benefit 2'],
      duesOptions: [
        { name: 'Custom Option 1', subtitle: 'Subtitle 1', price: '$20 / year' }
      ],
      discordUrl: 'https://discord.gg/custom',
      paymentUrl: 'https://custom-payment.com'
    };

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null
    });

    render(
      <MemoryRouter>
        <JoinPage />
      </MemoryRouter>
    );

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

  it('renders cleanly without hardcoded fallback content when site settings are empty', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null
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
