import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JoinCTA } from './JoinCTA';
import { MemoryRouter } from 'react-router';
import * as sanityHooks from '../../../hooks/useSanityData';
import * as reactRouter from 'react-router';

// Mock dependencies
vi.mock('../../../hooks/useSanityData', () => ({
  useCommittees: vi.fn(),
  useSiteSettings: vi.fn(),
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock MagneticButton to simplify testing
vi.mock('../shared/MagneticButton', () => ({
  MagneticButton: ({ children, onClick, className, style }: any) => (
    <button className={className} style={style} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('JoinCTA', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (reactRouter.useNavigate as any).mockReturnValue(mockNavigate);
  });

  const renderComponent = () => render(
    <MemoryRouter>
      <JoinCTA />
    </MemoryRouter>
  );

  it('renders fallback benefits and default discord URL when settings are missing', () => {
    (sanityHooks.useCommittees as any).mockReturnValue({
      committees: [{ id: '1' }, { id: '2' }, { id: '3' }],
    });
    (sanityHooks.useSiteSettings as any).mockReturnValue({
      settings: null,
    });

    renderComponent();

    // Check fallback benefits
    expect(screen.getByText('Access to 3 technical committees')).toBeInTheDocument();
    expect(screen.getByText('Industry networking & recruitment events')).toBeInTheDocument();
    expect(screen.getByText('Hands-on workshops & training')).toBeInTheDocument();

    // Check default discord URL
    const discordLink = screen.getByRole('link', { name: /Jump into Discord/i });
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/sPPQequ9ws');
  });

  it('renders custom benefits and custom discord URL from settings', () => {
    (sanityHooks.useCommittees as any).mockReturnValue({
      committees: [],
    });
    (sanityHooks.useSiteSettings as any).mockReturnValue({
      settings: {
        ctaBenefits: ['Custom benefit 1', 'Custom benefit 2'],
        discordUrl: 'https://discord.gg/custom',
      },
    });

    renderComponent();

    // Check custom benefits
    expect(screen.getByText('Custom benefit 1')).toBeInTheDocument();
    expect(screen.getByText('Custom benefit 2')).toBeInTheDocument();
    expect(screen.queryByText('Industry networking & recruitment events')).not.toBeInTheDocument();

    // Check custom discord URL
    const discordLink = screen.getByRole('link', { name: /Jump into Discord/i });
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/custom');
  });

  it('navigates to /join when Join IEEE button is clicked', () => {
    (sanityHooks.useCommittees as any).mockReturnValue({
      committees: [],
    });
    (sanityHooks.useSiteSettings as any).mockReturnValue({
      settings: null,
    });

    renderComponent();

    const joinButton = screen.getByRole('button', { name: /Join IEEE/i });
    fireEvent.click(joinButton);

    expect(mockNavigate).toHaveBeenCalledWith('/join');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
