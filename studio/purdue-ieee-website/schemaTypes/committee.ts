import { defineField, defineType } from 'sanity'

export const committee = defineType({
  name: 'committee',
  title: 'Committee',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID (URL Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
    }),
    defineField({
      name: 'statusColor',
      title: 'Status Color (Hex)',
      type: 'string',
    }),
    defineField({
      name: 'statusBg',
      title: 'Status Background (RGBA)',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'value', type: 'string', title: 'Value' },
          ],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'chair',
      title: 'Chair Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'joinConfig',
      title: 'Join Configuration',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Join Type',
          type: 'string',
          options: {
            list: [
              { title: 'Default (/join page)', value: 'default' },
              { title: 'Custom Link', value: 'link' },
              { title: 'Display Message', value: 'message' },
            ],
          },
        },
        { name: 'buttonText', type: 'string', title: 'Button Text' },
        { name: 'url', type: 'string', title: 'Custom URL' },
        { name: 'message', type: 'text', title: 'Custom Message' },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'textSection',
          title: 'Text Content',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'content', type: 'text', title: 'Content (Markdown support)' },
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
            defineField({
              name: 'imageStyle',
              type: 'object',
              title: 'Image Style',
              fields: [
                { 
                  name: 'crop', 
                  type: 'boolean', 
                  title: 'Crop (Cover)', 
                  description: 'If true, image will cover the area. If false, it will be contained.' 
                },
                { 
                  name: 'size', 
                  type: 'string', 
                  title: 'Image Size', 
                  options: { list: ['small', 'medium', 'large', 'full'] } 
                },
              ],
            }),
            { 
              name: 'layout', 
              type: 'string', 
              title: 'Layout', 
              options: { list: ['top', 'left', 'right'] } 
            },
          ],
        },
        {
          type: 'object',
          name: 'projectsSection',
          title: 'Projects Grid',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            defineField({
              name: 'imageStyle',
              type: 'object',
              title: 'Image Style',
              fields: [
                { name: 'crop', type: 'boolean', title: 'Crop (Cover)' },
                { 
                  name: 'size', 
                  type: 'string', 
                  title: 'Image Size', 
                  options: { list: ['small', 'medium', 'large', 'full'] } 
                },
              ],
            }),
            {
              name: 'items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', type: 'string', title: 'Project Name' },
                    { name: 'description', type: 'text', title: 'Project Description' },
                    { name: 'image', type: 'image', title: 'Project Image', options: { hotspot: true } },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'faqSection',
          title: 'FAQ Accordion',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            {
              name: 'items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'question', type: 'string', title: 'Question' },
                    { name: 'answer', type: 'text', title: 'Answer' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'gallerySection',
          title: 'Image Gallery',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            {
              name: 'items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
                    { name: 'caption', type: 'string', title: 'Caption' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform' },
            { name: 'url', type: 'string', title: 'URL' },
          ],
        },
      ],
    }),
  ],
})
