import { createClient, type ClientConfig } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'vq0v7yv4'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

const apiVersion = '2024-03-16'
const studioUrl = 'https://purdue-ieee-website.sanity.studio'

// Check if we should enable stega based on URL or environment
const isStegaEnabled = typeof window !== 'undefined' && 
  (new URLSearchParams(window.location.search).has('stega') || 
   window.self !== window.top);

const devFetch = typeof window !== 'undefined' && import.meta.env.DEV && !import.meta.env.VITEST
  ? (url: RequestInfo | URL, init?: RequestInit) => {
      const urlString = url.toString();
      const proxiedUrl = urlString
        .replace('https://vq0v7yv4.apicdn.sanity.io', '/sanity-api')
        .replace('https://vq0v7yv4.api.sanity.io', '/sanity-api');
      return fetch(proxiedUrl, init);
    }
  : undefined;

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion,
  ...(devFetch ? { fetch: devFetch as unknown as ClientConfig['fetch'] } : {}),
  stega: {
    enabled: false, // Keep disabled for production delivery to prevent string issues
    studioUrl,
  },
});

// Image URL builder
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Client for fetching draft content
// SECURE CONFIGURATION: Do not inject API tokens into the client bundle.
export const previewClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  perspective: 'drafts',
  stega: {
    enabled: isStegaEnabled,
    studioUrl,
  },
});
