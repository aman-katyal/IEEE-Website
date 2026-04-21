import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { 
  useCommittees, 
  useCommittee,
  useCornerstoneCommittees,
  useLeaders, 
  useOfficersConfig,
  useHomePage,
  useAboutPage,
  useSiteSettings, 
  usePartners,
  prefetchData,
  clearCache 
} from './useSanityData'
import { client, previewClient } from '../lib/sanity'

// Mock the sanity lib
vi.mock('../lib/sanity', () => ({
  client: {
    fetch: vi.fn(),
  },
  previewClient: {
    fetch: vi.fn(),
  },
  urlFor: vi.fn(() => ({
    url: () => 'mock-url'
  }))
}))

describe('useSanityData hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearCache()
  })

  describe('useCommittees', () => {
    it('should return committees data on success', async () => {
      const mockData = [
        { _id: '1', name: 'Committee 1', id: 'c1' },
        { _id: '2', name: 'Committee 2', id: 'c2' }
      ]
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useCommittees())

      expect(result.current.loading).toBe(true)
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.committees).toEqual(mockData)
      expect(result.current.error).toBeNull()
    })

    it('should handle failure correctly', async () => {
      vi.mocked(client.fetch).mockRejectedValue(new Error('Fetch failed'))
      const { result } = renderHook(() => useCommittees())
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.committees).toEqual([])
      expect(result.current.error).toBeDefined()
    })
  })

  describe('useCommittee', () => {
    it('should return specific committee data', async () => {
      const mockData = { _id: '1', name: 'Computer Society', id: 'cs' }
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useCommittee('cs'))

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.committee).toEqual(mockData)
      expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('id.current == $id'), { id: 'cs' })
    })
  })

  describe('useCornerstoneCommittees', () => {
    it('should return cornerstone committees', async () => {
      const mockData = [{ _id: '1', name: 'Cornerstone 1' }]
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useCornerstoneCommittees())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.committees).toEqual(mockData)
    })
  })

  describe('useLeaders', () => {
    it('should return leaders data', async () => {
      const mockData = [{ _id: 'l1', name: 'Leader 1' }]
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useLeaders())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.leaders).toEqual(mockData)
    })
  })

  describe('useOfficersConfig', () => {
    it('should return officers config', async () => {
      const mockData = { executiveOrder: [] }
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useOfficersConfig())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.config).toEqual(mockData)
    })
  })

  describe('useHomePage', () => {
    it('should return home page data', async () => {
      const mockData = { title: 'Welcome' }
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useHomePage())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.data).toEqual(mockData)
    })
  })

  describe('useAboutPage', () => {
    it('should return about page data', async () => {
      const mockData = { title: 'About Us' }
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useAboutPage())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.data).toEqual(mockData)
    })
  })

  describe('useSiteSettings', () => {
    it('should return site settings', async () => {
      const mockData = { discordUrl: 'url' }
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useSiteSettings())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.settings).toEqual(mockData)
    })
  })

  describe('usePartners', () => {
    it('should return partners data', async () => {
      const mockData = [{ name: 'Partner 1', tier: 'Gold' }]
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => usePartners())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.partners).toEqual(mockData)
    })
  })

  describe('Preview Mode', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // @ts-ignore
      delete window.location;
      window.location = { ...originalLocation, search: '' };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('should use previewClient when preview param is present', async () => {
      // @ts-ignore
      window.location.search = '?preview=true';

      const mockData = [{ id: 'preview-1' }]
      vi.mocked(previewClient.fetch).mockResolvedValue(mockData)

      const { result } = renderHook(() => useCommittees())
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.committees).toEqual(mockData)
      expect(previewClient.fetch).toHaveBeenCalled()
      expect(client.fetch).not.toHaveBeenCalled()
    })
  })

  describe('Caching and Prefetching', () => {
    it('should use cache for subsequent requests', async () => {
      const mockData = [{ id: '1' }]
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      // First call
      const { result: result1, unmount: unmount1 } = renderHook(() => useCommittees())
      await waitFor(() => expect(result1.current.loading).toBe(false))
      expect(client.fetch).toHaveBeenCalledTimes(1)
      unmount1()

      // Second call should use cache
      const { result: result2 } = renderHook(() => useCommittees())
      await waitFor(() => expect(result2.current.loading).toBe(false))
      expect(result2.current.committees).toEqual(mockData)
      expect(client.fetch).toHaveBeenCalledTimes(1) // Still 1
    })

    it('should clear cache correctly', async () => {
      const mockData = [{ id: '1' }]
      vi.mocked(client.fetch).mockResolvedValue(mockData)

      // First call
      const { result: result1, unmount: unmount1 } = renderHook(() => useCommittees())
      await waitFor(() => expect(result1.current.loading).toBe(false))
      unmount1()

      clearCache()

      // Second call after clear cache should fetch again
      const { result: result2 } = renderHook(() => useCommittees())
      await waitFor(() => expect(result2.current.loading).toBe(false))
      expect(client.fetch).toHaveBeenCalledTimes(2)
    })

    it('prefetchData should populate cache', async () => {
      const mockData = [{ id: '1' }]
      vi.mocked(client.fetch).mockResolvedValue(mockData)
      const query = 'custom-query'

      await prefetchData(query)
      expect(client.fetch).toHaveBeenCalledTimes(1)

      // Calling it again should use cache
      const result = await prefetchData(query)
      expect(result).toEqual(mockData)
      expect(client.fetch).toHaveBeenCalledTimes(1) // Still 1
    })
  })
})
