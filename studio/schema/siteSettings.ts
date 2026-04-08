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
  ],
})