import type { MetadataRoute } from 'next'

// The public, indexable pages.
const PATHS = ['/', '/works', '/works/design-garden', '/works/cal', '/works/brand-system', '/works/visual-media', '/about', '/play']

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: `https://howdyimkai.com${path === '/' ? '' : path}` }))
}
