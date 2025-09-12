import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import project from './src/sanity/schemaTypes/project'
import {projectId, dataset} from './src/sanity/env'
import {structure} from './src/sanity/structure'

export default defineConfig({
  projectId,
  dataset,
  plugins: [deskTool({structure})],
  schema: {types: [project]},
})
