import { defineField, defineType } from 'sanity'
import { Puzzle } from 'lucide-react'

export const cornerstone = defineType({
  name: 'cornerstone',
  title: 'Cornerstone Committee',
  type: 'document',
  icon: Puzzle,
  fields: [
    defineField({
      name: 'id',
      title: 'ID (URL Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Committee Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'leads',
      title: 'Committee Leads',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'role', type: 'string', title: 'Role' },
            { name: 'officer', type: 'reference', to: [{ type: 'leader' }], title: 'Officer' },
            { name: 'name', type: 'string', title: 'Direct Name' },
            { name: 'email', type: 'string', title: 'Direct Email' },
            { name: 'description', type: 'text', title: 'Bio/Description' },
          ],
        },
      ],
    }),
  ],
})
