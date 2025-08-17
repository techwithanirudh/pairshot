import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Create Next App',
    short_name: 'Create Next App',
    description:
      'Create Next App is a boilerplate for building Next.js applications with Tailwind CSS, Sonner notifications, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
