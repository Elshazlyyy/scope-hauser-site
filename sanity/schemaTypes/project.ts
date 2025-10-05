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

    // NEW: Top Projects tile selector
    defineField({
      name: 'topTile',
      title: 'Top Projects Tile',
      type: 'number',
      description:
        'Assign to the homepage “Top Projects” strip. 1 = wide hero (top), 2–4 = secondary tiles (left→right). Leave empty for non-featured.',
      options: {
        list: [
          { title: '1 — Hero (wide)', value: 1 },
          { title: '2 — Secondary (left)', value: 2 },
          { title: '3 — Secondary (middle)', value: 3 },
          { title: '4 — Secondary (right)', value: 4 },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      // Enforce uniqueness per tile across documents.
      // If duplicates exist (e.g., due to drafts or race), the UI will still render the *latest updated* one.
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (value === undefined || value === null) return true;

          const client = context.getClient({ apiVersion: '2025-01-01' });
          const docId = context?.document?._id;

          // Count other projects (excluding this doc and its counterpart draft/published) with the same tile
          const duplicates = await client.fetch(
            `count(*[
              _type == "project" &&
              defined(topTile) &&
              topTile == $tile &&
              !(_id in [$id, replace($id, "drafts.", "")])
            ])`,
            { tile: value, id: docId }
          );

          if (duplicates > 0) {
            return 'This tile number is already used by another Project. Clear it there first.';
          }
          return true;
        }),
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
