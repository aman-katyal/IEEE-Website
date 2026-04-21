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
    }),
    defineField({
      name: 'name',
      title: 'Committee Name',
      type: 'string',
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
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'email', type: 'string', title: 'Email' },
            { name: 'description', type: 'text', title: 'Bio/Description' },
          ],
        },
      ],
    }),
  ],
})
