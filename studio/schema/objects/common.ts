import { defineField, defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      description: 'e.g., Discord, GitHub, Instagram',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
})

export const metric = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() }),
    defineField({ name: 'value', type: 'string', title: 'Value', validation: (Rule) => Rule.required() }),
  ],
})

export const imageStyle = defineType({
  name: 'imageStyle',
  title: 'Image Style',
  type: 'object',
  fields: [
    defineField({
      name: 'crop',
      type: 'boolean',
      title: 'Crop (Cover)',
      description: 'If true, image will cover the area. If false, it will be contained.',
      initialValue: true,
    }),
    defineField({
      name: 'size',
      type: 'string',
      title: 'Image Size',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
          { title: 'Full Width', value: 'full' },
        ],
      },
      initialValue: 'large',
    }),
  ],
})

export const meetingSlot = defineType({
  name: 'meetingSlot',
  title: 'Meeting Time Slot',
  type: 'object',
  fields: [
    defineField({
      name: 'days',
      title: 'Day(s) of the Week',
      description: 'Select one or more days this meeting occurs',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Monday', value: 'Monday' },
          { title: 'Tuesday', value: 'Tuesday' },
          { title: 'Wednesday', value: 'Wednesday' },
          { title: 'Thursday', value: 'Thursday' },
          { title: 'Friday', value: 'Friday' },
          { title: 'Saturday', value: 'Saturday' },
          { title: 'Sunday', value: 'Sunday' },
        ],
      },
      validation: (Rule) => Rule.required().min(1).error('Select at least one day.'),
    }),
    defineField({
      name: 'time',
      title: 'Meeting Time',
      type: 'string',
      description: 'e.g. 6:30 PM - 8:30 PM, or 1:00 PM - 4:00 PM',
      validation: (Rule) => Rule.required().error('Meeting time is required.'),
    }),
    defineField({
      name: 'location',
      title: 'Location / Room (Optional)',
      type: 'string',
      description: 'Room or building if different from committee default (e.g. POTR 234)',
    }),
    defineField({
      name: 'description',
      title: 'Session Type / Label (Optional)',
      type: 'string',
      description: 'e.g. General Meeting, Work Session, Hardware Lab, Software Subteam',
    }),
  ],
  preview: {
    select: {
      days: 'days',
      time: 'time',
      location: 'location',
      description: 'description',
    },
    prepare({ days, time, location, description }) {
      const daysStr = Array.isArray(days) && days.length > 0 ? days.join(', ') : 'No day selected';
      const timeStr = time ? ` ${time}` : '';
      const locStr = location ? ` @ ${location}` : '';
      const descStr = description ? ` [${description}]` : '';
      return {
        title: `${daysStr}:${timeStr}${locStr}`,
        subtitle: descStr.trim() || undefined,
      };
    },
  },
})

