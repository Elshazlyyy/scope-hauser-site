import {defineLive} from 'next-sanity'
import {client} from './client'
import {apiVersion} from '../env'

export const {sanityFetch, SanityLive} = defineLive({
  client: client.withConfig({apiVersion}),
})
