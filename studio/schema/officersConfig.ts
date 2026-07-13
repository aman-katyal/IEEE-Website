import { defineField, defineType } from 'sanity'
import { ListOrdered } from 'lucide-react'

export const officersConfig = defineType({
  name: 'officersConfig',
  title: 'Officers Configuration',
  type: 'document',
  icon: ListOrdered,
  fields: [
    defineField({
      name: 'executiveOrder',
      title: 'Executive Committee Order',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'leader' }], options: { filter: 'category == "executive"' } }],
      description: 'Drag and drop to reorder Executive Committee members.',
    }),
    defineField({
      name: 'technicalOrder',
      title: 'Technical Committee Chairs Order',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'leader' }], options: { filter: 'category == "technical"' } }],
      description: 'Drag and drop to reorder Technical Committee chairs.',
    }),
    defineField({
      name: 'operationsOrder',
      title: 'Operational Leads Order',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'leader' }], options: { filter: 'category == "operations"' } }],
      description: 'Drag and drop to reorder Operational leads.',
    }),
    defineField({
      name: 'memberOrder',
      title: 'Member Involvement Order',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'leader' }], options: { filter: 'category == "member"' } }],
      description: 'Drag and drop to reorder Member Involvement leads.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Officers Configuration',
      }
    },
  },
})
