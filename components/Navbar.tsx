'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Facebook, Menu, X, ChevronRight, Lock } from 'lucide-react';


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#hero' },
    { name: 'Qui sommes-nous', href: '#about' },
    { name: 'Missions', href: '#missions' },
    { name: 'Filières & Produits', href: '#produits' },
    { name: 'Documents', href: '#documents' },
    { name: 'Actualités', href: '#actu' },
    { name: 'Galerie', href: '#galerie' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header suppressHydrationWarning className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Bar with Responsive Wrapping */}
      <div className={`bg-[#184E2A] text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#2A7B44]/40 transition-all duration-300 ${isScrolled ? 'h-0 py-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
            <a
              href="mailto:info@ocprcomores.com"
              className="flex items-center gap-1.5 hover:text-[#DAA520] transition-colors shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-[#DAA520]" />
              <span className="hidden xs:inline sm:inline">info@ocprcomores.com</span>
              <span className="xs:hidden sm:hidden">Email</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href="tel:+2697332318"
                className="flex items-center gap-1.5 hover:text-[#DAA520] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#DAA520]" />
                <span className="hidden sm:inline">+269 733 23 18 / +269 499 60 25</span>
                <span className="sm:hidden">+269 733 23 18</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61552777156634"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#DAA520] hover:bg-[#E7B83A] text-[#184E2A] p-1 rounded-full transition-all hover:scale-110 shadow-xs border border-[#F5E4A3]/60 flex items-center justify-center font-bold shrink-0"
                aria-label="Facebook OCPR"
              >
                <Facebook className="w-3 h-3 fill-current" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <span className="hidden md:inline-flex items-center gap-2 text-amber-100/80 text-[11px] uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
              Union des Comores • Établissement Public
            </span>
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2A7B44]/60 hover:bg-[#2A7B44] text-[#DAA520] hover:text-white transition-all text-[11px] font-bold border border-[#2A7B44]/80 shadow-xs"
              title="Espace Admin OCPR"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`transition-all duration-300 ${isScrolled ? 'bg-[#184E2A]/95 backdrop-blur-md shadow-xl border-b border-[#2A7B44]/40 py-1.5 sm:py-2' : 'bg-[#1E5E33]/90 backdrop-blur-sm py-2 sm:py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Responsive Official White Logo */}
          <a href="#hero" className="flex items-center group py-0.5">
            <img
              src="/logo-blanc.png"
              alt="OCPR Comores"
              className="h-12 sm:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/90 hover:text-emerald-300 font-semibold text-sm px-3.5 py-2 rounded-lg hover:bg-white/10 transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#contact"
              className="btn btn-gold text-xs uppercase tracking-wider py-2.5 px-5 rounded-full"
            >
              <span>Nous Contacter</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-emerald-800 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#042f24] border-b border-emerald-700/50 px-5 py-5 animate-fade-in shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white font-medium text-base py-2.5 px-4 rounded-lg hover:bg-emerald-800/60 hover:text-emerald-300 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-emerald-800/80 flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-gold w-full text-center py-3 text-sm uppercase font-bold tracking-wider rounded-xl"
                >
                  Nous Contacter
                </a>
                <a
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-900/80 text-amber-300 border border-emerald-700 text-xs font-bold uppercase tracking-wider"
                >
                  <Lock className="w-4 h-4" />
                  <span>Connexion Administration</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
