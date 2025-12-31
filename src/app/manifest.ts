import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KeyQuest - Learn Touch Typing the Fun Way',
    short_name: 'KeyQuest',
    description: 'A fun, game-driven way to learn touch typing from the ground up. Master the keyboard through engaging lessons and games.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/images/logo-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/images/logo-64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/images/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['education', 'productivity', 'games'],
    lang: 'en',
    dir: 'ltr',
  };
}
