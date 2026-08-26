import { useQuery } from '@tanstack/react-query';
import { client, previewClient } from '../lib/sanity';
import groq from 'groq';
import type { Committee, CornerstoneCommittee } from '../data/committees/types';
import type { Leader, OfficersConfig, HomePageData, AboutPageData } from '../data/sanity-types';

const SECTION_PROJECTION = `
  "sections": coalesce(sections[]{
    ...,
    "type": select(
      _type == "textSection" => "text",
      _type == "projectsSection" => "projects",
      _type == "faqSection" => "faq",
      _type == "gallerySection" => "gallery",
      _type == "historySection" => "history",
      _type == "contactSection" => "contact",
      _type
    ),
    "image": coalesce(image.asset->url + "?auto=format&q=75", image),
    "items": coalesce(items[]{
      ...,
      "image": coalesce(image.asset->url + "?auto=format&w=800&q=75", image)
    }, [])
  }, [])
`;

// Simple helper to detect if we should use the preview client
const checkIsPreview = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('preview') || window.location.hostname.includes('sanity.studio') || window.self !== window.top;
};

const getActiveClient = () => {
  const isPreview = checkIsPreview();
  return isPreview ? previewClient : client;
};

const inFlightQueries = new Map<string, Promise<any>>();

// React Query hook for data fetching with Stale-While-Revalidate semantics
function useSanityQuery<T>(query: string, params?: Record<string, any>) {
  const activeClient = getActiveClient();
  const isPreview = checkIsPreview();
  const cacheKey = JSON.stringify({ query, params });

  const queryResult = useQuery({
    queryKey: ['sanity', query, params, isPreview],
    queryFn: async (): Promise<T | null> => {
      if (!activeClient) {
        console.warn('[useSanityQuery] Sanity client not initialized. Query:', query);
        return null;
      }

      // Deduplicate simultaneous in-flight requests for identical queries
      if (inFlightQueries.has(cacheKey)) {
        return inFlightQueries.get(cacheKey) as Promise<T | null>;
      }

      const fetchPromise = activeClient
        .fetch(query, params || {})
        .finally(() => {
          inFlightQueries.delete(cacheKey);
        });

      inFlightQueries.set(cacheKey, fetchPromise);
      return (await fetchPromise) as T | null;
    },
    staleTime: isPreview ? 0 : 1000 * 60 * 5, // 5 minutes stale time
    gcTime: 1000 * 60 * 60, // 1 hour cache preservation
    placeholderData: (previousData) => previousData, // SWR: keep previous data while revalidating
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    data: queryResult.data as T | null,
    loading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    refetch: queryResult.refetch,
  };
}

export function useCommittees() {
  const query = groq`*[_type == "committee"]{
    ...,
    "id": id.current,
    "image": coalesce(image.asset->url + "?auto=format&w=1200&q=75", image),
    "chair": coalesce(chair->name, chair),
    "email": coalesce(email, chair->email),
    ${SECTION_PROJECTION}
  }`;
  const { data, loading, error } = useSanityQuery<Committee[]>(query);
  return { committees: data || [], loading, error };
}

export function useCommittee(id: string) {
  const query = groq`*[_type == "committee" && id.current == $id][0]{
    ...,
    "id": id.current,
    "image": coalesce(image.asset->url + "?auto=format&w=1200&q=75", image),
    "chair": coalesce(chair->name, chair),
    "email": coalesce(email, chair->email),
    ${SECTION_PROJECTION}
  }`;
  
  const { data, loading, error } = useSanityQuery<Committee>(query, { id: id.toLowerCase() });
  return { committee: data, loading, error };
}

export function useCornerstoneCommittees() {
  const query = groq`*[_type == "cornerstone"]{
    ...,
    "id": id.current,
    "leads": coalesce(leads[]{
      ...,
      "name": coalesce(officer->name, name),
      "email": coalesce(officer->email, email)
    }, [])
  }`;
  const { data, loading, error } = useSanityQuery<CornerstoneCommittee[]>(query);
  return { committees: data || [], loading, error };
}

export function useLeaders() {
  const query = groq`*[_type == "leader"]{
    ...,
    "image": coalesce(image.asset->url + "?auto=format&w=480&q=75", image)
  }`;
  const { data, loading, error } = useSanityQuery<Leader[]>(query);
  return { leaders: data || [], loading, error };
}

export function useOfficersConfig() {
  const query = groq`*[_type == "officersConfig"][0]{
    ...,
    "executiveOrder": coalesce(executiveOrder[]->{ _id }, []),
    "technicalOrder": coalesce(technicalOrder[]->{ _id }, []),
    "operationsOrder": coalesce(operationsOrder[]->{ _id }, []),
    "memberOrder": coalesce(memberOrder[]->{ _id }, [])
  }`;
  const { data, loading, error } = useSanityQuery<OfficersConfig>(query);
  return { config: data, loading, error };
}

export function useHomePage() {
  const query = groq`*[_type == "homePage"][0]{
    ...,
    "heroImage": coalesce(heroImage.asset->url + "?auto=format&w=1600&q=75", heroImage.asset->url),
    "alumniCompanies": coalesce(alumniCompanies[], [])
  }`;
  const { data, loading, error, refetch } = useSanityQuery<HomePageData>(query);
  return { data, loading, error, refetch };
}

export function useAboutPage() {
  const query = groq`*[_type == "aboutPage"][0]{
    ...,
    "timeline": coalesce(timeline[]{
      ...,
      "gold": coalesce(isGoldAccent, false)
    }, []),
    "sections": coalesce(sections[]{
      ...,
      "image": coalesce(image.asset->url + "?auto=format&w=1000&q=75", image.asset->url)
    }, [])
  }`;
  const { data, loading, error } = useSanityQuery<AboutPageData>(query);
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
  calendarIcalUrl?: string;
  partnersHeroTitle?: string;
  partnersHeroSubtitle?: string;
  partnersProspectusUrl?: string;
  showCorporateTiers?: boolean;
  hidePartners?: boolean;
  industrialRelationsEmail?: string;
  partnerTierDescriptions?: {
    tier: string;
    color: string;
    description: string;
  }[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  ctaBenefits?: string[];
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
    "committeeBylaws": coalesce(committeeBylaws[]{
      ...,
      "pdfUrl": pdfFile.asset->url
    }, []),
    "socialLinks": coalesce(socialLinks[], []),
    "ctaBenefits": coalesce(ctaBenefits[], []),
    "partnersProspectusUrl": partnersProspectusFile.asset->url
  }`;
  const { data, loading, error } = useSanityQuery<SiteSettings>(query);
  return { settings: data, loading, error };
}

export interface Partner {
  name: string;
  domain?: string;
  websiteUrl?: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  logoUrl?: string;
  order?: number;
}

export function usePartners() {
  const query = groq`*[_type == "partner"] | order(order asc){
    ...,
    "logoUrl": coalesce(logo.asset->url + "?auto=format&w=300&q=75", logo.asset->url),
    "websiteUrl": coalesce(websiteUrl, select(defined(domain) => "https://" + domain, null))
  }`;
  const { data, loading, error } = useSanityQuery<Partner[]>(query);
  return { partners: data || [], loading, error };
}

// Export a dummy prefetchData to keep compatibility with existing components
// React Query handles prefetching differently (via queryClient.prefetchQuery)
export async function prefetchData(query: string, params?: any) {
  // We can just rely on the active client for this for now, though best practice
  // is to use queryClient.prefetchQuery in components
  const activeClient = getActiveClient();
  if (!activeClient) return null;
  try {
    return await activeClient.fetch(query, params || {});
  } catch (err) {
    return null;
  }
}
