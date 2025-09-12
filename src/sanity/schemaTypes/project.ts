import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: Rule => Rule.required(),
    }),
    defineField({name: 'name', title: 'Project Name', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'location', type: 'string'}),
    defineField({name: 'propertyType', title: 'Property Type', type: 'string'}),
    defineField({name: 'bedrooms', type: 'number'}),
    defineField({name: 'developer', type: 'string'}),
    defineField({name: 'startingPriceAED', title: 'Starting Price (AED)', type: 'number'}),
    defineField({name: 'sizeRange', title: 'Size Range (ft²)', type: 'string'}),
    defineField({name: 'description', type: 'text'}),
    defineField({name: 'listingUrl', title: 'Listing URL', type: 'url'}),
    ...[1, 2, 3, 4, 5].map(n =>
      defineField({
        name: `image${n}`,
        title: `Image ${n}`,
        type: 'image',
        options: {hotspot: true},
        fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
      })
    ),
  ],
})
