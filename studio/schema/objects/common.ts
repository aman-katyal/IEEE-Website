import { defineField, defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      description: 'e.g., Discord, GitHub, Instagram',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
  ],
})

export const metric = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', title: 'Label' }),
    defineField({ name: 'value', type: 'string', title: 'Value' }),
  ],
})

export const imageStyle = defineType({
  name: 'imageStyle',
  title: 'Image Style',
  type: 'object',
  fields: [
    defineField({
      name: 'crop',
      type: 'boolean',
      title: 'Crop (Cover)',
      description: 'If true, image will cover the area. If false, it will be contained.',
      initialValue: true,
    }),
    defineField({
      name: 'size',
      type: 'string',
      title: 'Image Size',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
          { title: 'Full Width', value: 'full' },
        ],
      },
      initialValue: 'large',
    }),
  ],
})
