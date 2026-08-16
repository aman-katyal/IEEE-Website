import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useHomePageData } from './HomePageContext';
import { useHomePage } from '../hooks/useSanityData';
import React from 'react';

// Mock the hook to ensure it isn't accidentally called
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
