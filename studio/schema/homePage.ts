import { defineField, defineType } from 'sanity'
import { Home, Image as ImageIcon, BarChart, Info, Activity } from 'lucide-react'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: Home,
  groups: [
    { name: 'hero', title: 'Hero Section', icon: ImageIcon, default: true },
    { name: 'about', title: 'About Section', icon: Info },
    { name: 'stats', title: 'Statistics', icon: BarChart },
    { name: 'system', title: 'System Info', icon: Activity },
  ],
  fields: [
    // --- HERO GROUP ---
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),

    // --- ABOUT GROUP ---
    defineField({
      name: 'aboutEyebrow',
      title: 'About Eyebrow',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutTitle',
      title: 'About Title',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutContent',
      title: 'About Content',
      type: 'text',
      group: 'about',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Image',
      type: 'image',
      group: 'about',
    }),
    defineField({
      name: 'aboutStatsValue',
      title: 'About Stats Value',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutStatsLabel',
      title: 'About Stats Label',
      type: 'string',
      group: 'about',
    }),

    // --- STATS GROUP ---
    defineField({
      name: 'stats',
      title: 'Statistics Cards',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'sublabel', title: 'Sublabel', type: 'string' },
            { name: 'value', title: 'Value', type: 'number' },
            { name: 'prefix', title: 'Prefix', type: 'string' },
            { name: 'suffix', title: 'Suffix', type: 'string' },
          ],
        },
      ],
    }),

    // --- SYSTEM GROUP ---
    defineField({
      name: 'semester',
      title: 'Active Semester',
      type: 'string',
      group: 'system',
      description: 'e.g., SP_2026',
    }),
    defineField({
      name: 'sysUptime',
      title: 'System Uptime Status',
      type: 'string',
      group: 'system',
      description: 'e.g., ACTIVE, OFFLINE',
    }),
    defineField({
      name: 'hqLocation',
      title: 'HQ Location',
      type: 'string',
      group: 'system',
      description: 'The physical location of Purdue IEEE HQ (e.g., EE 115 / EE 224).',
      initialValue: 'EE 115 / EE 224'
    }),
    defineField({
      name: 'discordMembers',
      title: 'Discord Members Count',
      type: 'string',
      group: 'system',
      description: 'The number of members in the Discord Hub (e.g., 1,200+ Members).',
      initialValue: '1,200+ Members'
    }),
    defineField({
      name: 'campusLocation',
      title: 'Campus Location / Name',
      type: 'string',
      group: 'system',
      description: 'The campus name displayed at the bottom of the telemetry console (e.g., Purdue West Lafayette).',
      initialValue: 'Purdue West Lafayette'
    }),
  ],
})
