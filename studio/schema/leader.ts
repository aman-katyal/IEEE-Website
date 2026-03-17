import { defineField, defineType } from 'sanity'

export const leader = defineType({
  name: 'leader',
  title: 'Officer',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'committees',
      title: 'Committees',
      type: 'string',
      description: 'Comma-separated list of committees',
    }),
    defineField({
      name: 'image',
      title: 'Officer Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
})
