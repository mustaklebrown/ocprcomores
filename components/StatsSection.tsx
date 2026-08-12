'use client';

import { Sprout, Award, Users, Globe2, Landmark, CheckCircle } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      id: 1,
      number: '+15 000',
      label: 'Producteurs & Agriculteurs Accompagnés',
      subtext: 'Sur les 3 îles (Grande Comore, Anjouan, Mohéli)',
      icon: Users,
      color: 'from-emerald-500 to-emerald-700',
    },
    {
      id: 2,
      number: '3 Piliers',
      label: 'Filières d\'Exportation Majeures',
      subtext: 'Vanille Bourbon, Girofle & Ylang-Ylang',
      icon: Award,
      color: 'from-amber-500 to-amber-700',
    },
    {
      id: 3,
      number: '7 Missions',
      label: 'Missions Institutionnelles',
      subtext: 'Encadrement, qualité, financement & promotion',
      icon: Landmark,
      color: 'from-emerald-600 to-teal-800',
    },
    {
      id: 4,
      number: '100%',
      label: 'Engagement Qualité & Origine',
      subtext: 'Contrôle et traçabilité pour l\'exportation',
      icon: CheckCircle,
      color: 'from-amber-600 to-yellow-600',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#184E2A] via-[#1E5E33] to-[#184E2A] text-white relative border-y border-[#2A7B44]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-[#12371F]/90 border border-emerald-500/30 rounded-2xl p-6 hover:border-[#DAA520]/60 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-[#2A7B44] to-[#184628] text-white shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DAA520]">
                      Union des Comores
                    </span>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-extrabold text-[#DAA520] font-heading mb-1">
                    {stat.number}
                  </h3>

                  <h4 className="text-sm font-bold text-white mb-2">
                    {stat.label}
                  </h4>

                  <p className="text-xs text-emerald-200/80 leading-relaxed">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
