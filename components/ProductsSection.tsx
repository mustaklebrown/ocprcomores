'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Leaf, Award, ArrowRight, X, Check, Globe, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  scientificName: string;
  category: 'Pilier Majeur' | 'Filière Émergente';
  description: string;
  image: string;
  features: string[];
  islandZones: string;
  qualityStandard: string;
  exportHighlights: string;
}

const defaultProducts: Product[] = [
  {
    id: 'vanille',
    name: 'Vanille Bourbon des Comores',
    scientificName: 'Vanilla planifolia',
    category: 'Pilier Majeur',
    description: 'La Vanille des Comores est réputée dans le monde entier pour son arôme envoûtant, sa forte teneur en vanilline et ses gousses noires charnues d\'une souplesse exceptionnelle.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    features: [
      'Séchage naturel au soleil traditionnel',
      'Teneur élevée en vanilline naturelle',
      'Culture biologique sans intrants chimiques',
      'Gousses souples et riches en graines'
    ],
    islandZones: 'Grande Comore, Anjouan, Mohéli',
    qualityStandard: 'Norme ISO 5565-1 Grade A/B',
    exportHighlights: 'Exportée vers l\'Europe, l\'Amérique du Nord et l\'Asie pour la haute gastronomie et la parfumerie.'
  },
  {
    id: 'ylang',
    name: 'Huile Essentielle d\'Ylang-Ylang',
    scientificName: 'Cananga odorata',
    category: 'Pilier Majeur',
    description: 'Fleur emblématique de l\'archipel, l\'Ylang-Ylang offre des huiles essentielles d\'une pureté rare distilled traditionnellement dans les alambics de l\'île d\'Anjouan et de Mohéli.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    features: [
      'Distillation artisanale à la vapeur d\'eau',
      'Fractionnement Extra & Première Qualité',
      'Partenaire incontournable de la haute parfumerie',
      'Gestion éco-responsable des plantations'
    ],
    islandZones: 'Anjouan (Capitale de l\'Ylang), Mohéli',
    qualityStandard: 'Certifié Pure & Naturelle ISO 9842',
    exportHighlights: 'Fournisseur direct des plus grandes maisons de parfumerie de luxe mondiales.'
  },
  {
    id: 'girofle',
    name: 'Clous de Girofle & Essence',
    scientificName: 'Syzygium aromaticum',
    category: 'Pilier Majeur',
    description: 'Deuxième pilier d\'exportation des Comores, les clous de girofle comoriens sont appréciés pour leur fort pourcentage en eugénol et leur arôme épicé intense.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    features: [
      'Taux élevé en eugénol (> 85%)',
      'Séchage artisanal préservant l\'huile essentielle',
      'Utilisation culinaire, cosmétique et pharmaceutique'
    ],
    islandZones: 'Anjouan, Mohéli, Grande Comore',
    qualityStandard: 'Norme ISO 2254 Qualité Supérieure',
    exportHighlights: 'Largement exporté vers l\'Asie du Sud-Est, l\'Europe et le Moyen-Orient.'
  },
  {
    id: 'poivre',
    name: 'Poivre de Mohéli',
    scientificName: 'Piper nigrum',
    category: 'Filière Émergente',
    description: 'Le poivre noir et blanc de l\'île de Mohéli développe un piquant équilibré aux notes boisées et fruitées, cultivé en agroforesterie.',
    image: 'https://images.unsplash.com/photo-1509358211525-44249e6f81d8?auto=format&fit=crop&w=800&q=80',
    features: [
      'Grains denses riches en pipérine',
      'Culture ombragée sous cou couvert naturel',
      'Récolte à la main séchée au soleil'
    ],
    islandZones: 'Mohéli, Anjouan',
    qualityStandard: 'Norme Spécifique OCPR Grade Gourmet',
    exportHighlights: 'Filière d\'exportation de niche à forte valeur ajoutée.'
  },
  {
    id: 'curcuma',
    name: 'Curcuma & Épices Fines',
    scientificName: 'Curcuma longa',
    category: 'Filière Émergente',
    description: 'Le curcuma des Comores est reconnu pour sa couleur dorée intense et son taux de curcumine élevé, issu d\'une agriculture familiale 100% naturelle.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    features: [
      'Riche en curcumine naturelle',
      'Propriétés antioxydantes et anti-inflammatoires',
      'Transformation locale en poudre fine'
    ],
    islandZones: 'Grande Comore, Mohéli',
    qualityStandard: 'Norme Agro-Alimentaire Comorienne',
    exportHighlights: 'Marchés bio régionaux et réexportation de spécialités.'
  },
  {
    id: 'cardamome',
    name: 'Cardamome Aromatique',
    scientificName: 'Elettaria cardamomum',
    category: 'Filière Émergente',
    description: 'Cardamome vert vif récoltée dans les sous-bois ombragés de l\'archipel, offrant une fraîcheur camphrée et citronnée remarquable.',
    image: 'https://images.unsplash.com/photo-1587049352847-81a56d773cae?auto=format&fit=crop&w=800&q=80',
    features: [
      'Capsules vertes charnues pleines de graines',
      'Culture ombragée sous couvert forestier',
      'Valeur ajoutée élevée pour les producteurs'
    ],
    islandZones: 'Anjouan, Mohéli',
    qualityStandard: 'Extra Green Pods',
    exportHighlights: 'Marchés d\'exportation vers l\'Orient et l\'Europe.'
  }
];

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          const formatted: Product[] = data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            scientificName: p.scientificName || '',
            category: p.category || 'Pilier Majeur',
            description: p.description || '',
            image: p.imageUrl || defaultProducts[0].image,
            features: ['Qualité certifiée OCPR', p.isoNorms ? `Norme ${p.isoNorms}` : 'Norme ISO'],
            islandZones: p.islands || 'Grande Comore, Anjouan, Mohéli',
            qualityStandard: p.isoNorms || 'Standard OCPR',
            exportHighlights: p.exportDetails || 'Filière d\'exportation soutenue par l\'OCPR.',
          }));
          setProducts(formatted);
        }
      } catch (e) {
        // Keep default fallback products if DB offline
      }
    }
    loadProducts();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<'Tous' | 'Pilier Majeur' | 'Filière Émergente'>('Tous');

  const filteredProducts = activeFilter === 'Tous' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <section id="produits" className="section-padding bg-[#f8faf9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="section-header">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A7B44]/10 border border-[#2A7B44]/30 text-[#2A7B44] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#DAA520]" />
            <span>Richesses Agricoles Comoriennes</span>
          </div>
          <h2 className="section-title text-[#12371F]">
            Nos Filières & Produits de Rente
          </h2>
          <p className="section-subtitle">
            L'OCPR encadre la chaîne de valeur, le contrôle de qualité et la promotion des produits phares de l'archipel des Comores.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {(['Tous', 'Pilier Majeur', 'Filière Émergente'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-[#2A7B44] text-white shadow-md scale-105'
                    : 'bg-white text-[#523824] hover:bg-emerald-50 border border-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner with Badge */}
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <span className={`absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                    product.category === 'Pilier Majeur'
                      ? 'bg-[#DAA520] text-white'
                      : 'bg-[#2A7B44] text-white'
                  }`}>
                    {product.category}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs italic text-amber-200 block font-heading">
                      {product.scientificName}
                    </span>
                    <h3 className="text-xl font-bold font-heading">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {product.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#12371F] font-semibold">
                        <Check className="w-4 h-4 text-[#2A7B44] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full text-xs uppercase font-bold tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 border-2 border-[#2A7B44] text-[#2A7B44] hover:bg-[#2A7B44] hover:text-white transition-colors"
                >
                  <span>Fiche Technique & Détails</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#042f24] via-[#042f24]/50 to-transparent" />
              
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  {selectedProduct.category} • {selectedProduct.scientificName}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold font-heading mt-1">
                  {selectedProduct.name}
                </h3>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Présentation</h4>
                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                  {selectedProduct.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Caractéristiques Clés</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-100">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Zones de Production</span>
                  <p className="text-sm font-bold text-emerald-950">{selectedProduct.islandZones}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">Norme & Qualité</span>
                  <p className="text-sm font-bold text-amber-950">{selectedProduct.qualityStandard}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950 text-white">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Rayonnement International</span>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  {selectedProduct.exportHighlights}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="btn btn-primary text-xs uppercase font-bold py-2.5 px-6 rounded-xl"
              >
                Fermer la Fiche
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
