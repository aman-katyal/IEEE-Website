import { useState, useEffect, useCallback } from 'react'
import { client, previewClient } from '../lib/sanity'
import groq from 'groq'
import type { Committee, CornerstoneCommittee } from '../data/committees/types'
import { committees as staticCommittees, cornerstoneCommittees as staticCornerstone } from '../data/committees'
import { leaders as staticLeaders } from '../data/leadership'

const SECTION_PROJECTION = `
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
    const data = await client?.fetch(query, params);
    if (data) cache[cacheKey] = data;
    return data;
  } catch (error) {
    console.error('Prefetch failed:', error);
    return null;
  }
}

function useDataFetching<T>(query: string, params?: any, fallbackData?: T) {
  const [data, setData] = useState<T | null>(fallbackData || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isPreview = usePreview();
  const activeClient = isPreview ? previewClient : client;
  const cacheKey = getCacheKey(query, params);

  const fetchData = useCallback(async (ignoreCache = false) => {
    if (!activeClient) {
      console.warn('[useDataFetching] Sanity client not initialized. Falling back to local data. Query:', query);
      if (fallbackData) setData(fallbackData);
      setLoading(false);
      return;
    }

    if (!ignoreCache && !isPreview && cache[cacheKey]) {
      setData(cache[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      const result = await activeClient.fetch(query, params);
      if (!isPreview) cache[cacheKey] = result;
      
      // If Sanity returns null/empty array but we have fallback, use fallback
      if ((result === null || (Array.isArray(result) && result.length === 0)) && fallbackData) {
        setData(fallbackData);
      } else {
        setData(result);
      }
      setLoading(false);
    } catch (err) {
      console.warn('[useDataFetching] Fetch failed. Falling back to local data:', err);
      if (fallbackData) setData(fallbackData);
      setError(err as Error);
      setLoading(false);
    }
  }, [query, JSON.stringify(params), isPreview, activeClient, cacheKey, fallbackData]);

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
  const { data, loading, error } = useDataFetching<Committee[]>(query, {}, staticCommittees);
  return { committees: data || [], loading, error };
}

export function useCommittee(id: string) {
  const query = groq`*[_type == "committee" && id.current == $id][0]{
    ...,
    "id": id.current,
    "image": coalesce(image.asset->url, image),
    ${SECTION_PROJECTION}
  }`
  
  const fallback = staticCommittees.find(c => c.id.toLowerCase() === id.toLowerCase());
  const { data, loading, error } = useDataFetching<Committee>(query, { id: id.toLowerCase() }, fallback);
  return { committee: data, loading, error };
}

export function useCornerstoneCommittees() {
  const query = groq`*[_type == "cornerstone"]{
    ...,
    "id": id.current
  }`
  const { data, loading, error } = useDataFetching<CornerstoneCommittee[]>(query, {}, staticCornerstone);
  return { committees: data || [], loading, error };
}

export function useLeaders() {
  const query = groq`*[_type == "leader"] | order(order asc){
    ...,
    "image": coalesce(image.asset->url, image)
  }`
  const { data, loading, error } = useDataFetching<any[]>(query, {}, staticLeaders);
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

export function useHomePage() {
  const query = groq`*[_type == "homePage"][0]{
    ...,
    "heroImage": heroImage.asset->url,
    "aboutImage": aboutImage.asset->url
  }`
  const { data, loading, error } = useDataFetching<any>(query);
  return { data, loading, error };
}

export function useAboutPage() {
  const query = groq`*[_type == "aboutPage"][0]{
    ...,
    sections[]{
      ...,
      "image": image.asset->url
    }
  }`
  const { data, loading, error } = useDataFetching<any>(query);
  return { data, loading, error };
}

export interface SiteSettings {
  discordUrl?: string;
  duesDescription?: string;
  duesBenefits?: string[];
  duesOptions?: {
    name: string;
    subtitle: string;
    price: string;
  }[];
  paymentUrl?: string;
  calendarUrl?: string;
  calendarId?: string;
  branchConstitution?: {
    name: string;
    description: string;
    pdfUrl: string;
  };
  committeeBylaws?: {
    name: string;
    pdfUrl: string;
  }[];
}

export function useSiteSettings() {
  const query = groq`*[_type == "siteSettings"][0]{
    ...,
    branchConstitution{
      ...,
      "pdfUrl": pdfFile.asset->url
    },
    committeeBylaws[]{
      ...,
      "pdfUrl": pdfFile.asset->url
    }
  }`;
  const { data, loading, error } = useDataFetching<SiteSettings>(query);
  return { settings: data, loading, error };
}
