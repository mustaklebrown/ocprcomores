'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Award, ShieldCheck, ArrowRight, Sparkles, Sprout } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  bgGradient: string;
  badge: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: 'Filière d\'Excellence Comorienne',
    title: 'La Vanille Bourbon & les Produits de Rente des Comores',
    subtitle: 'Qualité Internationale & Authenticité Naturelle',
    description: 'L\'Office Comorien des Produits de Rente (OCPR) est l\'établissement public national dédié à la valorisation, l\'encadrement et au développement durable de la Vanille, du Girofle et de l\'Ylang-Ylang.',
    bgGradient: 'from-[#03140e] via-[#064e3b] to-[#042f24]',
    badge: '100% Qualité Certifiée',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    tag: 'Ressources Agricoles Majeures',
    title: 'Girofle, Ylang-Ylang & Épices à Fort Potentiel',
    subtitle: 'Diversification & Soutien aux Producteurs',
    description: 'En plus des piliers traditionnels, l\'OCPR accompagne l\'essor du Curcuma, du Gingembre, de la Cardamome, du Poivre Noir et du Café sur l\'ensemble du territoire national.',
    bgGradient: 'from-[#1c1917] via-[#78350f] to-[#064e3b]',
    badge: 'Patrimoine Économique',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    tag: 'Partenariats & Expertise',
    title: 'L\'Écosystème au Service du Progrès Agricole',
    subtitle: 'Lien entre Producteurs, État et Marchés Internationaux',
    description: 'Appui technique, formation, financement et infrastructures modernes de conservation et de transformation pour faire rayonner le savoir-faire comorien à travers le monde.',
    bgGradient: 'from-[#042f24] via-[#059669] to-[#065f46]',
    badge: 'Autonomie & Innovation',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="hero" suppressHydrationWarning className="relative min-h-[92vh] flex items-center justify-center pt-40 pb-16 overflow-hidden bg-[#184E2A]">
      {/* Background Slides with Optimized Next Image */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            priority={index === 0}
            quality={85}
            className="object-cover transform scale-105 transition-transform duration-10000"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-90 backdrop-blur-xs`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#184E2A]/70 to-[#184E2A]" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7">

            {/* Animated Badge with Logo Color Palette Dots */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1E5E33]/90 border border-[#2A7B44]/50 text-amber-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-6 animate-fade-in shadow-lg">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#EDBF2B]" />
                <span className="w-2 h-2 rounded-full bg-[#8C2D32]" />
                <span className="w-2 h-2 rounded-full bg-[#2E2A68]" />
                <span className="w-2 h-2 rounded-full bg-[#2A7B44]" />
              </div>
              <span>{slides[currentSlide].tag}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4 text-white font-heading">
              {slides[currentSlide].title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl font-medium text-[#DAA520] mb-6">
              {slides[currentSlide].subtitle}
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-emerald-100/90 leading-relaxed mb-8 max-w-2xl">
              {slides[currentSlide].description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#about"
                className="btn btn-primary text-sm uppercase font-bold tracking-wider py-3.5 px-7 rounded-xl shadow-lg bg-gradient-to-r from-[#2A7B44] to-[#1D552F] hover:from-[#3EA05D] hover:to-[#2A7B44]"
              >
                <span>Découvrir l'OCPR</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#produits"
                className="btn btn-gold text-sm uppercase font-bold tracking-wider py-3.5 px-7 rounded-xl bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white hover:from-[#E7B83A] hover:to-[#DAA520]"
              >
                <span>Nos Filières de Rente</span>
                <Sprout className="w-5 h-5" />
              </a>
            </div>

            {/* Key Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#1E5E33] border border-[#2A7B44]/40 text-[#64B27C]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-emerald-200/70 font-semibold uppercase">Statut</h4>
                  <p className="text-sm font-bold text-white">Établissement Public</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#523824]/60 border border-[#DAA520]/30 text-[#DAA520]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-amber-200/70 font-semibold uppercase">Filières</h4>
                  <p className="text-sm font-bold capitalize text-white"> Produits de Diversification</p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="p-2.5 rounded-lg bg-[#1E5E33] border border-[#2A7B44]/40 text-[#DAA520]">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-emerald-200/70 font-semibold uppercase">Impact</h4>
                  <p className="text-sm font-bold text-white">Union des Comores</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High Visibility Full-Color Logo Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center relative">

            {/* Background Glow Halo */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#2A7B44]/40 via-[#DAA520]/30 to-[#8C2D32]/30 rounded-3xl blur-2xl animate-pulse" />

            {/* Premium Glass Showcase Container */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#FAF8F3] to-[#F3EFE6] text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-white/90 group hover:scale-[1.02] transition-transform duration-500">

              {/* Header Badge */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2A7B44] bg-[#2A7B44]/10 px-3 py-1 rounded-full border border-[#2A7B44]/20">
                  Sceau Officiel
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#523824]">
                  Union des Comores
                </span>
              </div>

              {/* Full Color Original Logo Element */}
              <div className="p-2 flex items-center justify-center my-2 group-hover:scale-105 transition-transform duration-500 filter drop-shadow-xl overflow-visible">
                <Image
                  src="/logo-orginal.png"
                  alt="Logo Officiel OCPR Comores"
                  width={360}
                  height={240}
                  priority
                  className="w-full max-w-[360px] h-auto object-contain p-1"
                />
              </div>

              {/* Floating Feature Tags below Logo */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-200 text-center">
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                  <span className="block text-xs font-bold text-[#2A7B44]">Vanille</span>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Bourbon</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                  <span className="block text-xs font-bold text-[#523824]">Girofle</span>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Spécialité</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                  <span className="block text-xs font-bold text-[#DAA520]">Ylang</span>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Essence</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-8 right-8 z-30 hidden md:flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-[#0B2313]/90 border border-emerald-500/30 text-white hover:bg-[#2A7B44] transition-all hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-[#DAA520]' : 'w-2.5 bg-[#12371F] hover:bg-[#2A7B44]'
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-[#0B2313]/90 border border-emerald-500/30 text-white hover:bg-[#2A7B44] transition-all hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
