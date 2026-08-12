'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Video, X, Eye, Play, Maximize2 } from 'lucide-react';

interface MediaItem {
  id: string | number;
  title: string;
  type: 'image' | 'video';
  category: 'Vanille' | 'OCPR' | 'Épices' | 'Événements' | string;
  src: string;
  thumbnail: string;
}

const defaultMediaItems: MediaItem[] = [
  {
    id: 1,
    title: 'Gousses de Vanille Bourbon des Comores',
    type: 'image',
    category: 'Vanille',
    src: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Siège & Équipe de l\'OCPR Comores',
    type: 'image',
    category: 'OCPR',
    src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Curcuma & Épices des Îles Comores',
    type: 'image',
    category: 'Épices',
    src: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Séchage & Préparation Traditionnelle',
    type: 'image',
    category: 'Vanille',
    src: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'Cérémonie de Pose de la Première Pierre',
    type: 'image',
    category: 'Événements',
    src: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    title: 'Spot Institutionnel OCPR (Présentation)',
    type: 'video',
    category: 'OCPR',
    src: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    title: 'Distillation d\'Ylang-Ylang à Anjouan',
    type: 'image',
    category: 'OCPR',
    src: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    title: 'Logo Officiel & Identité OCPR',
    type: 'image',
    category: 'OCPR',
    src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  },
];

export default function GallerySection() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(defaultMediaItems);

  useEffect(() => {
    async function loadMedia() {
      try {
        const res = await fetch('/api/media');
        if (!res.ok) return;
        const data = await res.json();
        if (data.media && data.media.length > 0) {
          const formatted: MediaItem[] = data.media.map((m: any) => ({
            id: m.id,
            title: m.title,
            type: m.type === 'VIDEO' ? 'video' : 'image',
            category: m.category || 'Général',
            src: m.url || defaultMediaItems[0].src,
            thumbnail: m.url || defaultMediaItems[0].thumbnail,
          }));
          setMediaItems(formatted);
        }
      } catch (e) {
        // fallback
      }
    }
    loadMedia();
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const categories = ['Tous', 'Vanille', 'OCPR', 'Épices', 'Événements'];

  const filteredMedia = activeCategory === 'Tous'
    ? mediaItems
    : mediaItems.filter(item => item.category === activeCategory);

  return (
    <section id="galerie" className="section-padding bg-[#184E2A] text-white relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Redesigned Section Header */}
        <div className="section-header text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1E5E33] border border-[#2A7B44] text-[#DAA520] text-xs font-extrabold uppercase tracking-widest mb-5 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DAA520] animate-pulse" />
            <span>Médiathèque Institutionnelle Officielle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight mb-4 drop-shadow-lg">
            Galerie <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5E4A3] via-[#DAA520] to-[#E7B83A]">Photos & Vidéos</span> OCPR
          </h2>

          <div className="h-1.5 w-32 bg-gradient-to-r from-[#2A7B44] via-[#DAA520] to-[#8C2D32] mx-auto mb-6 rounded-full shadow-md" />

          <p className="text-base sm:text-lg font-medium text-emerald-100/95 max-w-3xl mx-auto leading-relaxed">
            Explorez en haute définition le patrimoine agricole de l'Union des Comores : récolte de la Vanille Bourbon, distillation d'Ylang-Ylang, clous de Girofle et événements phares de l'Office.
          </p>

          {/* Redesigned Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${activeCategory === cat
                  ? 'bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white shadow-xl scale-105 border border-[#F5E4A3]/40'
                  : 'bg-[#1E5E33]/90 text-emerald-200/90 hover:bg-[#2A7B44] hover:text-white border border-[#2A7B44]/40'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="relative h-60 w-full group rounded-2xl overflow-hidden cursor-pointer bg-[#1E5E33] border border-emerald-500/20 hover:border-[#DAA520] shadow-lg transition-all duration-500 hover:-translate-y-1"
            >
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={85}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Media Type Icon Badge */}
              <div className="absolute top-3 left-3 p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-white backdrop-blur-md">
                {item.type === 'video' ? (
                  <Video className="w-4 h-4 text-amber-400" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              {/* Zoom Hover Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-3.5 rounded-full bg-amber-500 text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                  {item.type === 'video' ? <Play className="w-6 h-6 fill-current ml-0.5" /> : <Maximize2 className="w-6 h-6" />}
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block mb-0.5">
                  {item.category}
                </span>
                <p className="text-xs font-bold leading-tight line-clamp-1 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedMedia(null)}>
          <div
            className="relative w-full max-w-4xl bg-[#042f24] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#03140e] border-b border-emerald-800/80 text-white">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">{selectedMedia.category}</span>
                <h3 className="text-sm md:text-base font-bold text-emerald-50 line-clamp-1">{selectedMedia.title}</h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 rounded-xl bg-emerald-900/80 text-white hover:bg-emerald-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Body */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {selectedMedia.type === 'video' ? (
                <iframe
                  className="w-full h-full border-0"
                  src={selectedMedia.src}
                  title={selectedMedia.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={selectedMedia.src}
                  alt={selectedMedia.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  quality={95}
                  className="w-full h-full object-contain object-center"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
