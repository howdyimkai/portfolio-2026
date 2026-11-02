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
      // The shelf's felt hat (src/app/apple-icon.png, icon.png), at its drawn size.
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/icon.png', sizes: '96x96', type: 'image/png' },
    ],
  }
}