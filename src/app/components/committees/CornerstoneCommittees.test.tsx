import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CornerstoneCommittees } from './CornerstoneCommittees';
import { useCornerstoneCommittees } from '../../../hooks/useSanityData';

// Mock the hook
vi.mock('../../../hooks/useSanityData', () => ({
  useCornerstoneCommittees: vi.fn(),
}));

const mockUseCornerstoneCommittees = vi.mocked(useCornerstoneCommittees);

describe('CornerstoneCommittees', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseCornerstoneCommittees.mockReturnValue({
      committees: [],
      loading: true,
      error: null,
    });

    const { container } = render(<CornerstoneCommittees />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseCornerstoneCommittees.mockReturnValue({
      committees: [],
      loading: false,
      error: new Error('Failed to fetch data') as any,
    });

    render(<CornerstoneCommittees />);
    expect(screen.getByText(/Error loading cornerstone committees: Failed to fetch data/)).toBeInTheDocument();
  });

  it('renders committees when data is loaded', () => {
    mockUseCornerstoneCommittees.mockReturnValue({
      committees: [
        {
          id: 'operations',
          name: 'Operations Team',
          description: 'Operations desc',
          leads: [
            {
              role: 'Head of Ops',
              name: 'John Doe',
              email: 'john@example.com',
              description: 'Manages ops'
            }
          ]
        },
        {
          id: 'involvement',
          name: 'Involvement Team',
          description: 'Involvement desc',
          leads: [
            {
              role: 'Head of Involvement',
              name: 'Jane Doe',
              email: 'jane@example.com',
              description: 'Manages involvement'
            }
          ]
        }
      ],
      loading: false,
      error: null,
    });

    render(<CornerstoneCommittees />);
    expect(screen.getByText('Operations Team')).toBeInTheDocument();
    expect(screen.getByText('Involvement Team')).toBeInTheDocument();
    expect(screen.getByText('Chair: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Chair: Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('filters committees by filterId="operations"', () => {
    mockUseCornerstoneCommittees.mockReturnValue({
      committees: [
        {
          id: 'operations',
          name: 'Operations Team',
          description: 'Operations desc',
          leads: [],
        },
        {
          id: 'involvement',
          name: 'Involvement Team',
          description: 'Involvement desc',
          leads: [],
        }
      ],
      loading: false,
      error: null,
    });

    render(<CornerstoneCommittees filterId="operations" />);
    expect(screen.getByText('Operations Team')).toBeInTheDocument();
    expect(screen.queryByText('Involvement Team')).not.toBeInTheDocument();
  });

  it('filters committees by filterId="involvement"', () => {
    mockUseCornerstoneCommittees.mockReturnValue({
      committees: [
        {
          id: 'operations',
          name: 'Operations Team',
          description: 'Operations desc',
          leads: [],
        },
        {
          id: 'involvement',
          name: 'Involvement Team',
          description: 'Involvement desc',
          leads: [],
        }
      ],
      loading: false,
      error: null,
    });

    render(<CornerstoneCommittees filterId="involvement" />);
    expect(screen.getByText('Involvement Team')).toBeInTheDocument();
    expect(screen.queryByText('Operations Team')).not.toBeInTheDocument();
  });
});
