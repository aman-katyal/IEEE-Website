import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfficersPage } from './OfficersPage';
import '@testing-library/jest-dom';
import { Leader } from '../../data/leadership';

// Create mock data
const mockLeaders: Leader[] = [
  {
    _id: '1',
    name: 'John Doe',
    role: 'President',
    email: 'john@example.com',
    category: 'executive',
    image: 'test.jpg'
  }
];

vi.mock('../../hooks/useSanityData', () => ({
  useLeaders: () => ({ leaders: mockLeaders, loading: false, error: null }),
  useOfficersConfig: () => ({ config: null, loading: false, error: null })
}));

vi.mock('../components/ui/use-mobile', () => ({
  useIsMobile: () => true
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

describe('OfficersPage Mobile Behavior', () => {
  it('should render accordions on mobile screens', () => {
    render(<OfficersPage />);

    // On mobile, the Accordion trigger for "Executive Committee" should be present
    const trigger = screen.getByRole('button', { name: /Executive Committee/i });
    expect(trigger).toBeInTheDocument();
  });
});
