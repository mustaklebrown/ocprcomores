'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, ArrowRight, Bookmark, X, ChevronRight } from 'lucide-react';

interface Article {
  id: string | number;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  image: string;
}

const defaultArticles: Article[] = [
  {
    id: 1,
    title: 'Pose de la première pierre du siège de l\'OCPR',
    category: 'Événement Officiel',
    date: '27 Septembre 2024',
    summary: 'Cérémonie officielle de lancement des travaux de construction des nouveaux locaux de l\'Office Comorien des Produits de Rente.',
    content: 'En présence des membres du gouvernement, des représentants des ministères de tutelle (Agriculture, Économie, Finances) et des acteurs des filières de rente, la pose de la première pierre du futur siège de l\'OCPR marque une étape cruciale dans la modernisation des infrastructures d\'encadrement et de contrôle qualité des produits d\'exportation comoriens.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Ouverture de la campagne de valorisation de la Vanille Bourbon',
    category: 'Filière Agricole',
    date: '15 Octobre 2024',
    summary: 'L\'OCPR fixe les orientations techniques et le calendrier officiel pour la collecte et la préparation des gousses de vanille.',
    content: 'Dans le cadre de sa mission d\'encadrement et d\'appui-conseil aux producteurs, l\'OCPR a réuni les coopératives et les préparateurs agréés pour sensibiliser aux normes de séchage et de calibrage. L\'objectif est de garantir une qualité d\'excellence sur les marchés d\'exportation européens et américains.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Renforcement du partenariat institutionnel avec les coopératives d\'Ylang-Ylang',
    category: 'Coopération & Formation',
    date: '02 Novembre 2024',
    summary: 'Atelier de formation sur l\'amélioration de l\'efficacité énergétique des alambics à Anjouan et Mohéli.',
    content: 'Afin d\'assurer une distillation plus écologique et économique de l\'Ylang-Ylang, l\'OCPR a déployé une série d\'ateliers techniques à destination des distillateurs locaux, permettant d\'optimiser la consommation de bois et d\'élever la pureté des huiles essentielles obtenues.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  },
];

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);

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
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  return (
    <section id="actu" className="section-padding bg-white relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A7B44]/10 border border-[#2A7B44]/30 text-[#2A7B44] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#DAA520]" />
            <span>Communication & Publications</span>
          </div>
          <h2 className="section-title text-[#12371F]">
            Dernières Actualités de l'OCPR
          </h2>
          <p className="section-subtitle">
            Restez informés des actions sur le terrain, des cérémonies officielles et des campagnes de promotion des filières agricoles comoriennes.
          </p>
        </div>

        {/* Articles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-[#f8faf9] rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Date Tag */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={80}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                    {article.category}
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{article.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#042f24] mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Read More Trigger */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-amber-600 transition-colors"
                >
                  <span>Lire l'article complet</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="modal-overlay" onClick={() => setActiveArticle(null)}>
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Banner */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block mb-1">
                  {activeArticle.category} • {activeArticle.date}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold font-heading">
                  {activeArticle.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 max-h-[50vh] overflow-y-auto">
              <p className="text-base font-semibold text-emerald-950 mb-4 leading-relaxed italic border-l-4 border-emerald-600 pl-4 bg-emerald-50 py-2 rounded-r-lg">
                {activeArticle.summary}
              </p>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {activeArticle.content}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="btn btn-primary text-xs uppercase font-bold py-2.5 px-6 rounded-xl"
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
