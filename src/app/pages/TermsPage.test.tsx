import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TermsPage } from './TermsPage';
import { MemoryRouter } from 'react-router';

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

describe('TermsPage', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('renders terms of use heading and key sections', () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /terms of use/i })).toBeInTheDocument();
    expect(screen.getByText(/1\. Acceptance of Terms/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Member Code of Conduct/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Lab & Equipment Access/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Projects & Open Source/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Governance & Bylaws/i)).toBeInTheDocument();
  });

  it('renders links to constitution and back to home', () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /view branch constitution & bylaws/i })).toHaveAttribute('href', '/constitution');
  });
});
