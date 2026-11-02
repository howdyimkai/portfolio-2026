import type { MetadataRoute } from 'next'

// The public, indexable pages. Cal and Brand System are left out while their pages are noindex.
const PATHS = ['/', '/works', '/works/design-garden', '/about', '/play', '/resume']

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: `https://howdyimkai.com${path === '/' ? '' : path}` }))
}
