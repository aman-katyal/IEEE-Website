import { defineField, defineType } from 'sanity'

export const officeHours = defineType({
  name: 'officeHours',
  title: 'Officer Office Hours',
  type: 'document',
  fields: [
    defineField({
      name: 'officerName',
      title: 'Officer Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Officer Role / Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dayOfWeek',
      title: 'Day of the Week',
      type: 'string',
      options: {
        list: [
          { title: 'Monday', value: 'Monday' },
          { title: 'Tuesday', value: 'Tuesday' },
          { title: 'Wednesday', value: 'Wednesday' },
          { title: 'Thursday', value: 'Thursday' },
          { title: 'Friday', value: 'Friday' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time (e.g. 2:00 PM)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endTime',
      title: 'End Time (e.g. 4:00 PM)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location (e.g. BHEE 014 / IEEE Office)',
      type: 'string',
      initialValue: 'BHEE 014 (IEEE Office)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Notes / Special Topics',
      type: 'string',
    }),
  ],
})
