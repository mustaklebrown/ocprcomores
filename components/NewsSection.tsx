'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  ChevronRight,
  X,
  Share2,
  Printer,
  Check,
  BookmarkCheck,
  Sparkles,
  Building2,
  Tag,
} from 'lucide-react';

interface Article {
  id: string | number;
  title: string;
  category: string;
  date: string;
  readTime?: string;
  summary: string;
  content: string;
  image: string;
}

const defaultArticles: Article[] = [
  {
    id: 'art-1',
    title: "Pose de la première pierre du futur siège officiel de l'OCPR",
    category: 'Événement Officiel',
    date: '27 Septembre 2024',
    readTime: '3 min',
    summary:
      "Cérémonie solennelle de lancement des travaux de construction des infrastructures modernes de l'Office Comorien des Produits de Rente.",
    content: `## Une avancée majeure pour les filières agricoles comoriennes

En présence des membres du gouvernement, des représentants des ministères de tutelle (Agriculture, Économie, Finances) et des présidents des coopératives régionales, la pose de la première pierre du siège de l'OCPR consacre la volonté de l'État d'offrir des infrastructures de classe mondiale.

> « Ce nouveau siège abritera non seulement les services administratifs, mais également un laboratoire moderne d'analyse et de certification aux normes internationales ISO pour la Vanille Bourbon, le Girofle et les huiles essentielles d'Ylang-Ylang. »

### Des équipements à la hauteur des enjeux d'exportation
Ce complexe comportera :
- Un laboratoire de contrôle qualité physico-chimique
- Une salle de conférences et de formation pour les coopératives
- Un guichet unique d'accompagnement des exportateurs agréés
- Un centre de documentation et de veille des cours mondiaux des épices

Cette initiative consolide le rayonnement de l'agriculture comorienne sur les marchés mondiaux les plus exigeants.`,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'art-2',
    title: 'Lancement de la campagne de valorisation et de récolte de la Vanille Bourbon',
    category: 'Filières Agricoles',
    date: '15 Octobre 2024',
    readTime: '4 min',
    summary:
      "L'OCPR fixe les orientations techniques, le barème de maturité et le calendrier officiel pour la collecte et la préparation des gousses d'exception.",
    content: `## Protection du terroir et lutte contre la récolte précoce

Dans le cadre de ses missions régaliennes de régulation et d'appui-conseil aux producteurs, l'Office Comorien des Produits de Rente a réuni l'ensemble des acteurs de la filière pour harmoniser les pratiques d'affinage traditionnel.

> « La renommée de la Vanille des Comores repose sur son taux de vanilline naturel exceptionnel (> 2.0%) et sur le respect strict du cycle végétatif de la plante. »

### Recommandations techniques clés pour la campagne :
- Interdiction stricte de récolte avant la maturité complète des gousses
- Échaudage et étuvage dans le respect des températures certifiées
- Séchage alterné soleil/ombre sur claies aérées
- Conditionnement sous vide uniquement après la période d'affinage en malles`,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'art-3',
    title: "Modernisation des alambics traditionnels d'Ylang-Ylang à Anjouan et Mohéli",
    category: 'Coopération & Formation',
    date: '02 Novembre 2024',
    readTime: '3 min',
    summary:
      "Déploiement d'un programme d'efficacité énergétique et de formation des maîtres distillateurs pour sublimer la pureté des huiles essentielles.",
    content: `## Une distillation écologique au service de la haute parfumerie

L'Ylang-Ylang des Comores est le trésor olfactif de l'archipel. Afin d'allier préservation des forêts et excellence de la fraction extra-supérieure, l'OCPR a initié un programme pilote d'optimisation thermique des alambics.

> « Grâce à des foyers améliorés et des condenseurs en inox alimentaire, les distillateurs réduisent de 40% leur consommation de bois tout en obtenant une huile d'une finesse incomparable. »

### Résultats attendus du programme :
- Amélioration de l'indice de réfraction et du taux de linalol
- Réduction significative de l'empreinte environnementale de la filière
- Revalorisation du revenu direct des cueilleurs et exploitants locaux`,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
  },
];

// Rich Content Renderer component with Typography
function RichContentRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-4 text-slate-700 leading-relaxed font-sans text-sm md:text-base">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={idx} className="h-2" />;

        // Markdown Headings H2
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="text-lg md:text-xl font-bold text-[#12371F] font-heading pt-4 pb-1 border-b border-emerald-100 flex items-center gap-2"
            >
              <span className="w-1.5 h-4 bg-[#DAA520] rounded-full inline-block" />
              <span>{trimmed.replace('## ', '')}</span>
            </h3>
          );
        }

        // Markdown Headings H3
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="text-base md:text-lg font-bold text-emerald-900 font-heading pt-3 pb-1"
            >
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace(/^>\s*«?\s*/, '').replace(/\s*»?\s*$/, '');
          return (
            <blockquote
              key={idx}
              className="my-5 p-5 bg-gradient-to-r from-emerald-50/90 via-emerald-50/40 to-transparent border-l-4 border-[#DAA520] rounded-r-2xl shadow-xs italic text-emerald-950 font-serif text-sm md:text-base leading-relaxed"
            >
              <span className="text-[#DAA520] text-2xl font-serif font-black mr-1 leading-none">“</span>
              <span>{quoteText}</span>
              <span className="text-[#DAA520] text-2xl font-serif font-black ml-1 leading-none">”</span>
            </blockquote>
          );
        }

        // Bullet Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-3 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <span className="text-slate-800 text-sm md:text-base">{trimmed.substring(2)}</span>
            </div>
          );
        }

        // Inline Images: ![alt](url)
        const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imageMatch) {
          const alt = imageMatch[1];
          const src = imageMatch[2];
          return (
            <figure key={idx} className="my-6 space-y-2">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video max-h-96 w-full bg-slate-100">
                <img
                  src={src}
                  alt={alt || 'Illustration OCPR'}
                  className="w-full h-full object-cover"
                />
              </div>
              {alt && (
                <figcaption className="text-center text-xs text-slate-500 italic">
                  📷 {alt}
                </figcaption>
              )}
            </figure>
          );
        }

        // Standard Paragraphs with bold formatting
        return (
          <p key={idx} className="text-slate-700 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) return;
        const data = await res.json();
        if (data.news && data.news.length > 0) {
          const formatted: Article[] = data.news.map((a: any) => ({
            id: a.id,
            title: a.title,
            category: a.category || 'Actualité',
            date: a.date || 'Récemment',
            readTime: a.readTime || '3 min',
            summary: a.excerpt || '',
            content: a.content || a.excerpt || '',
            image: a.imageUrl || defaultArticles[0].image,
          }));
          setArticles(formatted);
        }
      } catch (e) {
        // keep fallback
      }
    }
    loadNews();
  }, []);

  const categories = useMemo(() => {
    const list = ['Tous'];
    articles.forEach((a) => {
      if (a.category && !list.includes(a.category)) {
        list.push(a.category);
      }
    });
    return list;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'Tous') return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  function handleShare(article: Article) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section id="actu" className="section-padding bg-[#FAF8F5] relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Refined Typography */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#184E2A]/10 border border-[#2A7B44]/30 text-[#184E2A] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>Journal Officiel & Publications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#12371F] font-heading tracking-tight leading-tight mb-4">
            Actualités de l'Office & des Filières
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Suivez les avancées sur le terrain, les décrets officiels et les initiatives d'encadrement des filières Vanille, Girofle et Ylang-Ylang.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
                    active
                      ? 'bg-[#184E2A] text-white border-[#184E2A] shadow-md shadow-emerald-950/20 scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Date Tag */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 bg-[#184E2A]/90 text-amber-300 border border-[#DAA520]/40 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                    {article.category}
                  </div>

                  {/* Read time pill */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-slate-200 text-[11px] font-medium px-2.5 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#DAA520]" />
                    <span>{article.readTime || '3 min'}</span>
                  </div>
                </div>

                {/* Article Card Content */}
                <div className="p-6 md:p-7">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-[#DAA520]" />
                    <span>{article.date}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-[#12371F] font-heading mb-3 group-hover:text-[#2A7B44] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Read More Trigger */}
              <div className="p-6 md:p-7 pt-0">
                <button
                  onClick={() => setActiveArticle(article)}
                  className="w-full inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50 text-xs font-bold uppercase tracking-wider text-[#184E2A] hover:text-[#2A7B44] transition-all border border-slate-100 hover:border-emerald-200 group/btn"
                >
                  <span>Lire l'article officiel</span>
                  <ChevronRight className="w-4 h-4 text-[#DAA520] group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Magazine Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Hero Banner */}
            <div className="relative h-64 sm:h-80 shrink-0 overflow-hidden bg-slate-900">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091A10] via-black/50 to-black/30" />

              {/* Top Action bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-[#DAA520]" />
                  <span>OCPR Comores</span>
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-full bg-black/60 text-white hover:bg-[#184E2A] transition-colors border border-white/20"
                  aria-label="Fermer la fenêtre"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Metadata Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-[#DAA520] text-[#184E2A] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                    {activeArticle.category}
                  </span>
                  <span className="text-emerald-200 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeArticle.date}</span>
                  </span>
                  <span className="text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeArticle.readTime || '3 min'} de lecture</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-white leading-tight drop-shadow-md">
                  {activeArticle.title}
                </h2>
              </div>
            </div>

            {/* Modal Body - Editorial Typography */}
            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto flex-1 space-y-6">
              {/* Lead Excerpt */}
              {activeArticle.summary && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-transparent border-l-4 border-[#184E2A] text-[#12371F] font-semibold text-sm sm:text-base leading-relaxed">
                  {activeArticle.summary}
                </div>
              )}

              {/* Article Main Text */}
              <RichContentRenderer content={activeArticle.content} />

              {/* Official Seal / Signature Footer */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#184E2A]/10 border border-[#184E2A]/20 flex items-center justify-center text-[#184E2A] font-bold">
                    <BookmarkCheck className="w-5 h-5 text-[#DAA520]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Direction de la Communication</p>
                    <p className="text-slate-500 text-[11px]">Office Comorien des Produits de Rente</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeArticle)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium text-xs"
                    title="Copier le lien"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copied ? 'Lien copié !' : 'Partager'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium text-xs"
                    title="Imprimer le communiqué"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Imprimer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 bg-[#184E2A] hover:bg-[#2A7B44] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

