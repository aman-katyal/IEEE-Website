import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Purdue IEEE Website',

  projectId: 'vq0v7yv4',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: location.origin.includes('localhost') 
          ? (location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5173' : 'http://localhost:5173')
          : 'https://ieee-website-9ix.pages.dev',
        previewMode: {
          enable: '/',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
