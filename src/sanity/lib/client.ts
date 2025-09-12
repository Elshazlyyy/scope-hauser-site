import {createClient} from '@sanity/client'
import {projectId, dataset, apiVersion} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_READ_TOKEN,
})
