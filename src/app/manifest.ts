import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kai Tran Portfolio',
    short_name: 'Kai Tran',
    description: 'Product designer and tinkerer. I make learning feel like play.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F2EBE1',
    theme_color: '#F2EBE1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      }
    ],
  }
}