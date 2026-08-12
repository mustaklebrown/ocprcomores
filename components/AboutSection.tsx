'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, CheckCircle2, Building2, Landmark, Award, ArrowUpRight, Sprout } from 'lucide-react';
import VideoModal from './VideoModal';

export default function AboutSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative SVG background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-70" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl -z-10 opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Visual Banner with Video Launcher */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <Image
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
                alt="Office Comorien des Produits de Rente"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                quality={85}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#042f24] via-[#042f24]/30 to-transparent" />

              {/* Video Play Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="w-20 h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 group/btn mb-4"
                  aria-label="Regarder la vidéo de présentation"
                >
                  <Play className="w-8 h-8 fill-current ml-1 text-white group-hover/btn:scale-110 transition-transform" />
                </button>
                <span className="text-sm font-bold tracking-wider uppercase bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/40 backdrop-blur-md">
                  Découvrir la vidéo OCPR
                </span>
              </div>
            </div>

            {/* Floating Info Box */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-gradient-to-br from-[#064e3b] to-[#042f24] text-white p-6 rounded-2xl shadow-xl border border-emerald-400/30 max-w-xs hidden sm:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-500 rounded-lg text-white">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">Établissement Public</h4>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Placé sous la tutelle technique de l'Agriculture, de l'Économie et sous la tutelle financière des Finances.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Narrative */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A7B44]/10 border border-[#2A7B44]/30 text-[#2A7B44] text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-[#DAA520]" />
              <span>Institution Nationale Officielle</span>
            </div>

            <h2 className="section-title text-[#12371F] mb-6">
              L'Office Comorien des Produits de Rente (OCPR)
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-medium">
              L'<strong>Office Comorien des Produits de Rente (OCPR)</strong> est un établissement public à caractère administratif et à vocation agricole et économique, doté de la personnalité juridique et jouissant d'une autonomie administrative et financière.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              Créé pour dynamiser et moderniser les filières d'exportation de l'Union des Comores, l'OCPR traite spécifiquement des affaires relatives aux piliers agricoles majeurs du pays :
              <span className="font-semibold text-[#2A7B44]"> la Vanille Bourbon, le Girofle et l'Ylang-Ylang</span>. Il accompagne également les filières émergentes à fort potentiel comme le
              <span className="font-semibold text-[#523824]"> Curcuma, le Gingembre, la Cardamome, le Poivre Noir et le Café</span>.
            </p>

            {/* Tutelle & Diversification Ministries Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-[#2A7B44]/20 flex items-start gap-3 shadow-sm hover:shadow-md transition-all">
                <div className="p-2.5 rounded-lg bg-[#2A7B44] text-white shrink-0 shadow">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E5E33] text-sm">Tutelle Technique</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Ministères de l'Agriculture et de l'Économie.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-[#DAA520]/30 flex items-start gap-3 shadow-sm hover:shadow-md transition-all">
                <div className="p-2.5 rounded-lg bg-[#DAA520] text-white shrink-0 shadow">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#523824] text-sm">Tutelle Financière</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Ministères des Finances et du Budget.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-100/90 border border-[#523824]/20 flex items-start gap-3 shadow-sm hover:shadow-md transition-all">
                <div className="p-2.5 rounded-lg bg-[#523824] text-white shrink-0 shadow">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#523824] text-sm">Produits de Diversification</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Curcuma, Gingembre, Cardamome, Poivre & Café.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Link */}
            <div className="flex items-center gap-4">
              <a
                href="#missions"
                className="btn text-sm font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl bg-[#2A7B44] text-white hover:bg-[#1D552F] shadow-lg shadow-[#2A7B44]/20"
              >
                <span>Découvrir nos 7 Missions</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Video Modal Component */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/I2hmo47XxRo?autoplay=1"
        title="Présentation de l'Office Comorien des Produits de Rente"
      />
    </section>
  );
}
