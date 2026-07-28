import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommitteesPage } from './CommitteesPage';

// Mock child components
vi.mock('../components/committees/Committees', () => ({
  Committees: () => <div data-testid="committees-mock">Committees Component</div>
}));

vi.mock('../components/committees/CornerstoneCommittees', () => ({
  CornerstoneCommittees: () => <div data-testid="cornerstone-committees-mock">Cornerstone Committees Component</div>
}));

vi.mock('../components/home/JoinCTA', () => ({
  JoinCTA: () => <div data-testid="join-cta-mock">Join CTA Component</div>
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

describe('CommitteesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correct header and toggle buttons', () => {
    render(<CommitteesPage />);

    expect(screen.getByText('Our')).toBeInTheDocument();
    expect(screen.getByText('Committees')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Technical Committees/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Involvement/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Operations/i })).toBeInTheDocument();
  });

  it('scrolls to top on mount', () => {
    render(<CommitteesPage />);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('renders technical committees by default', () => {
    render(<CommitteesPage />);

    expect(screen.getByTestId('committees-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('cornerstone-committees-mock')).not.toBeInTheDocument();
    expect(screen.getByTestId('join-cta-mock')).toBeInTheDocument();
  });

  it('toggles to operations committees when button is clicked', () => {
    render(<CommitteesPage />);

    const operationsButton = screen.getByRole('button', { name: /Operations/i });
    fireEvent.click(operationsButton);

    expect(screen.queryByTestId('committees-mock')).not.toBeInTheDocument();
    expect(screen.getByTestId('cornerstone-committees-mock')).toBeInTheDocument();
  });
});
