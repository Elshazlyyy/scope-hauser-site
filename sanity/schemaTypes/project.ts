// sanity/schemaTypes/project.ts
import { defineType, defineField } from 'sanity';
import type { ValidationContext } from 'sanity';

type DocWithTopTile = { _id?: string; topTile?: number };

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',

  // Auto-pick first free tile at document creation.
  // If all tiles (1..4) are taken, we leave topTile unset.
  initialValue: async (_params, { getClient }) => {
    const client = getClient({ apiVersion: '2025-01-01' });
    const assigned = await client.fetch<number[]>(
      `array::compact(*[_type=="project" && defined(topTile)].topTile)`,
    );
    const all = [1, 2, 3, 4];
    const free = all.find((n) => !assigned.includes(n));
    return free ? { topTile: free } : {};
  },

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
      validation: (Rule) =>
        Rule.custom(
          async (
            value: number | undefined | null,
            context: ValidationContext,
          ) => {
            if (value === undefined || value === null) return true;

            const client = context.getClient({ apiVersion: '2025-01-01' });
            const doc = (context.document || {}) as DocWithTopTile;
            const id = doc._id || '';

            // Derive counterpart IDs (draft/published)
            const isDraft = id.startsWith('drafts.');
            const publishedId = isDraft ? id.slice(7) : id;
            const draftId = isDraft ? id : `drafts.${id}`;

            // Enforce uniqueness for the chosen tile (exclude this doc & its counterpart)
            const duplicates = await client.fetch<number>(
              `count(*[
              _type == "project" &&
              defined(topTile) &&
              topTile == $tile &&
              !(_id in [$id, $publishedId, $draftId])
            ])`,
              { tile: value, id, publishedId, draftId },
            );
            if (duplicates > 0) {
              return 'This tile number is already used by another Project. Clear it there first.';
            }

            // Optional hard cap: block assigning a 5th featured project
            const hadTileBefore = typeof doc.topTile === 'number';
            if (!hadTileBefore) {
              const featuredCount = await client.fetch<number>(
                `count(*[
                _type == "project" &&
                defined(topTile) &&
                !(_id in [$id, $publishedId, $draftId])
              ])`,
                { id, publishedId, draftId },
              );
              if (featuredCount >= 4) {
                return 'There are already 4 featured projects. Unassign one before adding another.';
              }
            }

            return true;
          },
        ),
    }),

    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name: 'propertyType',
      title: 'Property Type',
      type: 'string',
    }),
    defineField({ name: 'bedrooms', title: 'Bedrooms', type: 'string' }),
    defineField({ name: 'developer', title: 'Developer', type: 'string' }),
    defineField({
      name: 'startingPriceAED',
      title: 'Starting Price (AED)',
      type: 'number',
    }),
    defineField({
      name: 'sizeRangeFt2',
      title: 'Size Range (ft²)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({ name: 'listingURL', title: 'Listing URL', type: 'url' }),

    // Image1 → Image5 with alts
    defineField({
      name: 'image1',
      title: 'Image1',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'image1Alt', title: 'Image1:alt', type: 'string' }),
    defineField({
      name: 'image2',
      title: 'Image2',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'image2Alt', title: 'Image2:alt', type: 'string' }),
    defineField({
      name: 'image3',
      title: 'Image3',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'image3Alt', title: 'Image3:alt', type: 'string' }),
    defineField({
      name: 'image4',
      title: 'Image4',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'image4Alt', title: 'Image4:alt', type: 'string' }),
    defineField({
      name: 'image5',
      title: 'Image5',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'image5Alt', title: 'Image5:alt', type: 'string' }),
  ],

  preview: {
    select: { title: 'projectName', subtitle: 'location', media: 'image1' },
  },
});
