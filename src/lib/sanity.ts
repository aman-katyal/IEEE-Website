import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
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
  useCdn: true,
  apiVersion,
  stega: {
    enabled: false, // Keep disabled for production delivery to prevent string issues
    studioUrl,
  },
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Client for fetching draft content (requires a token)
export const previewClient = createClient({
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
})
