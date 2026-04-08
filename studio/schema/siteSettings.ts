import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'discordUrl',
      title: 'Discord Invite URL',
      type: 'url',
    }),
    defineField({
      name: 'duesDescription',
      title: 'Dues Description',
      type: 'text',
      description: 'Text explaining the dues payment process.',
    }),
    defineField({
      name: 'duesBenefits',
      title: 'Dues Benefits',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'duesOptions',
      title: 'Dues Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'subtitle', title: 'Subtitle', type: 'string' },
            { name: 'price', title: 'Price', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'paymentUrl',
      title: 'TooCool Payment URL',
      type: 'url',
    }),
    // Calendar Data
    defineField({
      name: 'calendarUrl',
      title: 'Google Calendar Embed URL',
      type: 'url',
      description: 'The URL for the Google Calendar embed.',
    }),
    defineField({
      name: 'calendarId',
      title: 'Google Calendar ID',
      type: 'string',
      description: 'The direct Google Calendar ID (used in the subscribe link).',
    }),
    // Constitution Data
    defineField({
      name: 'branchConstitution',
      title: 'Branch Constitution',
      type: 'object',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'pdfFile', title: 'PDF File', type: 'file' },
      ],
    }),
    defineField({
      name: 'committeeBylaws',
      title: 'Committee Bylaws',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'pdfFile', title: 'PDF File', type: 'file' },
          ],
        },
      ],
    }),
    // Partners Page Content
    defineField({
      name: 'partnersHeroTitle',
      title: 'Partners Hero Title',
      type: 'string',
    }),
    defineField({
      name: 'partnersHeroSubtitle',
      title: 'Partners Hero Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'partnersProspectusFile',
      title: 'Partners Prospectus PDF',
      type: 'file',
    }),
  ],
})
