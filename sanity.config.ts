import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import project from './src/sanity/schemaTypes/project'
import {projectId, dataset} from './src/sanity/env'

export default defineConfig({
  projectId,
  dataset,
  plugins: [deskTool(), visionTool()],
  schema: {types: [project]},
})
