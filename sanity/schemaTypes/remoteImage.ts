import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'remoteImage',
  title: 'Remote Image',
  type: 'object',
  fields: [
    defineField({ name: 'url', type: 'url', validation: r => r.required() }),
    defineField({ name: 'alt', type: 'string' }),
  ],
  preview: {
    select: { title: 'alt', url: 'url' },
    prepare: ({title, url}) => ({ title: title || url, subtitle: 'Remote URL' }),
  },
})
