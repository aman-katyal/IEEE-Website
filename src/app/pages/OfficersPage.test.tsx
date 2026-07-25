import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfficersPage, getOrderedLeaders } from './OfficersPage';
import '@testing-library/jest-dom';
import { Leader } from '../../data/leadership';

// Create mock data for integration tests
const mockLeadersIntegration: Leader[] = [
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
  useLeaders: () => ({ leaders: mockLeadersIntegration, loading: false, error: null }),
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

describe('OfficersPage Integration', () => {
  it('should group officers by category and render them properly on desktop', () => {
    render(<OfficersPage />);

    expect(screen.getByText('Executive Committee')).toBeInTheDocument();
    expect(screen.getByText('Technical Committee Chairs')).toBeInTheDocument();
    expect(screen.getByText('Operational Leads')).toBeInTheDocument();
    expect(screen.getByText('Member Involvement')).toBeInTheDocument();

    expect(screen.getByText('Executive John')).toBeInTheDocument();
    expect(screen.getByText('Tech Jane')).toBeInTheDocument();
    expect(screen.getByText('Ops Jim')).toBeInTheDocument();
    expect(screen.getByText('Member Jill')).toBeInTheDocument();
  });
});

describe('Officers Grouping Logic (getOrderedLeaders)', () => {
  const mockLeaders: Leader[] = [
    { _id: '1', name: 'Alice', role: 'President', email: 'alice@example.com' },
    { _id: '2', name: 'Bob', role: 'ROV Chair', email: 'bob@example.com' },
    { _id: '3', name: 'Charlie', role: 'Head of Infrastructure', email: 'charlie@example.com' },
    { _id: '4', name: 'Diana', role: 'Event Coordinator', email: 'diana@example.com' },
    { _id: '5', name: 'Eve', role: 'General Member', email: 'eve@example.com', category: 'executive' },
  ];

  it('should group officers by explicit category', () => {
    const executives = getOrderedLeaders(mockLeaders, null, 'executive');
    expect(executives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Alice' }),
        expect.objectContaining({ name: 'Eve' }),
      ])
    );
    expect(executives).toHaveLength(2);
  });

  it('should group officers by inferred role (executive)', () => {
    const executives = getOrderedLeaders(mockLeaders, null, 'executive');
    expect(executives.some(l => l.name === 'Alice')).toBe(true);
  });

  it('should group officers by inferred role (technical)', () => {
    const technical = getOrderedLeaders(mockLeaders, null, 'technical');
    expect(technical).toEqual([
      expect.objectContaining({ name: 'Bob' }),
    ]);
  });

  it('should group officers by inferred role (operations)', () => {
    const operations = getOrderedLeaders(mockLeaders, null, 'operations');
    expect(operations).toEqual([
      expect.objectContaining({ name: 'Charlie' }),
    ]);
  });

  it('should fallback to member category if role does not match known patterns', () => {
    const members = getOrderedLeaders(mockLeaders, null, 'member');
    expect(members).toEqual([
      expect.objectContaining({ name: 'Diana' }),
    ]);
  });

  it('should order officers based on config', () => {
    const config = {
      executiveOrder: [{ _id: '5' }, { _id: '1' }]
    };

    const executives = getOrderedLeaders(mockLeaders, config, 'executive');
    expect(executives).toHaveLength(2);
    expect(executives[0].name).toBe('Eve');
    expect(executives[1].name).toBe('Alice');
  });

  it('should append unordered officers to the end', () => {
    const mockLeadersUnordered: Leader[] = [
      { _id: '1', name: 'Alice', role: 'President', email: 'alice@example.com' },
      { _id: '2', name: 'Bob', role: 'Vice President', email: 'bob@example.com' },
      { _id: '3', name: 'Charlie', role: 'Secretary', email: 'charlie@example.com' },
    ];

    const config = {
      executiveOrder: [{ _id: '3' }, { _id: '1' }]
    };

    const executives = getOrderedLeaders(mockLeadersUnordered, config, 'executive');
    expect(executives).toHaveLength(3);
    expect(executives[0].name).toBe('Charlie');
    expect(executives[1].name).toBe('Alice');
    expect(executives[2].name).toBe('Bob');
  });

  it('should return un-ordered array if config array is empty or undefined', () => {
    const config1 = { executiveOrder: [] };
    const executives1 = getOrderedLeaders(mockLeaders, config1, 'executive');
    expect(executives1[0].name).toBe('Alice');
    expect(executives1[1].name).toBe('Eve');

    const config2 = {};
    const executives2 = getOrderedLeaders(mockLeaders, config2, 'executive');
    expect(executives2[0].name).toBe('Alice');
    expect(executives2[1].name).toBe('Eve');
  });
});
