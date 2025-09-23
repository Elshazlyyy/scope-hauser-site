import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'remoteImage',
  title: 'Remote Image',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Image URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Short description for accessibility and SEO',
    }),
  ],
  preview: {
    select: { title: 'alt', url: 'url' },
    prepare: ({ title, url }) => ({
      title: title || url,
      subtitle: 'Remote URL',
    }),
  },
})
