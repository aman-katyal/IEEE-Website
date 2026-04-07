import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = '2024-03-16'
const studioUrl = 'https://purdue-ieee-website.sanity.studio'

if (!projectId) {
  console.warn('[Sanity Client] VITE_SANITY_PROJECT_ID is missing. Sanity features will be disabled. Set this variable in your deployment environment.');
  console.log('[Sanity Debug] Env:', { 
    hasProjectId: !!projectId,
    dataset: dataset,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE 
  });
}

// Check if we should enable stega based on URL or environment
const isStegaEnabled = typeof window !== 'undefined' && 
  (new URLSearchParams(window.location.search).has('stega') || 
   window.self !== window.top);

export const client = projectId ? createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  stega: {
    enabled: false, // Keep disabled for production delivery to prevent string issues
    studioUrl,
  },
}) : null;

// Image URL builder (only if client exists)
const builder = projectId ? imageUrlBuilder(client!) : null;

export function urlFor(source: any) {
  return builder ? builder.image(source) : null;
}

// Client for fetching draft content (requires a token)
export const previewClient = (projectId && import.meta.env.VITE_SANITY_API_TOKEN) ? createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  token: import.meta.env.VITE_SANITY_API_TOKEN,
  perspective: 'previewDrafts',
  stega: {
    enabled: isStegaEnabled,
    studioUrl,
  },
}) : null;
