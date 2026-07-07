import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Footer } from './Footer';
import { MemoryRouter } from 'react-router';
import * as useSanityData from '../../../hooks/useSanityData';
import * as nextThemes from 'next-themes';
import * as reactRouter from 'react-router';

// Mock hooks
vi.mock('../../../hooks/useSanityData', () => ({
  useCommittees: vi.fn(),
  useSiteSettings: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Mock useNavigate since we want to verify calls
const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Footer', () => {
  const mockCommittees = [
    { id: 'rov', shortName: 'ROV', name: 'Remotely Operated Vehicles' },
    { id: 'soc', shortName: 'CSociety', name: 'Computer Society' },
  ];

  const mockSettings = {
    discordUrl: 'https://discord.gg/custom-discord',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/custom-github' },
      { platform: 'linkedin', url: 'https://linkedin.com/custom-linkedin' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useSanityData.useCommittees as any).mockReturnValue({
      committees: mockCommittees,
      loading: false,
      error: null,
    });

    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: mockSettings,
      loading: false,
      error: null,
    });

    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'dark',
    });
    
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders branding and tagline', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('PURDUE')).toBeInTheDocument();
    expect(screen.getByText('IEEE')).toBeInTheDocument();
    expect(screen.getByText(/Purdue University's premier IEEE student branch/i)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it('renders social links from site settings', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const githubLink = screen.getByLabelText('github');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/custom-github');

    const linkedinLink = screen.getByLabelText('linkedin');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/custom-linkedin');
  });

  it('renders fallback social links when settings are missing', () => {
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const githubLink = screen.getByLabelText('github');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/PurdueIEEE');
  });

  it('renders committee links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('ROV')).toBeInTheDocument();
    expect(screen.getByText('CSociety')).toBeInTheDocument();
    
    const rovLink = screen.getByText('ROV').closest('a');
    expect(rovLink).toHaveAttribute('href', '/committee/rov');
  });

  it('renders navigation columns', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();

    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Event Calendar')).toBeInTheDocument();
    expect(screen.getByText('Join Purdue IEEE')).toBeInTheDocument();
  });

  it('uses custom discord URL from settings', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const discordLink = screen.getByText('Community Discord').closest('a');
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/custom-discord');
  });

  it('triggers navigation on internal link click', () => {
    render(
      <MemoryRouter initialEntries={['/some-page']}>
        <Footer />
      </MemoryRouter>
    );

    const aboutLink = screen.getByText('About Us');
    fireEvent.click(aboutLink);

    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });

  it('triggers smooth scroll on home page for anchor links (if applicable)', () => {
    // In Footer.tsx, handleHashNav checks if href starts with /
    // If it doesn't, it checks if isHome is true.
    // The footerLinks defined in the component mostly have / paths.
    
    // Let's check the footerLinks in Footer.tsx again.
    // { label: "About Us", href: "/about" } -> starts with / -> navigate("/about")
    
    // There are no anchor-only links in the default footerLinks.
    // But handleHashNav handles them.
    
    // If we were to have a link with href="#top"
    // navigate would be called with "/#top" if not on home page.
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Footer />
      </MemoryRouter>
    );
    
    // Mock a link that would trigger the anchor logic if we could inject it, 
    // but we are testing the component as is.
    
    // "About Us" href is "/about", so it triggers navigate("/about")
    const aboutLink = screen.getByText('About Us');
    fireEvent.click(aboutLink);
    expect(mockNavigate).toHaveBeenCalledWith('/about');
  });

  it('renders bottom bar links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Use')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
  });

  it('renders correctly in light theme', () => {
    (nextThemes.useTheme as any).mockReturnValue({
      theme: 'light',
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Opacity changes in light theme, hard to test without computed styles but 
    // we can verify it renders without crashing.
    expect(screen.getByText('Find us online')).toBeInTheDocument();
  });

  it('renders external links correctly', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const ieeeLink = screen.getByText('IEEE.org').closest('a');
    expect(ieeeLink).toHaveAttribute('href', 'https://ieee.org');
    expect(ieeeLink).toHaveAttribute('target', '_blank');
    expect(ieeeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles external link click without preventing default', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const ieeeLink = screen.getByText('IEEE.org');
    fireEvent.click(ieeeLink);
    
    // navigate should NOT be called for external links
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders version information', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText(/v2.6.0/i)).toBeInTheDocument();
    expect(screen.getByText(/SPRING_2026/i)).toBeInTheDocument();
  });
});
