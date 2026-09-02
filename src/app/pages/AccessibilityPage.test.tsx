import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccessibilityPage } from './AccessibilityPage';
import { MemoryRouter } from 'react-router';

import * as useSanityData from '../../hooks/useSanityData';

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

vi.mock('../../hooks/useSanityData', () => ({
  useSiteSettings: vi.fn(),
}));

describe('AccessibilityPage', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    (useSanityData.useSiteSettings as any).mockReturnValue({
      settings: {},
      loading: false,
      error: null,
    });
  });

  it('renders accessibility statement heading and key sections', () => {
    render(
      <MemoryRouter>
        <AccessibilityPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /accessibility statement/i })).toBeInTheDocument();
    expect(screen.getByText(/1\. Our Commitment/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Key Accessibility Features/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Physical Space & Event Accessibility/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Feedback & Contact/i)).toBeInTheDocument();
  });

  it('renders link to Purdue DRC and back to home', () => {
    render(
      <MemoryRouter>
        <AccessibilityPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    const drcLink = screen.getByText(/Purdue Disability Resource Center/i).closest('a');
    expect(drcLink).toHaveAttribute('href', 'https://www.purdue.edu/drc/');
  });
});
