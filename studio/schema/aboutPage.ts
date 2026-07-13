import { defineField, defineType } from 'sanity'
import { Info } from 'lucide-react'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: Info,
  fields: [
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [{ type: 'aboutPageSection' }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page Content',
      }
    },
  },
})
