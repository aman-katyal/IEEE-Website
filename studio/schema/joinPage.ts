import { defineField, defineType } from 'sanity'
import { UserPlus, Sparkles, CreditCard, MessageCircle } from 'lucide-react'

export const joinPage = defineType({
  name: 'joinPage',
  title: 'Join Page',
  type: 'document',
  icon: UserPlus,
  groups: [
    { name: 'hero', title: 'Header & Steps', icon: Sparkles, default: true },
    { name: 'connect', title: 'Discord & Community', icon: MessageCircle },
    { name: 'dues', title: 'Dues & Membership', icon: CreditCard },
  ],
  fields: [
    // --- HERO GROUP ---
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
      initialValue: '// Get Started',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      initialValue: 'Joining Purdue IEEE is easier than ever!',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      group: 'hero',
      rows: 2,
      initialValue: 'To join, simply attend any committee meeting and pay dues.',
    }),
    defineField({
      name: 'steps',
      title: 'Quick Steps / How to Join Cards',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Users / Meetings', value: 'users' },
                  { title: 'Credit Card / Dues', value: 'credit-card' },
                  { title: 'Calendar / Events', value: 'calendar' },
                  { title: 'Check Circle', value: 'check' },
                ],
              },
              initialValue: 'users',
            },
            {
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
    }),

    // --- CONNECT GROUP ---
    defineField({
      name: 'connectTitle',
      title: 'Connect Section Title',
      type: 'string',
      group: 'connect',
      initialValue: 'Connect with us',
    }),
    defineField({
      name: 'connectDescription',
      title: 'Connect Description',
      type: 'text',
      group: 'connect',
      rows: 3,
      initialValue:
        'Join Purdue IEEE today and start connecting with fellow members on Discord. Stay engaged with all committee updates and event announcements.',
    }),
    defineField({
      name: 'discordButtonText',
      title: 'Discord Button Text',
      type: 'string',
      group: 'connect',
      initialValue: 'Join Discord',
    }),
    defineField({
      name: 'discordUrl',
      title: 'Custom Discord URL (Overrides Site Settings)',
      type: 'url',
      group: 'connect',
    }),

    // --- DUES GROUP ---
    defineField({
      name: 'duesTitle',
      title: 'Dues Section Title',
      type: 'string',
      group: 'dues',
      initialValue: 'Dues',
    }),
    defineField({
      name: 'duesDescription',
      title: 'Dues Description',
      type: 'text',
      group: 'dues',
      rows: 4,
    }),
    defineField({
      name: 'duesBenefits',
      title: 'Dues Benefits List',
      type: 'array',
      group: 'dues',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'membershipYearTitle',
      title: 'Membership Year Header (e.g. 2025-26 Membership Options)',
      type: 'string',
      group: 'dues',
      initialValue: '2025-26 Membership Options',
    }),
    defineField({
      name: 'duesOptions',
      title: 'Membership Tier Options',
      type: 'array',
      group: 'dues',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Tier Name (e.g. Full Year)', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'subtitle', title: 'Subtitle (e.g. Fall 2025 + Spring 2026)', type: 'string' },
            { name: 'price', title: 'Price (e.g. $15.00)', type: 'string', validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'price',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'paymentButtonText',
      title: 'Payment Button Text',
      type: 'string',
      group: 'dues',
      initialValue: 'Pay via TooCool',
    }),
    defineField({
      name: 'paymentUrl',
      title: 'TooCool Payment URL',
      type: 'url',
      group: 'dues',
    }),
    defineField({
      name: 'paymentSearchNote',
      title: 'Payment Helper / Search Note',
      type: 'string',
      group: 'dues',
      initialValue: 'Search for "IEEE" in the search box on TooCool',
    }),
    defineField({
      name: 'exemptionNote',
      title: 'Exemption / Fine Print Note',
      type: 'text',
      group: 'dues',
      rows: 3,
      initialValue:
        '* Local dues apply only to Purdue West Lafayette campus students. If you have an active International IEEE Membership, you are exempt from local dues. Contact an officer to complete registration.',
    }),
  ],
})
