import type { Metadata, Viewport } from 'next';
import './globals.css';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ocprcomores.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#184E2A' },
    { media: '(prefers-color-scheme: dark)', color: '#0d2e1a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OCPR Comores | Office Comorien des Produits de Rente',
    template: '%s | OCPR Comores',
  },
  description:
    "Établissement public à caractère administratif et économique chargé de la promotion, du développement, de la régulation et du contrôle de qualité des filières de rente agricoles aux Comores : Vanille Bourbon, Ylang-Ylang, Girofle et Épices d'exception.",
  applicationName: 'OCPR Comores',
  authors: [{ name: 'Office Comorien des Produits de Rente', url: SITE_URL }],
  creator: 'OCPR Comores',
  publisher: 'Office Comorien des Produits de Rente',
  keywords: [
    // Marque & Institution
    'OCPR',
    'OCPR Comores',
    'Office Comorien des Produits de Rente',
    'Office des Produits de Rente Comores',
    'Union des Comores Agriculture',
    'Ministère Agriculture Comores',
    'Moroni Comores',
    
    // Filières de Rente
    'Vanille Bourbon des Comores',
    'Vanille gourmet Comores',
    'Vanilla planifolia Comores',
    'Ylang-Ylang Comores',
    'Huile essentielle Ylang Ylang Moroni',
    'Cananga odorata Comores',
    'Girofle des Comores',
    'Clous de girofle Moroni',
    'Syzygium aromaticum',
    'Épices des Comores',
    'Cannelle Comores',
    'Poivre noir Comores',
    
    // Commerce & Réglementation
    'Exportation Comores',
    'Agrément exportateur vanille Comores',
    'Contrôle qualité agricole Comores',
    'Normes ISO vanille girofle',
    'Certification agricole Comores',
    'Produits de rente Océan Indien',
    'Coopératives agricoles Comores',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'fr-KM': '/',
      'fr': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_KM',
    url: SITE_URL,
    siteName: 'OCPR Comores',
    title: 'OCPR Comores | Office Comorien des Produits de Rente',
    description:
      "Site officiel de l'Office Comorien des Produits de Rente. Régulation, contrôle qualité et valorisation des filières Vanille Bourbon, Girofle et Ylang-Ylang pour l'exportation internationale.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OCPR Comores - Office Comorien des Produits de Rente',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OCPR Comores | Vanille Bourbon · Girofle · Ylang-Ylang',
    description:
      "Portail officiel de l'OCPR Comores — Promotion, contrôle qualité et agrément des filières de rente agricoles de l'Union des Comores.",
    images: ['/og-image.png'],
    creator: '@OCPRComores',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo-ocpr-mark.svg', type: 'image/svg+xml' },
      { url: '/logo-blanc.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/logo-ocpr-mark.svg',
    apple: [
      { url: '/logo-blanc.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  category: 'agriculture',
  classification: 'Établissement Public Agricole',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  other: {
    'geo.region': 'KM',
    'geo.placename': 'Moroni, Union des Comores',
    'geo.position': '-11.7022;43.2551',
    'ICBM': '-11.7022, 43.2551',
    'revisit-after': '7 days',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for faster LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
