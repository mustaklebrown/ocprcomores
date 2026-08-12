'use client';

import { Facebook, Mail, Phone, MapPin, ArrowUp, ChevronRight, Shield } from 'lucide-react';
import OCPRLogo from './OCPRLogo';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#184E2A] text-white pt-16 pb-8 border-t border-[#2A7B44]/40 relative overflow-hidden">
      
      {/* Glow Effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2A7B44]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2A7B44]/40">
          
          {/* Brand Info with Official OCPR Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="py-1">
              <OCPRLogo variant="light" size="lg" />
            </div>

            <p className="text-xs text-emerald-100/75 leading-relaxed max-w-md">
              Établissement public à caractère administratif et à vocation agricole et économique, dédié à la valorisation, au développement et à la régulation des filières de rente de l'Union des Comores : Vanille Bourbon, Girofle, Ylang-Ylang et Épices d'exception.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61552777156634"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1E5E33] border border-emerald-500/30 flex items-center justify-center text-white hover:bg-[#DAA520] hover:border-[#DAA520] transition-all hover:scale-110"
                aria-label="Facebook OCPR"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@ocprcomores.com"
                className="w-9 h-9 rounded-full bg-[#12371F] border border-emerald-500/30 flex items-center justify-center text-white hover:bg-[#2A7B44] transition-all hover:scale-110"
                aria-label="Email OCPR"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-4">
              Navigation Rapide
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Accueil', href: '#hero' },
                { label: 'Qui sommes-nous', href: '#about' },
                { label: 'Nos 7 Missions', href: '#missions' },
                { label: 'Filières & Produits', href: '#produits' },
                { label: 'Actualités', href: '#actu' },
                { label: 'Galerie Médias', href: '#galerie' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-emerald-200/80 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Tutelles */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-4">
              Coordonnées de l'Office
            </h4>
            
            <div className="space-y-2.5 text-xs text-emerald-100/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Moroni, Petite Coulée, Rue Caisse des Retraites des Comores, Union des Comores</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+269 733 23 18 / +269 499 60 25</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@ocprcomores.com</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-[#064e3b]/50 border border-emerald-500/20 text-[11px] text-emerald-200/90 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Placé sous la tutelle de l'Agriculture, de l'Économie et des Finances des Comores.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60">
          <p>
            &copy; {new Date().getFullYear()} <strong>OCPR Comores</strong> — Office Comorien des Produits de Rente. Tous droits réservés.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950 hover:bg-emerald-800 border border-emerald-500/30 text-white transition-all hover:scale-105"
            aria-label="Retour en haut"
          >
            <span>Haut de page</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
