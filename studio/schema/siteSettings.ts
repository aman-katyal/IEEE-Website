import { defineField, defineType } from 'sanity'
import { Settings, Calendar, Shield, Users, Share2, Home } from 'lucide-react'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: Settings,
  groups: [
    { name: 'general', title: 'General & Dues', icon: Settings, default: true },
    { name: 'calendar', title: 'Calendar', icon: Calendar },
    { name: 'legal', title: 'Legal & Governance', icon: Shield },
    { name: 'partners', title: 'Partners Page', icon: Users },
    { name: 'social', title: 'Social Links', icon: Share2 },
    { name: 'cta', title: 'Homepage CTA', icon: Home },
  ],
  fields: [
    // --- GENERAL GROUP ---
    defineField({
      name: 'discordUrl',
      title: 'Discord Invite URL',
      type: 'url',
      group: 'general',
    }),
    defineField({
      name: 'duesDescription',
      title: 'Dues Description',
      type: 'text',
      group: 'general',
      description: 'Text explaining the dues payment process.',
    }),
    defineField({
      name: 'duesBenefits',
      title: 'Dues Benefits',
      type: 'array',
      group: 'general',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'duesOptions',
      title: 'Dues Options',
      type: 'array',
      group: 'general',
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
      group: 'general',
    }),

    // --- CALENDAR GROUP ---
    defineField({
      name: 'calendarUrl',
      title: 'Google Calendar Embed URL',
      type: 'url',
      group: 'calendar',
      description: 'The URL for the Google Calendar embed.',
    }),
    defineField({
      name: 'calendarId',
      title: 'Google Calendar ID',
      type: 'string',
      group: 'calendar',
      description: 'The direct Google Calendar ID (used in the subscribe link).',
    }),

    // --- LEGAL GROUP ---
    defineField({
      name: 'branchConstitution',
      title: 'Branch Constitution',
      type: 'object',
      group: 'legal',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'pdfFile', title: 'PDF File', type: 'file' },
      ],
    }),
    defineField({
      name: 'committeeBylaws',
      title: 'Committee Bylaws',
      type: 'array',
      group: 'legal',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'pdfFile', title: 'PDF File', type: 'file' },
          ],
        },
      ],
    }),

    // --- PARTNERS GROUP ---
    defineField({
      name: 'partnersHeroTitle',
      title: 'Partners Hero Title',
      type: 'string',
      group: 'partners',
    }),
    defineField({
      name: 'partnersHeroSubtitle',
      title: 'Partners Hero Subtitle',
      type: 'text',
      group: 'partners',
    }),
    defineField({
      name: 'partnersProspectusFile',
      title: 'Partners Prospectus PDF',
      type: 'file',
      group: 'partners',
    }),

    // --- SOCIAL GROUP ---
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'social',
      of: [{ type: 'socialLink' }],
    }),

    // --- CTA GROUP ---
    defineField({
      name: 'ctaBenefits',
      title: 'Homepage CTA Benefits',
      type: 'array',
      group: 'cta',
      of: [{ type: 'string' }],
      description: 'The benefits listed in the "Ready to Build Something Real?" section on the homepage.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Site Settings',
      }
    },
  },
})
