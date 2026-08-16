import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePageProvider } from './HomePageProvider';
import { useHomePageData } from './HomePageContext';
import { useHomePage } from '../hooks/useSanityData';
import React from 'react';

// Mock the hook
vi.mock('../hooks/useSanityData', () => ({
  useHomePage: vi.fn(),
}));

// A dummy component to consume the context
const DummyComponent = () => {
  const data = useHomePageData();
  return (
    <div>
      <span data-testid="loading">{data.loading.toString()}</span>
      <span data-testid="error">{data.error ? data.error.message : 'null'}</span>
      <span data-testid="data">{data.data ? 'has-data' : 'null'}</span>
    </div>
  );
};

describe('HomePageProvider', () => {
  it('should provide the value from useHomePage to children', () => {
    // Setup the mock to return a specific value
    const mockData = {
      data: { heroImage: 'test.jpg' },
      loading: false,
      error: null,
      refetch: vi.fn(),
    };
    vi.mocked(useHomePage).mockReturnValue(mockData as any);

    render(
      <HomePageProvider>
        <DummyComponent />
      </HomePageProvider>
    );

    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('null');
    expect(screen.getByTestId('data').textContent).toBe('has-data');

    // Verify the hook was actually called
    expect(useHomePage).toHaveBeenCalled();
  });

  it('should pass loading state correctly', () => {
    // Setup the mock to return a specific loading state
    const mockData = {
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    };
    vi.mocked(useHomePage).mockReturnValue(mockData as any);

    render(
      <HomePageProvider>
        <DummyComponent />
      </HomePageProvider>
    );

    expect(screen.getByTestId('loading').textContent).toBe('true');
    expect(screen.getByTestId('error').textContent).toBe('null');
    expect(screen.getByTestId('data').textContent).toBe('null');
  });

  it('should pass error state correctly', () => {
    // Setup the mock to return a specific error state
    const mockData = {
      data: null,
      loading: false,
      error: new Error('Failed to fetch data'),
      refetch: vi.fn(),
    };
    vi.mocked(useHomePage).mockReturnValue(mockData as any);

    render(
      <HomePageProvider>
        <DummyComponent />
      </HomePageProvider>
    );

    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('Failed to fetch data');
    expect(screen.getByTestId('data').textContent).toBe('null');
  });
});
