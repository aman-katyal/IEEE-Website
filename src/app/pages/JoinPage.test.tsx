import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JoinPage } from './JoinPage';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../hooks/useSanityData';

// Mock hooks
vi.mock('../../hooks/useSanityData', () => ({
  useSiteSettings: vi.fn(),
}));

describe('JoinPage', () => {
  const mockSettings = {
    discordUrl: 'https://discord.gg/test',
    duesDescription: 'Custom dues description',
    duesBenefits: ['Custom Benefit 1', 'Custom Benefit 2'],
    duesOptions: [
      { name: 'Standard', subtitle: 'Subtitle 1', price: '$10' },
      { name: 'Gold', subtitle: 'Subtitle 2', price: '$20' }
    ],
    paymentUrl: 'https://payment.test'
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
        <JoinPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders correctly with custom site settings', () => {
    render(
      <MemoryRouter>
        <JoinPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Custom dues description')).toBeInTheDocument();
    expect(screen.getByText('Custom Benefit 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Benefit 2')).toBeInTheDocument();
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
    
    const discordLink = screen.getByRole('link', { name: /Join Discord/i });
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/test');

    const paymentLink = screen.getByRole('link', { name: /Pay via TooCool/i });
    expect(paymentLink).toHaveAttribute('href', 'https://payment.test');
  });

  it('renders fallback content when site settings are missing', () => {
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

    expect(screen.getByText(/Purdue IEEE Student Branch requires payment of dues/i)).toBeInTheDocument();
    expect(screen.getByText(/Access to industry networks/i)).toBeInTheDocument();
    expect(screen.getByText('Standard Membership')).toBeInTheDocument();
  });
});
