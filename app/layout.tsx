import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'OCPR Comores | Office Comorien des Produits de Rente',
  description: 'Établissement public de promotion, développement et contrôle de qualité des filières de rente agricoles aux Comores : Vanille, Ylang-Ylang, Girofle et Épices.',
  keywords: [
    'OCPR',
    'OCPR Comores',
    'Produits de Rente Comores',
    'Vanille des Comores',
    'Girofle Comores',
    'Ylang-Ylang Comores',
    'Agriculture Comores',
    'Moroni Comores',
    'Exportation Comores',
    'Office Comorien des Produits de Rente'
  ],
  authors: [{ name: 'OCPR Comores' }],
  openGraph: {
    title: 'OCPR Comores - Office Comorien des Produits de Rente',
    description: 'Site officiel de l\'Office Comorien des Produits de Rente. Promotion et valorisation des filières Vanille, Girofle et Ylang-Ylang.',
    url: 'https://www.ocprcomores.com',
    siteName: 'OCPR Comores',
    locale: 'fr_KM',
    type: 'website',
  },
  icons: {
    icon: '/logo-ocpr-mark.svg',
    shortcut: '/logo-ocpr-mark.svg',
    apple: '/logo-ocpr-mark.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
