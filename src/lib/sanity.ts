import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = '2024-03-16'
const studioUrl = 'https://purdue-ieee-website.sanity.studio'

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion,
  stega: {
    enabled: true,
    studioUrl,
  },
})

// Client for fetching draft content (requires a token)
export const previewClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  token: import.meta.env.VITE_SANITY_API_TOKEN,
  perspective: 'previewDrafts',
  stega: {
    enabled: true,
    studioUrl,
  },
})
