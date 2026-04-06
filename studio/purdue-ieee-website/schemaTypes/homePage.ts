import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'The main headline on the home page. Use highlights sparingly.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'The mission statement or text below the headline.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'aboutEyebrow',
      title: 'About Eyebrow',
      type: 'string',
      initialValue: '// Overview',
    }),
    defineField({
      name: 'aboutTitle',
      title: 'About Title',
      type: 'string',
    }),
    defineField({
      name: 'aboutContent',
      title: 'About Content',
      type: 'text',
    }),
    defineField({
      name: 'aboutStatsValue',
      title: 'About Stats Value',
      type: 'string',
      initialValue: '1903',
    }),
    defineField({
      name: 'aboutStatsLabel',
      title: 'About Stats Label',
      type: 'string',
      initialValue: 'Established & Innovating',
    }),
    defineField({
      name: 'stats',
      title: 'Key Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'value', type: 'number', title: 'Numeric Value' },
            { name: 'prefix', type: 'string', title: 'Prefix (e.g. $)' },
            { name: 'suffix', type: 'string', title: 'Suffix (e.g. +)' },
            { name: 'sublabel', type: 'string', title: 'Sublabel' },
          ]
        }
      ]
    }),
    defineField({
      name: 'sysUptime',
      title: 'System Uptime Status',
      type: 'string',
      initialValue: 'ACTIVE',
    }),
    defineField({
      name: 'semester',
      title: 'Current Semester',
      type: 'string',
      initialValue: 'SP_2026',
    })
  ],
})
