import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Compass, 
  FileText, 
  Sparkles, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page non trouvée (404) | OCPR Comores',
  description: "La page que vous recherchez n'existe pas ou a été déplacée. Retrouvez les informations officielles de l'Office Comorien des Produits de Rente.",
};

export default function NotFound() {
  const quickLinks = [
    {
      title: 'Accueil & Présentation',
      desc: "Découvrez l'Office Comorien des Produits de Rente et ses missions.",
      href: '/#hero',
      icon: Home,
      badge: 'Général',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      title: 'Filières & Produits de Rente',
      desc: 'Vanille Bourbon, Huile essentielle d’Ylang-Ylang et Girofle des Comores.',
      href: '/#produits',
      icon: Sparkles,
      badge: 'Production',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      title: 'Missions & Régulation',
      desc: 'Qualité, traçabilité, développement des exportations et encadrement.',
      href: '/#missions',
      icon: Compass,
      badge: 'Institutionnel',
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    },
    {
      title: 'Documents & Réglementations',
      desc: 'Textes officiels, arrêtés ministériels, guides et formulaires d’agrément.',
      href: '/#documents',
      icon: FileText,
      badge: 'Ressources',
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d2e1a] text-slate-100 flex flex-col justify-between selection:bg-[#DAA520] selection:text-[#184E2A] relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Gradients */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#DAA520]/15 rounded-full blur-[140px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/3 -left-40 w-[550px] h-[550px] bg-[#2A7B44]/25 rounded-full blur-[130px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-[#1E5E33]/30 rounded-full blur-[120px]" 
      />

      {/* Subtle Pattern Grid */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#DAA520_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Header Bar */}
      <header className="relative z-10 border-b border-emerald-700/30 bg-[#123820]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-transform hover:opacity-95"
            title="Retour à l'accueil de l'OCPR"
          >
            <img
              src="/logo-blanc.png"
              alt="OCPR Comores"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DAA520]" />
              Site Officiel • Union des Comores
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-4xl w-full mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Erreur 404 • Page Non Trouvée
          </div>

          {/* Large Stylized 404 Display */}
          <div className="relative my-2 select-none">
            <h1 className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tighter leading-none bg-gradient-to-b from-white via-emerald-100 to-emerald-400/40 bg-clip-text text-transparent drop-shadow-sm font-heading">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="text-[12rem] sm:text-[14rem] md:text-[16rem] font-black text-[#DAA520] blur-sm">
                404
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="max-w-2xl mx-auto mb-8 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Oups ! Cette destination reste introuvable.
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/75 leading-relaxed">
              La page que vous tentez d&apos;atteindre n&apos;existe pas, a été déplacée ou son adresse est momentanément inaccessible.
              Vous pouvez retrouver les sections clés de l&apos;Office Comorien des Produits de Rente ci-dessous.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DAA520] to-[#E7B83A] text-[#184E2A] font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Retourner à l&apos;accueil</span>
            </Link>

            <Link
              href="/#produits"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1E5E33] hover:bg-[#23693A] text-white font-bold text-sm border border-emerald-500/40 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#DAA520]" />
              <span>Explorer les filières de rente</span>
            </Link>

            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200 hover:text-white font-semibold text-sm border border-white/15 transition-all"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Nous contacter</span>
            </Link>
          </div>

          {/* Helpful Navigation Cards Grid */}
          <div className="text-left mt-10 pt-10 border-t border-emerald-700/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#DAA520]" />
                Raccourcis vers les rubriques principales
              </h3>
              <span className="text-xs text-emerald-400/60 hidden sm:inline">
                Accès direct au portail
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {quickLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group p-4 rounded-xl bg-[#133c23]/80 hover:bg-[#184a2b] border border-emerald-600/30 hover:border-amber-400/50 transition-all duration-300 flex items-start gap-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#0e2c1a] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5 text-[#DAA520]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {item.title}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${item.color}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/70 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-500/60 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 self-center" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 border-t border-emerald-700/30 bg-[#0a2314]/80 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/70">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">OCPR</span>
            <span>•</span>
            <span>Office Comorien des Produits de Rente — Moroni, Union des Comores</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="tel:+2697332318" 
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-[#DAA520]" />
              <span>+269 733 23 18</span>
            </a>
            <span className="opacity-40">•</span>
            <a 
              href="mailto:info@ocprcomores.com" 
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3 text-[#DAA520]" />
              <span>info@ocprcomores.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
