import { defineField, defineType } from 'sanity'

export const aboutPageSection = defineType({
  name: 'aboutPageSection',
  title: 'About Page Section',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'content', title: 'Content', type: 'text' }),
    defineField({ name: 'cardTitle', title: 'Card Title', type: 'string' }),
    defineField({ name: 'cardContent', title: 'Card Content', type: 'text' }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Reversed', value: 'reversed' },
        ],
      },
      initialValue: 'normal',
    }),
    defineField({
      name: 'colorTheme',
      title: 'Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Gold', value: 'gold' },
        ],
      },
      initialValue: 'blue',
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
  ],
})
