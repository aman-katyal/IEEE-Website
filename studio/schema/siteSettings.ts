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
      description: 'The full iframe embed URL for Google Calendar. Example: https://calendar.google.com/calendar/embed?src=7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1%40group.calendar.google.com&ctz=America%2FIndiana%2FIndianapolis',
      initialValue: 'https://calendar.google.com/calendar/embed?src=7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1%40group.calendar.google.com&ctz=America%2FIndiana%2FIndianapolis',
    }),
    defineField({
      name: 'calendarId',
      title: 'Google Calendar ID',
      type: 'string',
      group: 'calendar',
      description: 'The public Google Calendar ID email address. Default: 7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1@group.calendar.google.com. Used to generate "Subscribe to Calendar" and event synchronization links.',
      initialValue: '7e80819a448e91ef81721772e0c6d9236076b45ad51343474265c1b7d4a363f1@group.calendar.google.com',
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
      name: 'hidePartners',
      title: 'Hide Partners Directory (Production / Pre-Season)',
      type: 'boolean',
      group: 'partners',
      description: 'When enabled, hides all partner logos and sponsor directory across the website.',
      initialValue: true,
    }),
    defineField({
      name: 'showCorporateTiers',
      title: 'Show Corporate Tiers Breakdown',
      type: 'boolean',
      group: 'partners',
      description: 'Toggle corporate tier breakdown: When OFF (default), shows a clean unified "Our Corporate Partners & Sponsors" directory. When ON, shows separate Gold, Silver, and Bronze tier sections.',
      initialValue: false,
    }),
    defineField({
      name: 'partnersHeroTitle',
      title: 'Partners Hero Title',
      type: 'string',
      group: 'partners',
      validation: (Rule) => Rule.max(80).warning('Partners hero title should be under 80 characters.'),
    }),
    defineField({
      name: 'partnersHeroSubtitle',
      title: 'Partners Hero Subtitle',
      type: 'text',
      group: 'partners',
      validation: (Rule) => Rule.max(280).warning('Partners hero subtitle should stay under 280 characters for optimal display.'),
    }),
    defineField({
      name: 'partnersProspectusFile',
      title: 'Partners Prospectus PDF',
      type: 'file',
      group: 'partners',
    }),
    defineField({
      name: 'partnerTierDescriptions',
      title: 'Partner Tier Descriptions & Criteria',
      type: 'array',
      group: 'partners',
      description: 'Descriptions and criteria for each sponsorship tier (e.g. Gold, Silver, Bronze).',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'tier', title: 'Tier Name (e.g. Gold)', type: 'string' },
            { name: 'color', title: 'Tier Color Accent (e.g. gold, silver, bronze)', type: 'string' },
            { name: 'description', title: 'Tier Description & Qualification Criteria', type: 'text' },
          ],
        },
      ],
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
