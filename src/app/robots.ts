import type { MetadataRoute } from 'next'

// Prototypes, recording pieces and the parked password page stay out of search (each is noindex too).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/proto/', '/pieces/', '/unlock'] },
    sitemap: 'https://howdyimkai.com/sitemap.xml',
  }
}
