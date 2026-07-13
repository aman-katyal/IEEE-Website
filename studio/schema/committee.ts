import { defineField, defineType } from 'sanity'
import { Users, Info, Image as ImageIcon, Contact, ShieldCheck, Share2, BarChart3 } from 'lucide-react'

export const committee = defineType({
  name: 'committee',
  title: 'Committee',
  type: 'document',
  icon: Users,
  groups: [
    { name: 'info', title: 'General Info', icon: Info, default: true },
    { name: 'media', title: 'Media', icon: ImageIcon },
    { name: 'status', title: 'Status & Badges', icon: ShieldCheck },
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      group: 'info',
      rows: 3,
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      group: 'info',
      rows: 5,
    }),

    // --- STATUS GROUP ---
    defineField({
      name: 'status',
      title: 'Status Label',
      type: 'string',
      group: 'status',
      initialValue: 'Active',
    }),
    defineField({
      name: 'statusColor',
      title: 'Status Text Color (Hex)',
      type: 'string',
      group: 'status',
      description: 'e.g., #FFFFFF',
    }),
    defineField({
      name: 'statusBg',
      title: 'Status Background (RGBA)',
      type: 'string',
      group: 'status',
      description: 'e.g., rgba(0, 200, 83, 0.2)',
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
