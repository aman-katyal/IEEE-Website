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
    expect(screen.getByRole('tab', { name: /Technical Committees/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Involvement/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Operations/i })).toBeInTheDocument();
  });


  it('renders technical committees by default', () => {
    render(<CommitteesPage />);

    expect(screen.getByTestId('committees-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('cornerstone-committees-mock')).not.toBeInTheDocument();
    expect(screen.getByTestId('join-cta-mock')).toBeInTheDocument();
  });

  it('toggles to operations committees when button is clicked', () => {
    render(<CommitteesPage />);

    const operationsButton = screen.getByRole('tab', { name: /Operations/i });
    fireEvent.click(operationsButton);

    expect(screen.queryByTestId('committees-mock')).not.toBeInTheDocument();
    expect(screen.getByTestId('cornerstone-committees-mock')).toBeInTheDocument();
    expect(screen.getByText('Showing Operations Committees')).toBeInTheDocument();
  });

  it('supports arrow key keyboard navigation between tabs', () => {
    render(<CommitteesPage />);

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });

    expect(screen.getByRole('tab', { name: /Involvement/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Showing Involvement Committees')).toBeInTheDocument();

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /Operations/i })).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(screen.getByRole('tab', { name: /Technical Committees/i })).toHaveAttribute('aria-selected', 'true');
  });
});
