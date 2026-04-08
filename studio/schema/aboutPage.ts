import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'content', title: 'Content', type: 'text' },
            { name: 'cardTitle', title: 'Card Title', type: 'string' },
            { name: 'cardContent', title: 'Card Content', type: 'text' },
            {
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'Reversed', value: 'reversed' },
                ],
              },
            },
            {
              name: 'colorTheme',
              title: 'Color Theme',
              type: 'string',
              options: {
                list: [
                  { title: 'Blue', value: 'blue' },
                  { title: 'Gold', value: 'gold' },
                ],
              },
            },
            { name: 'image', title: 'Image', type: 'image' },
          ],
        },
      ],
    }),
  ],
})
