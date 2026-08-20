import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrivacyPage } from './PrivacyPage';
import { MemoryRouter } from 'react-router';

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

describe('PrivacyPage', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('renders privacy policy heading and key sections', () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(/1\. Overview & Commitment/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Information Collection & Usage/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Financial Security & Dues Processing/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Media & Event Photography/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Questions & Contact Information/i)).toBeInTheDocument();
  });

  it('renders back to home navigation link', () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>
    );

    const backLink = screen.getByRole('link', { name: /back to home/i });
    expect(backLink).toHaveAttribute('href', '/');
  });
});
