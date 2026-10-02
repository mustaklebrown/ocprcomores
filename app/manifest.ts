import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Office Comorien des Produits de Rente',
    short_name: 'OCPR Comores',
    description:
      'Portail officiel de promotion, développement et contrôle de qualité des filières de rente agricoles aux Comores : Vanille Bourbon, Ylang-Ylang, Girofle et Épices.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d2e1a',
    theme_color: '#184E2A',
    lang: 'fr',
    orientation: 'portrait-primary',
    categories: ['government', 'food', 'business'],
    icons: [
      {
        src: '/logo-ocpr-mark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/logo-ocpr-white-mark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/logo-blanc.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo-blanc.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
