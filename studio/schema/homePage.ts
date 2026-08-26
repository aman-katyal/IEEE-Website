import { defineField, defineType } from 'sanity'
import { Home, Image as ImageIcon, BarChart, Info } from 'lucide-react'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: Home,
  groups: [
    { name: 'hero', title: 'Hero Section', icon: ImageIcon, default: true },
    { name: 'about', title: 'About Section', icon: Info },
    { name: 'stats', title: 'Statistics', icon: BarChart },
  ],
  fields: [
    // --- HERO GROUP ---
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'alumniCompanies',
      title: 'Where Our Engineers Go (Companies / Employers)',
      type: 'array',
      group: 'hero',
      description: 'List of top companies, employers, and organizations where Purdue IEEE members work and intern.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Company Name', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'domain', title: 'Domain (for logo lookup, e.g. spacex.com, apple.com)', type: 'string' },
            { name: 'roleOrField', title: 'Focus / Industry (e.g. Aerospace, Silicon, AI)', type: 'string' },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'roleOrField',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'alumniHighlightText',
      title: 'Alumni Card Tagline',
      type: 'string',
      group: 'hero',
      description: 'Tagline displayed on the hero card (e.g., Top Tech, Aerospace & Semiconductor Destinations).',
      initialValue: 'Top Tech, Aerospace & Semiconductor Destinations',
    }),

    // --- ABOUT GROUP ---
    defineField({
      name: 'aboutTitle',
      title: 'About Title',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutContent',
      title: 'About Content',
      type: 'text',
      group: 'about',
    }),

    // --- STATS GROUP ---
    defineField({
      name: 'stats',
      title: 'Statistics Cards',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'sublabel', title: 'Sublabel', type: 'string' },
            { name: 'value', title: 'Value', type: 'number' },
            { name: 'prefix', title: 'Prefix', type: 'string' },
            { name: 'suffix', title: 'Suffix', type: 'string' },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page Content',
      }
    },
  },
})
