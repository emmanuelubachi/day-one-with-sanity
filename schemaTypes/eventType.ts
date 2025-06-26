import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {DoorsOpenInput} from './components/DoorsOpenInput'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {
      name: 'details',
      title: 'Details',
    },
    {
      name: 'editorial',
      title: 'Editorial',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: ['details', 'editorial'],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: ['details', 'editorial'],
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Required to generate a page on the website'),
      hidden: ({document}) => !document?.name,
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      options: {
        list: [
          {title: 'Music', value: 'music'},
          {title: 'Sports', value: 'sports'},
          {title: 'Theatre', value: 'theatre'},
          {title: 'Concert', value: 'concert'},
        ],
        layout: 'radio',
      },
      group: 'details',
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      description: 'Number of minutes before the event starts',
      type: 'number',
      initialValue: 60,
      validation: (Rule) => Rule.required(),
      group: 'details',
      components: {
        input: DoorsOpenInput,
      },
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
      readOnly: ({value, document}) => !value && document?.eventType !== 'concert',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (value && context?.document?.eventType !== 'concert') {
            return 'Only concerts can have a venue'
          }
          return true
        }),
      group: 'details',
    }),
    defineField({
      name: 'headliner',
      type: 'reference',
      to: [{type: 'artist'}],
      group: 'details',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'editorial',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
      group: 'editorial',
    }),
    defineField({
      name: 'tickets',
      type: 'url',
      group: 'details',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'eventType',
      media: 'image',
    },
  },
})
