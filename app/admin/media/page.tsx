'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Plus, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Vanille',
    type: 'PHOTO',
    url: '',
    description: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setMediaList(data.media || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l ajout');

      setMessage({ type: 'success', text: 'Média ajouté à la bibliothèque avec succès !' });
      fetchMedia();
      setTimeout(() => setIsModalOpen(false), 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer le média "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec suppression');
      fetchMedia();
    } catch (e: any) {
      alert(e.message);
    }
  }

  const filteredMedia = mediaList.filter((m) => filterType === 'ALL' || m.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            <span>Médiathèque Officielle</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Galerie de photos et reportages vidéo des cultures, récoltes et laboratoires OCPR
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ title: '', category: 'Vanille', type: 'PHOTO', url: '', description: '' });
            setMessage(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-950 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Média</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'ALL' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Tout ({mediaList.length})
        </button>
        <button
          onClick={() => setFilterType('PHOTO')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'PHOTO' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Photos ({mediaList.filter((m) => m.type === 'PHOTO').length})
        </button>
        <button
          onClick={() => setFilterType('VIDEO')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'VIDEO' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Vidéos ({mediaList.filter((m) => m.type === 'VIDEO').length})
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Chargement des médias...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 text-xs">
          Aucun média enregistré dans cette catégorie.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group">
              <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                {m.type === 'PHOTO' ? (
                  <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-amber-400 p-4 text-center space-y-2">
                    <Video className="w-10 h-10" />
                    <span className="text-[11px] font-mono text-slate-400 truncate max-w-full">{m.url}</span>
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-400 border border-slate-800">
                  {m.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white text-sm line-clamp-1">{m.title}</h3>
                {m.description && <p className="text-slate-400 text-xs line-clamp-2">{m.description}</p>}

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleDelete(m.id, m.title)}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl text-xs font-semibold flex items-center space-x-1 border border-red-800/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span>Ajouter un Média</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded-2xl text-xs flex items-center space-x-2 ${
                  message.type === 'success' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Titre du Média *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Récolte de la Vanille..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Type de Média</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  >
                    <option value="PHOTO">Photo</option>
                    <option value="VIDEO">Vidéo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Filière / Catégorie</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">URL de l Image ou de la Vidéo *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... ou https://youtube.com/..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description (optionnelle)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-lg"
                >
                  {saving ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
