import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CyclingStat, type StatItem } from './CyclingStat';

describe('CyclingStat', () => {
  const mockStats: StatItem[] = [
    { value: 42, label: 'Active Members', sublabel: 'Branch Wide', suffix: '+', prefix: '~' },
    { value: 2026, label: 'Current Year', sublabel: 'Academic', suffix: '' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial stat item', () => {
    render(<CyclingStat stats={mockStats} isLight={false} />);
    expect(screen.getByText('Active Members')).toBeInTheDocument();
    expect(screen.getByText('Branch Wide')).toBeInTheDocument();
  });

  it('renders pause/play button when multiple stats are provided and toggles state', () => {
    render(<CyclingStat stats={mockStats} isLight={false} />);
    const pauseBtn = screen.getByRole('button', { name: /pause stats animation/i });
    expect(pauseBtn).toBeInTheDocument();

    fireEvent.click(pauseBtn);
    expect(screen.getByRole('button', { name: /play stats animation/i })).toBeInTheDocument();
  });

  it('does not render pause button when only one stat is provided', () => {
    render(<CyclingStat stats={[mockStats[0]]} isLight={false} />);
    expect(screen.queryByRole('button', { name: /pause stats animation/i })).not.toBeInTheDocument();
  });
});
