import { defineField, defineType } from 'sanity'

export const textSection = defineType({
  name: 'textSection',
  title: 'Text Content',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'content', type: 'text', title: 'Content (Markdown support)' }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageStyle',
      type: 'imageStyle',
      title: 'Image Style',
    }),
    defineField({
      name: 'layout',
      type: 'string',
      title: 'Layout',
      options: {
        list: [
          { title: 'Top', value: 'top' },
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'top',
    }),
  ],
})

export const projectsSection = defineType({
  name: 'projectsSection',
  title: 'Projects Grid',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({
      name: 'imageStyle',
      type: 'imageStyle',
      title: 'Global Project Image Style',
    }),
    defineField({
      name: 'items',
      title: 'Projects',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'projectItem',
          fields: [
            { name: 'name', type: 'string', title: 'Project Name' },
            { name: 'description', type: 'text', title: 'Summary / Short Description (Shown on card)' },
            { name: 'longDescription', type: 'text', title: 'Detailed Write-up (Shown in expanded modal, Markdown supported)' },
            { name: 'url', type: 'url', title: 'Project Link / Longer Page (Opens in new tab)' },
            { name: 'image', type: 'image', title: 'Project Image', options: { hotspot: true } },
            { name: 'flagship', type: 'boolean', title: 'Flagship Project' },
            { name: 'tags', type: 'array', title: 'Tags / Technologies', of: [{ type: 'string' }] },
          ],
        },
      ],
    }),
  ],
})

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ Accordion',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({
      name: 'items',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', title: 'Answer' },
          ],
        },
      ],
    }),
  ],
})

export const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({
      name: 'items',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryItem',
          fields: [
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
      ],
    }),
  ],
})

export const historySection = defineType({
  name: 'historySection',
  title: 'History / Timeline',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Section Title', initialValue: 'Competition History' }),
    defineField({
      name: 'items',
      title: 'History Entries',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'historyItem',
          fields: [
            { name: 'year', type: 'string', title: 'Year / Season (e.g. 2023-2024)', validation: (Rule) => Rule.required() },
            { name: 'vehicleName', type: 'string', title: 'Robot / Vehicle Name (e.g. ROV ISO-Squid)' },
            { name: 'placement', type: 'string', title: 'Placement / Result (e.g. 6th Place Overall)' },
            {
              name: 'awards',
              type: 'array',
              title: 'Awards & Honors',
              of: [{ type: 'string' }],
            },
            { name: 'description', type: 'text', title: 'Season Description & Highlights (Markdown supported)' },
            { name: 'image', type: 'image', title: 'Photo', options: { hotspot: true } },
            {
              name: 'links',
              type: 'array',
              title: 'Related Links & Documents',
              of: [
                {
                  type: 'object',
                  name: 'historyLink',
                  fields: [
                    { name: 'label', type: 'string', title: 'Label' },
                    { name: 'url', type: 'string', title: 'URL' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
})

