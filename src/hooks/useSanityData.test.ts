import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import {
  useCommittees,
  useCommittee,
  useCornerstoneCommittees,
  useLeaders,
  useOfficersConfig,
  useHomePage,
  useAboutPage,
  useSiteSettings,
  usePartners
} from './useSanityData';

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// Mock sanity clients
vi.mock('../lib/sanity', () => ({
  client: { fetch: vi.fn() },
  previewClient: { fetch: vi.fn() },
}));

describe('useSanityData hooks with React Query', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Clear URL search params for preview detection
    Object.defineProperty(window, 'location', {
      value: { search: '', hostname: 'localhost' },
      writable: true
    });
  });

  const setupQueryMock = (data: any, isLoading = false, error = null) => {
    vi.mocked(useQuery).mockReturnValue({
      data,
      isLoading,
      error,
      refetch: vi.fn(),
    } as any);
  };

  it('should return committees data on success', () => {
    const mockData = [{ id: '1', name: 'Test Committee' }];
    setupQueryMock(mockData);

    const { result } = renderHook(() => useCommittees());

    expect(result.current.committees).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle failure correctly', () => {
    const mockError = new Error('Fetch failed');
    setupQueryMock(null, false, mockError);

    const { result } = renderHook(() => useCommittees());

    expect(result.current.committees).toEqual([]);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.loading).toBe(false);
  });

  it('should return specific committee data', () => {
    const mockData = { id: 'test', name: 'Test Committee' };
    setupQueryMock(mockData);

    const { result } = renderHook(() => useCommittee('test'));

    expect(result.current.committee).toEqual(mockData);
    expect(result.current.loading).toBe(false);
  });

  it('should return cornerstone committees', () => {
    const mockData = [{ id: '1', name: 'Operations' }];
    setupQueryMock(mockData);

    const { result } = renderHook(() => useCornerstoneCommittees());

    expect(result.current.committees).toEqual(mockData);
  });

  it('should return leaders data', () => {
    const mockData = [{ id: '1', name: 'Leader 1' }];
    setupQueryMock(mockData);

    const { result } = renderHook(() => useLeaders());

    expect(result.current.leaders).toEqual(mockData);
  });

  it('should return officers config', () => {
    const mockData = { executiveOrder: [] };
    setupQueryMock(mockData);

    const { result } = renderHook(() => useOfficersConfig());

    expect(result.current.config).toEqual(mockData);
  });

  it('should return home page data', () => {
    const mockData = { title: 'Home' };
    setupQueryMock(mockData);

    const { result } = renderHook(() => useHomePage());

    expect(result.current.data).toEqual(mockData);
  });

  it('should return about page data', () => {
    const mockData = { title: 'About' };
    setupQueryMock(mockData);

    const { result } = renderHook(() => useAboutPage());

    expect(result.current.data).toEqual(mockData);
  });

  it('should return site settings', () => {
    const mockData = { discordUrl: 'https://discord.com' };
    setupQueryMock(mockData);

    const { result } = renderHook(() => useSiteSettings());

    expect(result.current.settings).toEqual(mockData);
  });

  it('should return partners data', () => {
    const mockData = [{ name: 'Partner', tier: 'Gold' }];
    setupQueryMock(mockData);

    const { result } = renderHook(() => usePartners());

    expect(result.current.partners).toEqual(mockData);
  });
});
