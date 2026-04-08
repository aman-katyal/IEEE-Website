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
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'semester',
      title: 'Semester',
      type: 'string',
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
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
    defineField({
      name: 'aboutEyebrow',
      title: 'About Eyebrow',
      type: 'string',
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
      name: 'aboutImage',
      title: 'About Image',
      type: 'image',
    }),
    defineField({
      name: 'aboutStatsValue',
      title: 'About Stats Value',
      type: 'string',
    }),
    defineField({
      name: 'aboutStatsLabel',
      title: 'About Stats Label',
      type: 'string',
    }),
    defineField({
      name: 'sysUptime',
      title: 'System Uptime Status',
      type: 'string',
    }),
  ],
})
