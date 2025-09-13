import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Name',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: r => r.required(),
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'object',
      fields: [
        defineField({ name: 'url', type: 'url', validation: r => r.required() }),
        defineField({ name: 'alt', type: 'string' }),
      ],
      validation: r => r.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'location' } },
});
