import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'vq0v7yv4'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

const apiVersion = '2024-03-16'
const studioUrl = 'https://purdue-ieee-website.sanity.studio'

// Check if we should enable stega based on URL or environment
const isStegaEnabled = typeof window !== 'undefined' && 
  (new URLSearchParams(window.location.search).has('stega') || 
   window.self !== window.top);

export const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
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

// Client for fetching draft content (requires a token)
export const previewClient = import.meta.env.VITE_SANITY_API_TOKEN ? createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  token: import.meta.env.VITE_SANITY_API_TOKEN,
  perspective: 'drafts',
  ignoreBrowserTokenWarning: true,
  stega: {
    enabled: isStegaEnabled,
    studioUrl,
  },
}) : null;
