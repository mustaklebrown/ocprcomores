'use client';

import { Users, Wrench, ShieldCheck, UserCheck, HelpCircle, Server, Factory } from 'lucide-react';

interface Mission {
  id: number;
  title: string;
  description: string;
  icon: any;
  category: string;
}

const missions: Mission[] = [
  {
    id: 1,
    category: 'Lien & Partenariat',
    title: 'Lien entre Acteurs & Pouvoirs Publics',
    description: 'Assurer les liaisons stratégiques entre les professionnels des filières, les pouvoirs publics et les partenaires publics/privés, nationaux et internationaux.',
    icon: Users,
  },
  {
    id: 2,
    category: 'Apport Technique',
    title: 'Expertise & Co-financement',
    description: 'Aider par un apport technique de pointe, son expertise reconnue, ses services d\'accompagnement et sa participation active aux financements des projets.',
    icon: Wrench,
  },
  {
    id: 3,
    category: 'Promotion Sociale',
    title: 'Promotion des Producteurs',
    description: 'Garantir la promotion technique et sociale des agriculteurs et producteurs dans le cadre de la politique nationale de développement agricole.',
    icon: ShieldCheck,
  },
  {
    id: 4,
    category: 'Organisation',
    title: 'Encadrement Professionnel',
    description: 'Appuyer l\'encadrement et la structuration des organisations professionnelles agricoles et coopératives des îles Comores.',
    icon: UserCheck,
  },
  {
    id: 5,
    category: 'Conseil',
    title: 'Appui-Conseils aux Opérateurs',
    description: 'Fournir un suivi personnalisé, des conseils stratégiques et un soutien technique aux opérateurs économiques des filières de rente.',
    icon: HelpCircle,
  },
  {
    id: 6,
    category: 'Services de Base',
    title: 'Services d\'Amélioration du Travail',
    description: 'Assurer la fourniture des services de base d\'appui afin d\'optimiser la productivité et les conditions de travail des acteurs de la chaîne de valeur.',
    icon: Server,
  },
  {
    id: 7,
    category: 'Infrastructures',
    title: 'Infrastructures & Valorisation',
    description: 'Appuyer le développement des infrastructures modernes de conservation, de transformation locale et de valorisation des produits de rente.',
    icon: Factory,
  },
];

export default function MissionsGrid() {
  return (
    <section id="missions" className="section-padding bg-[#184E2A] text-white relative overflow-hidden">
      {/* Glow Effects using logo colors */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2A7B44]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DAA520]/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="section-header text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1E5E33] border border-[#2A7B44] text-[#DAA520] text-xs font-extrabold uppercase tracking-widest mb-5 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A7B44] animate-pulse" />
            <span>Cadre Réglementaire & Stratégique</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight mb-4 drop-shadow-lg">
            Les <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5E4A3] via-[#DAA520] to-[#E7B83A] underline decoration-[#2A7B44] decoration-wavy decoration-2">7 Missions Officielles</span> de l'OCPR
          </h2>

          <div className="h-1.5 w-32 bg-gradient-to-r from-[#2A7B44] via-[#DAA520] to-[#8C2D32] mx-auto mb-6 rounded-full shadow-md" />

          <p className="text-base sm:text-lg font-medium text-emerald-100/95 max-w-3xl mx-auto leading-relaxed">
            L'Office Comorien des Produits de Rente assure un rôle central d'encadrement, d'expertise, de régulation et de soutien au développement économique.
          </p>
        </div>

        {/* Missions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const IconComponent = mission.icon;
            return (
              <div
                key={mission.id}
                className="bg-[#12371F]/90 border border-emerald-500/20 hover:border-[#DAA520]/60 p-7 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#0B2313] text-[#DAA520] border border-[#2A7B44]/40">
                      Mission 0{mission.id}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2A7B44] to-[#184628] text-white flex items-center justify-center shadow-lg group-hover:from-[#DAA520] group-hover:to-[#B8860B] transition-all duration-300">
                      <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#DAA520] uppercase tracking-widest block mb-1">
                    {mission.category}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors">
                    {mission.title}
                  </h3>

                  <p className="text-sm text-emerald-100/70 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-900/60 flex items-center justify-between text-xs text-emerald-300/80 font-medium">
                  <span>Action Publique Comores</span>
                  <span className="group-hover:translate-x-1 transition-transform text-[#DAA520]">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
