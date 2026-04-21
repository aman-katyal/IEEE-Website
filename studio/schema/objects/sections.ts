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
            { name: 'description', type: 'text', title: 'Project Description' },
            { name: 'image', type: 'image', title: 'Project Image', options: { hotspot: true } },
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
