import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schema'

export default defineConfig({
  name: 'default',
  title: 'Purdue IEEE CMS',

  projectId: 'vq0v7yv4',
  dataset: 'production',

  plugins: [
    deskTool(),
    presentationTool({
      previewUrl: {
        origin: typeof window !== 'undefined' && window.location.origin.includes('localhost') 
          ? 'http://localhost:5173' 
          : 'https://ieee-website-9ix.pages.dev', // Default preview URL
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
