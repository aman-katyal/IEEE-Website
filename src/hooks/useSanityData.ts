import { useState, useEffect, useCallback } from 'react'
import { client, previewClient } from '../lib/sanity'
import groq from 'groq'
import type { Committee, CornerstoneCommittee } from '../data/committees/types'

const SECTION_PROJECTION = groq`
  sections[]{
    ...,
    "type": select(
      _type == "textSection" => "text",
      _type == "projectsSection" => "projects",
      _type == "faqSection" => "faq",
      _type == "gallerySection" => "gallery",
      _type == "contactSection" => "contact",
      _type
    ),
    "image": coalesce(image.asset->url, image),
    items[]{
      ...,
      "image": coalesce(image.asset->url, image)
    }
  }
`;

// Simple in-memory cache
const cache: Record<string, any> = {};

// Helper to generate a cache key from query and params
const getCacheKey = (query: string, params?: any) => {
  return `${query}-${JSON.stringify(params || {})}`;
};

// Simple helper to detect if we should use the preview client
const usePreview = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('preview') || window.location.hostname.includes('sanity.studio') || window.self !== window.top;
};

/**
 * Prefetches data from Sanity and populates the cache.
 * Useful for improving perceived performance during navigation.
 */
export async function prefetchData(query: string, params?: any) {
  const cacheKey = getCacheKey(query, params);
  if (cache[cacheKey]) return cache[cacheKey];

  try {
    const data = await client.fetch(query, params);
    cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error('Prefetch failed:', error);
    return null;
  }
}

function useDataFetching<T>(query: string, params?: any) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isPreview = usePreview();
  const activeClient = isPreview ? previewClient : client;
  const cacheKey = getCacheKey(query, params);

  const fetchData = useCallback(async (ignoreCache = false) => {
    if (!ignoreCache && !isPreview && cache[cacheKey]) {
      setData(cache[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      const result = await activeClient.fetch(query, params);
      if (!isPreview) cache[cacheKey] = result;
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [query, JSON.stringify(params), isPreview, activeClient, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: () => fetchData(true) };
}

export function useCommittees() {
  const query = groq`*[_type == "committee"]{
    ...,
    "id": id.current,
    "image": coalesce(image.asset->url, image),
    ${SECTION_PROJECTION}
  }`
  const { data, loading, error } = useDataFetching<Committee[]>(query);
  return { committees: data || [], loading, error };
}

export function useCommittee(id: string) {
  const query = groq`*[_type == "committee" && id.current == $id][0]{
    ...,
    "id": id.current,
    "image": coalesce(image.asset->url, image),
    ${SECTION_PROJECTION}
  }`
  const { data, loading, error } = useDataFetching<Committee>(query, { id });
  return { committee: data, loading, error };
}

export function useCornerstoneCommittees() {
  const query = groq`*[_type == "cornerstone"]{
    ...,
    "id": id.current
  }`
  const { data, loading, error } = useDataFetching<CornerstoneCommittee[]>(query);
  return { committees: data || [], loading, error };
}

export function useLeaders() {
  const query = groq`*[_type == "leader"] | order(order asc){
    ...,
    "category": coalesce(category, 
      select(
        role match "*President*" || role match "*Secretary*" || role match "*Treasurer*" => "executive",
        role match "*Chair*" || role match "*Lead*" => "technical",
        role match "*Infrastructure*" || role match "*Industrial*" || role match "*Operations*" => "operations",
        "member"
      )
    ),
    "image": coalesce(image.asset->url, image)
  }`
  const { data, loading, error } = useDataFetching<any[]>(query);
  return { leaders: data || [], loading, error };
}

export function useOfficersConfig() {
  const query = groq`*[_type == "officersConfig"][0]{
    ...,
    executiveOrder[]->{ _id },
    technicalOrder[]->{ _id },
    operationsOrder[]->{ _id },
    memberOrder[]->{ _id }
  }`
  const { data, loading, error } = useDataFetching<any>(query);
  return { config: data, loading, error };
}
