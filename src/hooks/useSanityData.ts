import { useQuery } from '@tanstack/react-query';
import { client, previewClient } from '../lib/sanity';
import groq from 'groq';
import type { Committee, CornerstoneCommittee } from '../data/committees/types';

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
    "image": coalesce(image.asset->url + "?auto=format&q=75", image),
    items[]{
      ...,
      "image": coalesce(image.asset->url + "?auto=format&w=800&q=75", image)
    }
  }
`;

// Simple helper to detect if we should use the preview client
const usePreview = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('preview') || window.location.hostname.includes('sanity.studio') || window.self !== window.top;
};

const getActiveClient = () => {
  const isPreview = usePreview();
  return isPreview ? previewClient : client;
};

// React Query hook for data fetching
function useSanityQuery<T>(query: string, params?: Record<string, any>) {
  const activeClient = getActiveClient();
  const isPreview = usePreview();

  const queryResult = useQuery({
    queryKey: ['sanity', query, params, isPreview],
    queryFn: async (): Promise<T | null> => {
      if (!activeClient) {
        console.warn('[useSanityQuery] Sanity client not initialized. Query:', query);
        return null;
      }
      return activeClient.fetch(query, params || {});
    },
    staleTime: isPreview ? 0 : 1000 * 60 * 5, // 5 minutes stale time for production
    refetchOnWindowFocus: false, // Don't refetch on window focus
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
    leads[]{
      ...,
      "name": coalesce(officer->name, name),
      "email": coalesce(officer->email, email)
    }
  }`;
  const { data, loading, error } = useSanityQuery<CornerstoneCommittee[]>(query);
  return { committees: data || [], loading, error };
}

export function useLeaders() {
  const query = groq`*[_type == "leader"]{
    ...,
    "image": coalesce(image.asset->url + "?auto=format&w=480&q=75", image)
  }`;
  const { data, loading, error } = useSanityQuery<any[]>(query);
  return { leaders: data || [], loading, error };
}

export function useOfficersConfig() {
  const query = groq`*[_type == "officersConfig"][0]{
    ...,
    executiveOrder[]->{ _id },
    technicalOrder[]->{ _id },
    operationsOrder[]->{ _id },
    memberOrder[]->{ _id }
  }`;
  const { data, loading, error } = useSanityQuery<any>(query);
  return { config: data, loading, error };
}

export function useHomePage() {
  const query = groq`*[_type == "homePage"][0]{
    ...,
    "heroImage": coalesce(heroImage.asset->url + "?auto=format&w=1600&q=75", heroImage.asset->url),
    "aboutImage": coalesce(aboutImage.asset->url + "?auto=format&w=1000&q=75", aboutImage.asset->url)
  }`;
  const { data, loading, error } = useSanityQuery<any>(query);
  return { data, loading, error };
}

export function useAboutPage() {
  const query = groq`*[_type == "aboutPage"][0]{
    ...,
    sections[]{
      ...,
      "image": coalesce(image.asset->url + "?auto=format&w=1000&q=75", image.asset->url)
    }
  }`;
  const { data, loading, error } = useSanityQuery<any>(query);
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
  partnersHeroTitle?: string;
  partnersHeroSubtitle?: string;
  partnersProspectusUrl?: string;
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
    committeeBylaws[]{
      ...,
      "pdfUrl": pdfFile.asset->url
    },
    "partnersProspectusUrl": partnersProspectusFile.asset->url
  }`;
  const { data, loading, error } = useSanityQuery<SiteSettings>(query);
  return { settings: data, loading, error };
}

export interface Partner {
  name: string;
  domain?: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  logoUrl?: string;
  order?: number;
}

export function usePartners() {
  const query = groq`*[_type == "partner"] | order(order asc){
    ...,
    "logoUrl": coalesce(logo.asset->url + "?auto=format&w=300&q=75", logo.asset->url)
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
