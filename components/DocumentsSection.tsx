'use client';

import { useState } from 'react';
import { FileText, Download, ShieldCheck, ExternalLink, Search, CheckCircle2 } from 'lucide-react';

interface DocumentItem {
  id: string | number;
  title: string;
  category: 'Réglementation' | 'Exportation' | 'Formulaire' | 'Rapport' | string;
  description: string;
  fileSize: string;
  fileFormat: string;
  date: string;
  url: string;
}

const defaultDocuments: DocumentItem[] = [
  {
    id: 1,
    title: 'Cadre Réglementaire & Statuts de l\'OCPR',
    category: 'Réglementation',
    description: 'Décret officiel régissant la création, les compétences et les prérogatives de l\'Office Comorien des Produits de Rente.',
    fileSize: '1.2 MB',
    fileFormat: 'PDF',
    date: '2024',
    url: '#',
  },
  {
    id: 2,
    title: 'Guide des Normes de Qualité - Vanille Bourbon',
    category: 'Exportation',
    description: 'Spécifications techniques, taux de vanilline requis et critères d\'emballage pour les lots d\'exportation certifiés.',
    fileSize: '850 KB',
    fileFormat: 'PDF',
    date: '2025',
    url: '#',
  },
  {
    id: 3,
    title: 'Fiche Technique & Protocole d\'Analyse - Ylang-Ylang',
    category: 'Exportation',
    description: 'Normes de distillation et critères de contrôle physico-chimique pour l\'homologation des huiles essentielles.',
    fileSize: '2.1 MB',
    fileFormat: 'PDF',
    date: '2025',
    url: '#',
  },
  {
    id: 4,
    title: 'Formulaire de Demande d\'Agrément d\'Exportateur',
    category: 'Formulaire',
    description: 'Dossier à compléter pour toute demande d\'autorisation et de licence d\'exportation des produits de rente.',
    fileSize: '450 KB',
    fileFormat: 'PDF',
    date: '2025',
    url: '#',
  },
  {
    id: 5,
    title: 'Rapport Annuel sur les Filières de Rente des Comores',
    category: 'Rapport',
    description: 'Bilan statistique de la production, des volumes d\'exportation et de la valeur économique des cultures de rente.',
    fileSize: '3.6 MB',
    fileFormat: 'PDF',
    date: '2024',
    url: '#',
  },
  {
    id: 6,
    title: 'Manuel des Bonnes Pratiques Agricoles pour les Producteurs',
    category: 'Réglementation',
    description: 'Guide technique d\'encadrement et d\'accompagnement sur les méthodes durables de culture et de traitement post-récolte.',
    fileSize: '1.9 MB',
    fileFormat: 'PDF',
    date: '2025',
    url: '#',
  },
];

export default function DocumentsSection() {
  const documents: DocumentItem[] = defaultDocuments;

  return (
    <section id="documents" className="section-padding bg-[#1E5E33] text-white relative overflow-hidden">
      {/* Subtle Background Accent Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2A7B44]/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#DAA520]/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="section-header text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#184E2A] border border-[#2A7B44] text-[#DAA520] text-xs font-extrabold uppercase tracking-widest mb-5 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-[#DAA520]" />
            <span>Ressources Officiellement Certifiées</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight mb-4 drop-shadow-md">
            Documents & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5E4A3] via-[#DAA520] to-[#E7B83A]">Textes Réglementaires</span>
          </h2>

          <div className="h-1.5 w-32 bg-gradient-to-r from-[#2A7B44] via-[#DAA520] to-[#8C2D32] mx-auto mb-6 rounded-full shadow-md" />

          <p className="text-base sm:text-lg font-medium text-emerald-100/95 max-w-3xl mx-auto leading-relaxed">
            Consultez et téléchargez les textes de loi, guides techniques d'exportation, formulaires officiels d'agrément et rapports de l'Office Comorien des Produits de Rente.
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#184E2A] rounded-2xl p-6 border border-[#2A7B44]/60 hover:border-[#DAA520] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                {/* Header Badge & Format */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#2A7B44] text-white border border-emerald-400/30">
                    {doc.category}
                  </span>
                  <span className="text-xs font-bold text-[#DAA520] bg-[#DAA520]/15 px-2.5 py-0.5 rounded border border-[#DAA520]/30">
                    {doc.fileFormat} • {doc.fileSize}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#DAA520] transition-colors leading-snug">
                  {doc.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-emerald-100/80 leading-relaxed mb-6">
                  {doc.description}
                </p>
              </div>

              {/* Action Button & Metadata */}
              <div className="pt-4 border-t border-[#2A7B44]/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-200/70">
                  Mis à jour: {doc.date}
                </span>
                
                <a
                  href={doc.url}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A7B44] hover:bg-[#3EA05D] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md group-hover:bg-[#DAA520] group-hover:text-slate-950"
                  aria-label={`Télécharger ${doc.title}`}
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Guichet d'Assistance Documentaire */}
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
