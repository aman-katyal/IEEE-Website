import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'aboutSection',
          fields: [
            { name: 'eyebrow', type: 'string', title: 'Eyebrow' },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'content', type: 'text', title: 'Content' },
            { name: 'cardTitle', type: 'string', title: 'Card Title/Value' },
            { name: 'cardContent', type: 'text', title: 'Card Content/List' },
            { 
              name: 'colorTheme', 
              type: 'string', 
              title: 'Color Theme',
              options: {
                list: [
                  { title: 'Blue', value: 'blue' },
                  { title: 'Gold', value: 'gold' },
                ]
              }
            },
            {
              name: 'layout',
              type: 'string',
              title: 'Layout',
              options: {
                list: [
                  { title: 'Normal (Text Left)', value: 'normal' },
                  { title: 'Reversed (Text Right)', value: 'reversed' },
                ]
              }
            }
          ]
        }
      ]
    })
  ],
})
