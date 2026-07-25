import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfficersPage } from './OfficersPage';
import '@testing-library/jest-dom';
import { Leader } from '../../data/leadership';

// Create mock data for different categories
const mockLeaders: Leader[] = [
  {
    _id: '1',
    name: 'Executive John',
    role: 'President',
    email: 'exec@example.com',
    category: 'executive',
    image: 'test1.jpg'
  },
  {
    _id: '2',
    name: 'Tech Jane',
    role: 'Software Chair',
    email: 'tech@example.com',
    category: 'technical',
    image: 'test2.jpg'
  },
  {
    _id: '3',
    name: 'Ops Jim',
    role: 'Operations Head',
    email: 'ops@example.com',
    category: 'operations',
    image: 'test3.jpg'
  },
  {
    _id: '4',
    name: 'Member Jill',
    role: 'Member Lead',
    email: 'member@example.com',
    category: 'member',
    image: 'test4.jpg'
  }
];

vi.mock('../../hooks/useSanityData', () => ({
  useLeaders: () => ({ leaders: mockLeaders, loading: false, error: null }),
  useOfficersConfig: () => ({ config: null, loading: false, error: null })
}));

// Mock to act as desktop
vi.mock('../components/ui/use-mobile', () => ({
  useIsMobile: () => false
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' })
}));

// Mock boneyard-js/react
vi.mock('boneyard-js/react', () => ({
  Skeleton: ({ children }: any) => <div data-testid="skeleton">{children}</div>
}));

// Mock MagneticWrapper
vi.mock('../components/ui/MagneticWrapper', () => ({
  MagneticWrapper: ({ children }: any) => <div>{children}</div>
}));

describe('Officers Grouping Logic', () => {
  it('should group officers by category and render them properly on desktop', () => {
    render(<OfficersPage />);

    // Verify categories are rendered as headings
    expect(screen.getByText('Executive Committee')).toBeInTheDocument();
    expect(screen.getByText('Technical Committee Chairs')).toBeInTheDocument();
    expect(screen.getByText('Operational Leads')).toBeInTheDocument();
    expect(screen.getByText('Member Involvement')).toBeInTheDocument();

    // Verify individual officers are rendered under their respective categories
    expect(screen.getByText('Executive John')).toBeInTheDocument();
    expect(screen.getByText('Tech Jane')).toBeInTheDocument();
    expect(screen.getByText('Ops Jim')).toBeInTheDocument();
    expect(screen.getByText('Member Jill')).toBeInTheDocument();
  });
});
