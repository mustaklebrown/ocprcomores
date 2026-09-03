'use client';

import { useEffect, useState, useMemo } from 'react';
import { Image as ImageIcon, Video, X, Play, Maximize2, Film, Layers, RefreshCw, AlertCircle } from 'lucide-react';

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  category: string;
  src: string;
  description?: string;
  createdAt?: string;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.startsWith('/uploads/videos') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.mov') ||
    url.endsWith('.ogg') ||
    url.includes('.mp4?') ||
    url.includes('.webm?')
  );
}

function getEmbedVideoUrl(url: string): string {
  const ytId = getYouTubeVideoId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
  }
  if (url.includes('vimeo.com')) {
    const vimeoId = url.split('/').filter(Boolean).pop()?.split('?')[0];
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }
  return url;
}

export default function GallerySection() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [activeType, setActiveType] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  async function fetchMediaFromDatabase() {
    setLoading(true);
    try {
      const res = await fetch('/api/media', { cache: 'no-store' });
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      
      if (Array.isArray(data.media)) {
        const formatted: MediaItem[] = data.media.map((m: any) => {
          const isVideo = m.type === 'VIDEO' || isDirectVideoUrl(m.url);
          return {
            id: String(m.id),
            title: m.title || 'Média sans titre',
            type: isVideo ? 'video' : 'image',
            category: m.category ? m.category.trim() : 'Général',
            src: m.url || FALLBACK_IMAGE,
            description: m.description || '',
            createdAt: m.createdAt,
          };
        });
        setMediaItems(formatted);
      }
    } catch (e) {
      console.error('Erreur synchronisation galerie avec la base de données:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMediaFromDatabase();
  }, []);

  // Dynamically extract all available categories directly from database items
  const categories = useMemo(() => {
    const set = new Set<string>();
    mediaItems.forEach((m) => {
      if (m.category && m.category.trim() !== '') {
        set.add(m.category.trim());
      }
    });
    return ['Tous', ...Array.from(set)];
  }, [mediaItems]);

  // Counts for tabs calculated directly from database records
  const photoCount = useMemo(
    () => mediaItems.filter((m) => m.type === 'image').length,
    [mediaItems]
  );
  const videoCount = useMemo(
    () => mediaItems.filter((m) => m.type === 'video').length,
    [mediaItems]
  );

  // Filtered media list directly bound to database items
  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchCat = activeCategory === 'Tous' || item.category === activeCategory;
      const matchType =
        activeType === 'ALL' ||
        (activeType === 'PHOTO' && item.type === 'image') ||
        (activeType === 'VIDEO' && item.type === 'video');
      return matchCat && matchType;
    });
  }, [mediaItems, activeCategory, activeType]);

  return (
    <section id="galerie" className="section-padding bg-[#184E2A] text-white relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Section Header */}
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
            Explorez en haute définition le patrimoine agricole de l&apos;Union des Comores : récolte de la Vanille Bourbon, distillation d&apos;Ylang-Ylang, clous de Girofle et événements phares de l&apos;Office.
          </p>

          {/* Quick Filter: All / Photos / Videos */}
          <div className="flex items-center justify-center gap-2 mt-7">
            <div className="inline-flex p-1 rounded-2xl bg-[#0F351D] border border-emerald-600/30 shadow-inner">
              <button
                onClick={() => setActiveType('ALL')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeType === 'ALL'
                    ? 'bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-slate-950 shadow-md'
                    : 'text-emerald-200/80 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tous ({mediaItems.length})</span>
              </button>

              <button
                onClick={() => setActiveType('PHOTO')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeType === 'PHOTO'
                    ? 'bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-slate-950 shadow-md'
                    : 'text-emerald-200/80 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({photoCount})</span>
              </button>

              <button
                onClick={() => setActiveType('VIDEO')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeType === 'VIDEO'
                    ? 'bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-slate-950 shadow-md'
                    : 'text-emerald-200/80 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Vidéos ({videoCount})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-white text-[#184E2A] shadow-md scale-105'
                      : 'bg-[#1E5E33]/70 text-emerald-200/90 hover:bg-[#2A7B44] hover:text-white border border-[#2A7B44]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Media Grid / Loader / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-64 rounded-3xl bg-[#0F351D]/60 border border-emerald-500/10 animate-pulse flex flex-col justify-end p-5 space-y-2"
              >
                <div className="h-3 w-16 bg-emerald-700/40 rounded-full" />
                <div className="h-4 w-3/4 bg-emerald-700/40 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="mt-12 p-12 text-center bg-[#0F351D]/50 border border-emerald-500/20 rounded-3xl max-w-lg mx-auto space-y-3">
            <ImageIcon className="w-10 h-10 text-emerald-400 mx-auto opacity-60" />
            <h3 className="text-base font-bold text-white">Aucun média dans cette catégorie</h3>
            <p className="text-xs text-emerald-200/80">
              Sélectionnez &quot;Tous&quot; ou ajoutez de nouvelles photos et vidéos depuis l&apos;espace d&apos;administration.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {filteredMedia.map((item) => {
              const isVideo = item.type === 'video';
              const ytId = isVideo ? getYouTubeVideoId(item.src) : null;
              const isDirectVid = isVideo && isDirectVideoUrl(item.src);
              const ytThumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className="relative h-64 w-full group rounded-3xl overflow-hidden cursor-pointer bg-[#0D2E18] border border-emerald-500/25 hover:border-[#DAA520] shadow-xl transition-all duration-500 hover:-translate-y-1.5"
                >
                  {/* 1. Video Element or Image Render */}
                  {isVideo ? (
                    ytThumbnail ? (
                      <img
                        src={ytThumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    ) : isDirectVid ? (
                      <div className="w-full h-full relative bg-black overflow-hidden flex items-center justify-center">
                        <video
                          src={`${item.src}#t=0.5`}
                          preload="metadata"
                          muted
                          playsInline
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                        />
                      </div>
                    ) : (
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    )
                  ) : (
                    /* 2. Photo Image Render with Error Fallback */
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  )}

                  {/* Dark Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 opacity-75 group-hover:opacity-85 transition-opacity" />

                  {/* Media Type Badge (Top-Left) */}
                  <div className="absolute top-3.5 left-3.5 px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-white backdrop-blur-md flex items-center gap-1.5 shadow-md">
                    {isVideo ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">Vidéo</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">Photo</span>
                      </>
                    )}
                  </div>

                  {/* Play Button Icon for Video (Center Overlay) */}
                  {isVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-14 h-14 rounded-full bg-amber-500/20 animate-ping group-hover:bg-amber-400/40" />
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white shadow-2xl flex items-center justify-center pl-1 group-hover:scale-110 group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300 border border-white/30">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-3 rounded-full bg-emerald-600/90 text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform backdrop-blur-sm border border-emerald-400/30">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Caption & Category */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DAA520] block mb-1">
                      {item.category}
                    </span>
                    <p className="text-xs font-bold leading-snug line-clamp-2 text-white group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox / Video Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#042f24] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#03140e] border-b border-emerald-800/80 text-white">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                  {selectedMedia.category} • {selectedMedia.type === 'video' ? 'Vidéo' : 'Photo'}
                </span>
                <h3 className="text-sm md:text-base font-bold text-emerald-50 line-clamp-1">
                  {selectedMedia.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 rounded-xl bg-emerald-900/80 text-white hover:bg-emerald-700 transition-colors"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {selectedMedia.type === 'video' ? (
                isDirectVideoUrl(selectedMedia.src) ? (
                  <video
                    src={selectedMedia.src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <iframe
                    className="w-full h-full border-0"
                    src={getEmbedVideoUrl(selectedMedia.src)}
                    title={selectedMedia.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <img
                  src={selectedMedia.src || FALLBACK_IMAGE}
                  alt={selectedMedia.title}
                  className="w-full h-full object-contain object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              )}
            </div>

            {/* Optional Description Footer in Modal */}
            {selectedMedia.description && (
              <div className="p-4 bg-[#03140e] border-t border-emerald-800/60 text-xs text-emerald-200/90 leading-relaxed">
                {selectedMedia.description}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
