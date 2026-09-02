'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  ExternalLink,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
  FolderOpen,
} from 'lucide-react';

interface DocumentItem {
  id: string | number;
  title: string;
  category: string;
  description: string;
  fileSize: string;
  fileFormat: string;
  date: string;
  fileUrl: string;
  downloads?: number;
}

const defaultDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    title: "Cadre Réglementaire & Statuts de l'OCPR",
    category: 'Réglementation',
    description:
      "Décret officiel régissant la création, les compétences et les prérogatives de l'Office Comorien des Produits de Rente.",
    fileSize: '1.2 MB',
    fileFormat: 'PDF',
    date: '2024',
    fileUrl: '/uploads/documents/cadre_reglementaire_ocpr.pdf',
  },
  {
    id: 'doc-2',
    title: 'Guide des Normes de Qualité - Vanille Bourbon',
    category: 'Exportation',
    description:
      "Spécifications techniques, taux de vanilline requis (> 2.0%) et critères de calibrage pour les lots d'exportation certifiés.",
    fileSize: '850 KB',
    fileFormat: 'PDF',
    date: '2025',
    fileUrl: '/uploads/documents/guide_normes_vanille_bourbon.pdf',
  },
  {
    id: 'doc-3',
    title: "Fiche Technique & Protocole d'Analyse - Ylang-Ylang",
    category: 'Exportation',
    description:
      "Normes de distillation et critères de contrôle physico-chimique (densité, indice de réfraction) pour l'homologation des huiles.",
    fileSize: '2.1 MB',
    fileFormat: 'PDF',
    date: '2025',
    fileUrl: '/uploads/documents/protocole_ylang_ylang.pdf',
  },
  {
    id: 'doc-4',
    title: "Formulaire Officiel de Demande d'Agrément d'Exportateur",
    category: 'Formulaire',
    description:
      "Dossier de candidature à compléter pour toute demande d'agrément officiel et de licence annuelle d'exportation.",
    fileSize: '450 KB',
    fileFormat: 'PDF',
    date: '2025',
    fileUrl: '/uploads/documents/formulaire_agrement_exportateur.pdf',
  },
  {
    id: 'doc-5',
    title: 'Rapport Annuel sur les Filières de Rente des Comores',
    category: 'Rapport',
    description:
      "Bilan statistique de la production, des tonnages exportés et de la valeur économique des cultures de rente.",
    fileSize: '3.6 MB',
    fileFormat: 'PDF',
    date: '2024',
    fileUrl: '/uploads/documents/rapport_annuel_filieres.pdf',
  },
  {
    id: 'doc-6',
    title: 'Manuel des Bonnes Pratiques Agricoles pour les Producteurs',
    category: 'Guide',
    description:
      "Guide technique d'encadrement sur les méthodes durables de culture, de récolte à maturité et de séchage traditionnel.",
    fileSize: '1.9 MB',
    fileFormat: 'PDF',
    date: '2025',
    fileUrl: '/uploads/documents/manuel_bonnes_pratiques.pdf',
  },
];

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<DocumentItem[]>(defaultDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    async function loadDocuments() {
      try {
        const res = await fetch('/api/documents');
        if (!res.ok) return;
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          setDocuments(data.documents);
        }
      } catch (e) {
        // keep defaults
      }
    }
    loadDocuments();
  }, []);

  const categories = useMemo(() => {
    const list = ['Tous'];
    documents.forEach((d) => {
      if (d.category && !list.includes(d.category)) {
        list.push(d.category);
      }
    });
    return list;
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'Tous' || doc.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [documents, searchTerm, selectedCategory]);

  return (
    <section id="documents" className="section-padding bg-[#1E5E33] text-white relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      {/* Background Accent Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2A7B44]/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#DAA520]/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="section-header text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#184E2A] border border-[#2A7B44] text-[#DAA520] text-xs font-extrabold uppercase tracking-widest mb-5 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-[#DAA520]" />
            <span>Ressources & Guides Officiels</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight mb-4 drop-shadow-md">
            Documents & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5E4A3] via-[#DAA520] to-[#E7B83A]">Textes Réglementaires</span>
          </h2>

          <div className="h-1.5 w-32 bg-gradient-to-r from-[#2A7B44] via-[#DAA520] to-[#8C2D32] mx-auto mb-6 rounded-full shadow-md" />

          <p className="text-base sm:text-lg font-medium text-emerald-100/95 max-w-3xl mx-auto leading-relaxed">
            Consultez et téléchargez les décrets de loi, guides techniques d'exportation, formulaires d'agrément et bilans statistiques de l'OCPR.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par mot-clé (vanille, agrément, décret...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#123B20] border border-[#2A7B44] focus:border-[#DAA520] rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-emerald-300/60 outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#DAA520] text-[#12371F] shadow-lg scale-105'
                      : 'bg-[#184E2A]/80 text-emerald-200 hover:bg-[#2A7B44] border border-[#2A7B44]/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center bg-[#184E2A]/70 rounded-3xl border border-[#2A7B44] max-w-md mx-auto space-y-2">
            <FolderOpen className="w-8 h-8 text-amber-300 mx-auto" />
            <p className="text-sm font-semibold text-emerald-100">Aucun document ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#184E2A] rounded-3xl p-6 border border-[#2A7B44]/60 hover:border-[#DAA520] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  {/* Header Badge & Format */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2A7B44] text-white border border-emerald-400/30">
                      {doc.category}
                    </span>
                    <span className="text-xs font-bold text-[#DAA520] bg-[#DAA520]/15 px-2.5 py-0.5 rounded-md border border-[#DAA520]/30 font-mono">
                      {doc.fileFormat} • {doc.fileSize}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#DAA520] transition-colors leading-snug">
                    {doc.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mb-6">
                    {doc.description}
                  </p>
                </div>

                {/* Action Button & Metadata */}
                <div className="pt-4 border-t border-[#2A7B44]/40 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-200/70">
                    Édition {doc.date}
                  </span>
                  
                  <a
                    href={doc.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2A7B44] hover:bg-[#DAA520] text-white hover:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md group-hover:scale-105"
                    aria-label={`Télécharger ${doc.title}`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Assistance Guichet Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#184E2A] via-[#2A7B44] to-[#184E2A] border border-[#DAA520]/40 text-center shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left max-w-xl">
            <h4 className="text-xl font-bold text-white mb-1">
              Vous recherchez un formulaire ou un agrément spécifique ?
            </h4>
            <p className="text-sm text-emerald-100/90">
              Le service juridique et de réglementation de l'OCPR est à votre disposition pour vous accompagner dans vos démarches d'exportation.
            </p>
          </div>

          <a
            href="#contact"
            className="btn btn-gold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shrink-0 font-extrabold shadow-lg"
          >
            <span>Faire une demande de document</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

      </div>
    </section>
  );
}

