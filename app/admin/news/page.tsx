'use client';

import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  AlertCircle,
  Calendar,
  Clock,
} from 'lucide-react';

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Institutionnel',
    excerpt: '',
    content: '',
    date: '',
    imageUrl: '',
    readTime: '3 min',
    isPublished: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      setNews(data.news || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(article?: any) {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        slug: article.slug,
        category: article.category || 'Institutionnel',
        excerpt: article.excerpt || '',
        content: article.content || '',
        date: article.date || '',
        imageUrl: article.imageUrl || '',
        readTime: article.readTime || '3 min',
        isPublished: article.isPublished,
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        slug: '',
        category: 'Institutionnel',
        excerpt: '',
        content: '',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        imageUrl: '',
        readTime: '3 min',
        isPublished: true,
      });
    }
    setMessage(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const url = editingArticle ? `/api/admin/news/${editingArticle.id}` : '/api/admin/news';
      const method = editingArticle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur d enregistrement');

      setMessage({
        type: 'success',
        text: editingArticle ? 'Article mis à jour !' : 'Article publié avec succès !',
      });

      fetchNews();
      setTimeout(() => setIsModalOpen(false), 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer définitivement l'article "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec suppression');
      fetchNews();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function togglePublish(article: any) {
    try {
      await fetch(`/api/admin/news/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !article.isPublished }),
      });
      fetchNews();
    } catch (e) {
      console.error(e);
    }
  }

  const filteredNews = news.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Newspaper className="w-6 h-6 text-teal-400" />
            <span>Actualités & Communiqués de Presse</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Publiez les événements officiels, cérémonies et réglementations de l Office Comorien des Produits de Rente
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-950 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publier un Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre d article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* News Articles List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Chargement des actualités...</div>
      ) : filteredNews.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 text-xs">
          Aucun article publié pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((article) => (
            <div
              key={article.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-2.5 py-0.5 bg-teal-950/80 border border-teal-800/60 rounded-md font-semibold text-teal-400">
                    {article.category}
                  </span>
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{article.date}</span>
                  </span>
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{article.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{article.excerpt}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                <button
                  onClick={() => togglePublish(article)}
                  className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl font-medium ${
                    article.isPublished
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {article.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{article.isPublished ? 'En ligne' : 'Masqué'}</span>
                </button>
                <button
                  onClick={() => handleOpenModal(article)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Éditer</span>
                </button>
                <button
                  onClick={() => handleDelete(article.id, article.title)}
                  className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl text-xs font-semibold flex items-center space-x-1 border border-red-800/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Newspaper className="w-5 h-5 text-teal-400" />
                <span>{editingArticle ? 'Modifier l Article' : 'Publier une Nouvelle Actualité'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-center space-x-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950 border border-red-800 text-red-300'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Titre de l Article *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Pose de la première pierre du laboratoire..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Catégorie</label>
                  <input
                    type="text"
                    placeholder="Infrastructure, Événement..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date de Publication</label>
                  <input
                    type="text"
                    placeholder="28 Juillet 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Temps de lecture</label>
                  <input
                    type="text"
                    placeholder="3 min"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Chapeau / Extrait Synthétique</label>
                <textarea
                  rows={2}
                  placeholder="Bref résumé affiché en premier lieu..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Contenu Complet de l Article *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Rédigez ici le texte officiel..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">URL Image de Couverture</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="newsIsPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-teal-500 rounded"
                />
                <label htmlFor="newsIsPublished" className="text-slate-300 font-medium">
                  Publier sur le site public immédiatement
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-teal-950"
                >
                  {saving ? 'Publication...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
