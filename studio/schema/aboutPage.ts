import { defineField, defineType } from 'sanity'
import { Info } from 'lucide-react'

export const timelineMilestone = defineType({
  name: 'timelineMilestone',
  title: 'Timeline Milestone',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year / Period',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Milestone Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category Tag',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isGoldAccent',
      title: 'Gold Accent Highlight',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: Info,
  fields: [
    defineField({
      name: 'quote',
      title: 'Heritage Quote',
      type: 'object',
      fields: [
        { name: 'text', type: 'text', title: 'Quote Text' },
        { name: 'author', type: 'string', title: 'Quote Author' },
        { name: 'authorTitle', type: 'string', title: 'Author Title' },
      ],
    }),
    defineField({
      name: 'timeline',
      title: 'Historical Lineage & Milestones',
      type: 'array',
      of: [{ type: 'timelineMilestone' }],
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [{ type: 'aboutPageSection' }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page Content',
      }
    },
  },
})
