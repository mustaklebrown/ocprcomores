'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  Home, 
  AlertTriangle, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Mail, 
  Phone,
  ArrowLeft
} from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to console or error reporting service
    console.error('OCPR Application Error:', error);
  }, [error]);

  const copyErrorDetails = async () => {
    const details = `Erreur OCPR:\nMessage: ${error.message || 'Erreur non spécifiée'}\nDigest: ${error.digest || 'N/A'}\nDate: ${new Date().toISOString()}`;
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Erreur lors de la copie :', err);
    }
  };

  const mailtoHref = `mailto:info@ocprcomores.com?subject=${encodeURIComponent('Rapport d\'incident technique OCPR - Code: ' + (error.digest || 'Inconnu'))}&body=${encodeURIComponent('Bonjour,\n\nJe signale une erreur rencontrée sur le portail OCPR Comores:\n\nMessage: ' + (error.message || 'Non spécifié') + '\nDigest: ' + (error.digest || 'N/A') + '\nURL: ' + (typeof window !== 'undefined' ? window.location.href : '') + '\n\nCordialement.')}`;

  return (
    <div className="min-h-screen bg-[#0d2e1a] text-slate-100 flex flex-col justify-between selection:bg-[#DAA520] selection:text-[#184E2A] relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Gradients */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#8C2D32]/20 rounded-full blur-[140px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 -right-40 w-[550px] h-[550px] bg-[#DAA520]/15 rounded-full blur-[140px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-[#2A7B44]/25 rounded-full blur-[120px]" 
      />

      {/* Subtle Pattern Grid */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#DAA520_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Top Header */}
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

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au portail</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-2xl w-full mx-auto">
          
          {/* Main Error Glass Card */}
          <div className="relative rounded-2xl bg-[#123820]/80 border border-emerald-500/30 backdrop-blur-xl p-6 sm:p-10 shadow-2xl overflow-hidden text-center">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8C2D32] via-[#DAA520] to-[#2A7B44]" />

            {/* Error Icon Badge */}
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-inner relative group">
              <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-lg -z-10 animate-pulse" />
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-rose-500/10 border border-rose-500/30 text-rose-300 mb-4">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              Incident Inattendu • Erreur Système
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 font-heading">
              Une interruption technique s&apos;est produite
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-lg mx-auto mb-8">
              Une erreur inattendue est survenue lors de l&apos;exécution de votre requête. 
              Veuillez réessayer ou revenir à l&apos;accueil du portail officiel de l&apos;Office Comorien des Produits de Rente.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DAA520] to-[#E7B83A] text-[#184E2A] font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Réessayer maintenant</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1E5E33] hover:bg-[#23693A] text-white font-bold text-sm border border-emerald-500/40 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Home className="w-4 h-4 text-emerald-300" />
                <span>Page d&apos;accueil</span>
              </Link>

              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200 hover:text-white font-semibold text-sm border border-white/15 transition-all"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Signaler l&apos;erreur</span>
              </a>
            </div>

            {/* Collapsible Diagnostic Panel */}
            <div className="border-t border-emerald-700/30 pt-4 text-left">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-xs font-semibold text-emerald-300/80 hover:text-white py-2 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#DAA520]" />
                  Détails techniques pour l&apos;assistance
                </span>
                {showDetails ? (
                  <ChevronUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              {showDetails && (
                <div className="mt-3 p-4 rounded-xl bg-[#092213] border border-emerald-900/60 text-xs text-slate-300 font-mono space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-950">
                    <span className="text-emerald-400 font-bold text-[11px]">Rapport d&apos;exception</span>
                    <button
                      type="button"
                      onClick={copyErrorDetails}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans font-medium transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-amber-300" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>

                  {error.digest && (
                    <div className="text-[11px] text-amber-300/90 break-all">
                      <span className="text-emerald-400 font-semibold">Identifiant (Digest):</span> {error.digest}
                    </div>
                  )}

                  <div className="text-[11px] text-rose-300/90 break-all">
                    <span className="text-emerald-400 font-semibold">Message:</span> {error.message || 'Erreur sans message spécifique'}
                  </div>

                  <p className="text-[10px] font-sans text-emerald-200/50 pt-1">
                    Transmettez cet identifiant à l&apos;équipe technique de l&apos;OCPR pour faciliter la résolution de l&apos;incident.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 border-t border-emerald-700/30 bg-[#0a2314]/80 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/70">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">OCPR Comores</span>
            <span>•</span>
            <span>Office Comorien des Produits de Rente</span>
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
