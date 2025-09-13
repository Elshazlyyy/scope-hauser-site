import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'
import { getEnvVar } from './src/utils/env'

export default defineConfig({
  name: 'default',
  title: 'Scope Hauser CMS',
  projectId: getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
