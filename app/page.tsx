import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import MissionsGrid from '@/components/MissionsGrid';
import ProductsSection from '@/components/ProductsSection';
import DocumentsSection from '@/components/DocumentsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import StatsSection from '@/components/StatsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ocprcomores.com';

export const metadata: Metadata = {
  title: 'OCPR Comores | Office Comorien des Produits de Rente — Vanille, Girofle, Ylang-Ylang',
  description:
    "Site officiel de l'Office Comorien des Produits de Rente (OCPR). Promotion, développement, réglementation et contrôle qualité des filières Vanille Bourbon, Girofle et Ylang-Ylang des Comores pour l'exportation internationale.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'OCPR Comores | Office Comorien des Produits de Rente',
    description:
      "Portail officiel de l'OCPR — Filières Vanille Bourbon, Girofle, Ylang-Ylang. Réglementation, agréments exportateurs et actualités agricoles des Comores.",
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'OCPR Comores — Office Comorien des Produits de Rente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OCPR Comores | Vanille Bourbon · Girofle · Ylang-Ylang',
    description:
      "Portail officiel de l'OCPR Comores. Régulation et valorisation des filières agricoles de l'Union des Comores.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faf9] text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* SSR h1 for crawlers — visually hidden, content matches Hero h1 */}
      <h1 className="sr-only">
        Office Comorien des Produits de Rente (OCPR) — Vanille Bourbon, Girofle &amp; Ylang-Ylang des Comores
      </h1>
      <Navbar />
      <Hero />
      <AboutSection />
      <MissionsGrid />
      <ProductsSection />
      <DocumentsSection />
      <NewsSection />
      <GallerySection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
