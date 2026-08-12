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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faf9] text-slate-900 selection:bg-emerald-500 selection:text-white">
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
