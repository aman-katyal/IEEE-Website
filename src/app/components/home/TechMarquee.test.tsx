import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TechMarquee } from './TechMarquee';
import { MemoryRouter } from 'react-router';
import * as nextThemes from 'next-themes';
import * as sanityHooks from '../../../hooks/useSanityData';

// Mock dependencies
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../../hooks/useSanityData', () => ({
  usePartners: vi.fn(),
}));

describe('TechMarquee', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (nextThemes.useTheme as any).mockReturnValue({ theme: 'dark' });
    (sanityHooks.usePartners as any).mockReturnValue({
      partners: [
        { name: 'Texas Instruments', domain: 'ti.com', tier: 'Gold' },
        { name: 'SpaceX', domain: 'spacex.com', tier: 'Gold' },
        { name: 'Intel', domain: 'intel.com', tier: 'Silver' },
      ],
      loading: false,
    });
  });

  const renderComponent = () => render(
    <MemoryRouter>
      <TechMarquee />
    </MemoryRouter>
  );

  it('mounts and outputs expected list of static partners (like Texas Instruments)', () => {
    renderComponent();

    // Test for elements based on what the component actually renders (images with alt text)
    const tiElements = screen.getAllByRole('img', { name: 'Texas Instruments' });
    expect(tiElements.length).toBeGreaterThan(0);

    const spacexElements = screen.getAllByRole('img', { name: 'SpaceX' });
    expect(spacexElements.length).toBeGreaterThan(0);

    const intelElements = screen.getAllByRole('img', { name: 'Intel' });
    expect(intelElements.length).toBeGreaterThan(0);

    // Also Check for link text to ensure it mounted completely
    expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
  });

  it('renders correctly with sanity partners', () => {
    (sanityHooks.usePartners as any).mockReturnValue({
      partners: [{ name: 'Custom Tech Corp', domain: 'customtech.com', logoUrl: 'https://example.com/logo.png' }]
    });

    renderComponent();

    const customElements = screen.getAllByRole('img', { name: 'Custom Tech Corp' });
    expect(customElements.length).toBeGreaterThan(0);
  });

  it('tests image error handling to text fallback', () => {
    renderComponent();

    const images = screen.getAllByRole('img', { name: 'Texas Instruments' });
    const image = images[0];

    // Fire first error - should switch to favicon
    fireEvent.error(image);

    // Fire error again to fallback to span text
    fireEvent.error(image);

    // Should fallback to span text
    const textFallback = screen.getAllByText('Texas Instruments');
    expect(textFallback.length).toBeGreaterThan(0);
  });
});
