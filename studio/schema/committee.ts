import { defineField, defineType } from 'sanity'
import { Users, Info, Image as ImageIcon, Contact, Share2, BarChart3 } from 'lucide-react'

export const committee = defineType({
  name: 'committee',
  title: 'Committee',
  type: 'document',
  icon: Users,
  groups: [
    { name: 'info', title: 'General Info', icon: Info, default: true },
    { name: 'media', title: 'Media', icon: ImageIcon },
    { name: 'content', title: 'Page Content', icon: BarChart3 },
    { name: 'contact', title: 'Contact & Social', icon: Contact },
    { name: 'social', title: 'Social Links', icon: Share2 },
  ],
  fields: [
    // --- INFO GROUP ---
    defineField({
      name: 'id',
      title: 'ID (URL Slug)',
      type: 'slug',
      group: 'info',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      group: 'info',
      validation: (Rule) =>
        Rule.required().max(96).warning('Names over 96 characters may truncate in header navigation.'),
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name',
      type: 'string',
      group: 'info',
      validation: (Rule) =>
        Rule.required().max(32).warning('Short names should stay under 32 characters for compact card badges.'),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'info',
      validation: (Rule) =>
        Rule.max(120).warning('Taglines should be concise (max 120 chars) for optimal SEO and card rendering.'),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      group: 'info',
      rows: 3,
      validation: (Rule) =>
        Rule.required().max(300).warning('Short descriptions should be under 300 characters for meta descriptions and search snippets.'),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      group: 'info',
      rows: 5,
    }),

    // --- MEDIA GROUP ---
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
    }),

    // --- CONTENT GROUP ---
    defineField({
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
      group: 'content',
      of: [{ type: 'metric' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'joinConfig',
      title: 'Join Configuration',
      type: 'object',
      group: 'content',
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
          initialValue: 'default',
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
      group: 'content',
      of: [
        { type: 'textSection' },
        { type: 'projectsSection' },
        { type: 'faqSection' },
        { type: 'gallerySection' },
        { type: 'historySection' },
      ],
    }),

    // --- CONTACT & SOCIAL GROUP ---
    defineField({
      name: 'chair',
      title: 'Chair (Officer)',
      type: 'reference',
      to: [{ type: 'leader' }],
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'social',
      of: [{ type: 'socialLink' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline',
      media: 'image',
    },
  },
})
