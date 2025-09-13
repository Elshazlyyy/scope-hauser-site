import { createClient } from 'next-sanity'
import { getEnvVar } from '@/utils/env'

export const client = createClient({
  projectId: getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: true, // public, published content over CDN
})
