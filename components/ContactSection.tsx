'use client';

import { useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMessage(data.error || 'Impossible d\'envoyer le message.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Une erreur réseau s\'est produite.');
    }
  };

  return (
    <section id="contact" className="section-padding bg-[#FAF8F3] relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="section-header">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A7B44]/10 border border-[#2A7B44]/30 text-[#2A7B44] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#DAA520]" />
            <span>Disponibilité & Écoute</span>
          </div>
          <h2 className="section-title text-[#12371F]">
            Contactez l'Office (OCPR)
          </h2>
          <p className="section-subtitle">
            Producteurs, exportateurs, partenaires institutionnels ou médias : nous sommes à votre disposition pour toute information ou accompagnement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Contact Cards Info */}

          {/* hjjj */}

          <div className="lg:col-span-5 space-y-6">

            {/* Address Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-500 transition-colors">
              <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Siège Social & Adresse</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Moroni, Petite Coulée<br />
                  Rue Caisse des Retraites des Comores<br />
                  Union des Comores
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-500 transition-colors">
              <div className="p-3.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Adresse Email Officielle</h4>
                <a
                  href="mailto:info@ocprcomores.com"
                  className="text-sm font-semibold text-emerald-700 hover:underline"
                >
                  info@ocprcomores.com
                </a>
                <p className="text-xs text-slate-500 mt-1">Réponse sous 24h à 48h ouvrées</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-500 transition-colors">
              <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Téléphones & Lignes Directes</h4>
                <p className="text-sm font-bold text-slate-800">
                  +269 733 23 18
                </p>
                <p className="text-sm font-bold text-slate-800">
                  +269 499 60 25
                </p>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-[#0B2313] text-white p-6 rounded-2xl border border-[#2A7B44]/40 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-[#DAA520]" />
                <h4 className="font-bold text-sm">Horaires d'Ouverture</h4>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Du Lundi au Jeudi : 07h30 - 15h00<br />
                Vendredi : 07h30 - 11h30 (Jour de prière)<br />
                Samedi & Dimanche : Fermé
              </p>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl">
            <h3 className="text-2xl font-bold text-[#042f24] mb-2 font-heading">
              Envoyez-nous un Message
            </h3>
            <p className="text-sm text-slate-600 mb-8">
              Remplissez le formulaire ci-dessous et nos services reviendront vers vous dans les plus brefs délais.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Votre Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mohamed Ali"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Votre Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: m.ali@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Objet du Message
                </label>
                <input
                  type="text"
                  placeholder="Ex: Demande de renseignement sur la filière Vanille"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Votre Message *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Écrivez votre message ici..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                />
              </div>

              {/* Form Notifications */}
              {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Votre message a bien été transmis à l'OCPR. Merci !</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn btn-primary py-4 text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <span>Envoi en cours...</span>
                ) : (
                  <>
                    <span>Envoyer le Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
