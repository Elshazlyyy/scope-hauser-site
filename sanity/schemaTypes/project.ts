// sanity/schemaTypes/project.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'projectName', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectName',
      title: 'Project Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'propertyType', title: 'Property Type', type: 'string' }),
    defineField({ name: 'bedrooms', title: 'Bedrooms', type: 'string' }),
    defineField({ name: 'developer', title: 'Developer', type: 'string' }),
    defineField({ name: 'startingPriceAED', title: 'Starting Price (AED)', type: 'number' }),
    defineField({ name: 'sizeRangeFt2', title: 'Size Range (ft²)', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'listingURL', title: 'Listing URL', type: 'url' }),

    // Image1 → Image5 with alt fields
    defineField({ name: 'image1', title: 'Image1', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'image1Alt', title: 'Image1:alt', type: 'string' }),
    defineField({ name: 'image2', title: 'Image2', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'image2Alt', title: 'Image2:alt', type: 'string' }),
    defineField({ name: 'image3', title: 'Image3', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'image3Alt', title: 'Image3:alt', type: 'string' }),
    defineField({ name: 'image4', title: 'Image4', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'image4Alt', title: 'Image4:alt', type: 'string' }),
    defineField({ name: 'image5', title: 'Image5', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'image5Alt', title: 'Image5:alt', type: 'string' }),
  ],
  preview: {
    select: { title: 'projectName', subtitle: 'location', media: 'image1' },
  },
})
