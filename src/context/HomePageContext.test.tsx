import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePageProvider, useHomePageData } from './HomePageContext';
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

describe('HomePageContext', () => {
  it('HomePageProvider should provide the value from useHomePage', () => {
    // Setup the mock to return a specific value
    const mockData = {
      data: { heroImage: 'test.jpg' },
      loading: false,
      error: null,
      refetch: vi.fn(),
    };
    vi.mocked(useHomePage).mockReturnValue(mockData);

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

  it('useHomePageData should return the default value when rendered outside the provider', () => {
    // Clear the mock just in case, though it shouldn't be called in this test
    vi.mocked(useHomePage).mockClear();

    render(<DummyComponent />);

    // Default values are: loading: true, data: null, error: null
    expect(screen.getByTestId('loading').textContent).toBe('true');
    expect(screen.getByTestId('error').textContent).toBe('null');
    expect(screen.getByTestId('data').textContent).toBe('null');

    // Ensure the hook wasn't called since we didn't use the provider
    expect(useHomePage).not.toHaveBeenCalled();
  });
});
