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
        origin: (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
          ? 'http://localhost:5173' 
          : 'https://ieee-website-9ix.pages.dev',
        previewMode: {
          enable: '/', // Match the frontend's preview route
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
