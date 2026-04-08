import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schema'

// Define the singleton document types
const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set(["officersConfig", "siteSettings", "homePage", "aboutPage"])

export default defineConfig({
  name: 'default',
  title: 'Purdue IEEE CMS',

  projectId: 'vq0v7yv4',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Our singleton type has a list item with a custom child
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Home Page")
              .id("homePage")
              .child(
                S.document()
                  .schemaType("homePage")
                  .documentId("homePage")
              ),
            S.listItem()
              .title("About Page")
              .id("aboutPage")
              .child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
              ),
            S.listItem()
              .title("Officers Config")
              .id("officersConfig")
              .child(
                S.document()
                  .schemaType("officersConfig")
                  .documentId("officersConfig")
              ),
            // Regular document types
            S.documentTypeListItem("committee").title("Committees"),
            S.documentTypeListItem("cornerstone").title("Cornerstone Committees"),
            S.documentTypeListItem("leader").title("Leaders"),
            S.documentTypeListItem("partner").title("Partners"),
          ]),
    }),
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
    // Filter out singleton types from the global "New document" menu options
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
