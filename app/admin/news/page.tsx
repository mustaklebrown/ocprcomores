'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  Image as ImageIcon,
  Heading,
  Quote,
  List,
  Bold,
  Italic,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & Tab State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [editingArticle, setEditingArticle] = useState<any>(null);

  // Upload States
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

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
        date: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        imageUrl: '',
        readTime: '3 min',
        isPublished: true,
      });
    }
    setActiveTab('edit');
    setMessage(null);
    setIsModalOpen(true);
  }

  // Handle Cover Image Upload
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du téléversement');

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err: any) {
      alert(err.message || 'Échec du téléversement de l image de couverture.');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }

  // Handle In-Content Image Upload & Insert
  async function handleInlineImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingInline(true);
    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du téléversement');

      const imageTag = `\n\n![${file.name.replace(/\.[^/.]+$/, '')}](${data.url})\n\n`;
      insertFormatting(imageTag, '');
    } catch (err: any) {
      alert(err.message || "Échec de l'insertion de l'image dans le contenu.");
    } finally {
      setUploadingInline(false);
      if (inlineInputRef.current) inlineInputRef.current.value = '';
    }
  }

  // Helper to insert formatting at textarea cursor position
  function insertFormatting(prefix: string, suffix: string = '') {
    const textarea = contentTextareaRef.current;
    if (!textarea) {
      setFormData((prev) => ({ ...prev, content: prev.content + prefix + suffix }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = formData.content;
    const selectedText = current.substring(start, end);

    const replacement = prefix + (selectedText || 'texte') + suffix;
    const newContent = current.substring(0, start) + replacement + current.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 5)
      );
    }, 50);
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
      if (!res.ok) throw new Error(data.error || "Erreur d'enregistrement");

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
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <Newspaper className="w-6 h-6 text-emerald-400" />
            <span>Actualités & Blog Officiel</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Gérez les publications officielles, cérémonies et téléversez directement vos photos d'illustration.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Rédiger un Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre ou mot-clé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
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
              className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500/30 transition-all shadow-md group"
            >
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                {article.imageUrl && (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-800/60 rounded-md font-semibold text-emerald-300 text-[10px]">
                      {article.category}
                    </span>
                    <span className="text-slate-400 flex items-center space-x-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      <span>{article.date}</span>
                    </span>
                    <span className="text-slate-400 flex items-center space-x-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight truncate">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                <button
                  onClick={() => togglePublish(article)}
                  className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    article.isPublished
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
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
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900 text-red-300 rounded-xl text-xs font-semibold flex items-center space-x-1 border border-red-800/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#091219] border border-emerald-950/60 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Newspaper className="w-5 h-5 text-emerald-400" />
                  <span>{editingArticle ? "Modifier l'Article" : 'Rédiger une Nouvelle Actualité'}</span>
                </h3>
                <p className="text-xs text-slate-400">Éditeur professionnel avec téléversement direct</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'edit'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Édition & Rédaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'preview'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Aperçu Typographique
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-center space-x-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950 border border-red-800 text-red-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pr-1">
              {activeTab === 'edit' ? (
                <form id="news-form" onSubmit={handleSubmit} className="space-y-5 text-xs">
                  {/* Article Title */}
                  <div>
                    <label className="block text-slate-200 font-semibold mb-1">
                      Titre de l'Article <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Lancement de la récolte de Vanille Bourbon 2026..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none text-sm font-medium"
                    />
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-200 font-semibold mb-1">Catégorie</label>
                      <input
                        type="text"
                        placeholder="Filières Agricoles, Événement..."
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-200 font-semibold mb-1">Date affichée</label>
                      <input
                        type="text"
                        placeholder="28 Août 2026"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-200 font-semibold mb-1">Temps de lecture</label>
                      <input
                        type="text"
                        placeholder="3 min"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Cover Image Upload Area */}
                  <div>
                    <label className="block text-slate-200 font-semibold mb-1.5">
                      Image Principale (Couverture)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Drag and Drop / File Input */}
                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className="p-4 border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
                      >
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="hidden"
                        />
                        <div className="p-2.5 bg-emerald-950/50 rounded-xl border border-emerald-800/40 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-200">
                          {uploadingCover ? 'Téléversement en cours...' : 'Téléverser une image de couverture'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP jusqu'à 15 Mo</p>
                      </div>

                      {/* Image Preview & URL Fallback */}
                      <div className="flex flex-col justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                        {formData.imageUrl ? (
                          <div className="relative h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-2 group">
                            <img
                              src={formData.imageUrl}
                              alt="Aperçu couverture"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, imageUrl: '' })}
                              className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 hover:bg-red-950 text-white transition-colors"
                              title="Supprimer l'image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-24 rounded-xl border border-slate-900 bg-slate-900/40 flex items-center justify-center text-slate-600 text-xs mb-2">
                            Aucune image sélectionnée
                          </div>
                        )}

                        <div className="flex gap-1.5 mt-1">
                          <input
                            type="text"
                            placeholder="Ou collez une URL (https://...)"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 outline-none"
                          />
                          {formData.imageUrl && formData.imageUrl.startsWith('http') && (
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/admin/upload', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ url: formData.imageUrl }),
                                  });
                                  const data = await res.json();
                                  if (!res.ok) throw new Error(data.error);
                                  setFormData((prev) => ({ ...prev, imageUrl: data.url }));
                                } catch (err: any) {
                                  alert(err.message || "Échec de l'importation de l'image");
                                }
                              }}
                              className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 rounded-lg text-[10px] font-semibold shrink-0 transition-colors"
                              title="Télécharger l'image de cette URL et la sauvegarder dans public/uploads/images"
                            >
                              📥 Importer dans uploads
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary / Chapeau */}
                  <div>
                    <label className="block text-slate-200 font-semibold mb-1">
                      Chapeau / Résumé de presse (Mise en exergue)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Texte introductif qui sera affiché en caractères gras et dans le flux d'actualités..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none leading-relaxed"
                    />
                  </div>

                  {/* Content Editor with Dedicated Typography Toolbar */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <label className="text-slate-200 font-semibold">
                        Corps de l'Article <span className="text-emerald-400">*</span>
                      </label>

                      {/* Editorial Formatting Toolbar */}
                      <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => insertFormatting('## ', '')}
                          className="px-2 py-1 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded text-[11px] font-bold flex items-center gap-1"
                          title="Titre de section H2"
                        >
                          <Heading className="w-3.5 h-3.5" />
                          <span>H2</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('### ', '')}
                          className="px-2 py-1 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded text-[11px] font-bold flex items-center gap-1"
                          title="Sous-titre H3"
                        >
                          <Heading className="w-3 h-3" />
                          <span>H3</span>
                        </button>
                        <span className="w-px h-3.5 bg-slate-800 mx-0.5" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('> « ', ' »')}
                          className="p-1 hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded"
                          title="Citation officielle"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('- ', '')}
                          className="p-1 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded"
                          title="Liste à puces"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-px h-3.5 bg-slate-800 mx-0.5" />
                        
                        {/* Inline Image Upload Trigger */}
                        <input
                          ref={inlineInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleInlineImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => inlineInputRef.current?.click()}
                          className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                          title="Téléverser et insérer une photo directement dans le texte"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{uploadingInline ? 'Insertion...' : '+ Insérer Image'}</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      ref={contentTextareaRef}
                      rows={8}
                      required
                      placeholder="Rédigez le texte officiel. Utilisez la barre d'outils ci-dessus pour insérer des photos, titres ou citations..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-3 text-white outline-none font-mono text-xs leading-relaxed"
                    />
                  </div>

                  {/* Published Checkbox */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="newsIsPublished"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <label htmlFor="newsIsPublished" className="text-slate-200 font-medium cursor-pointer">
                      Publier immédiatement sur le portail public
                    </label>
                  </div>
                </form>
              ) : (
                /* Typography Preview Tab */
                <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto shadow-inner">
                  {formData.imageUrl && (
                    <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-md">
                      <img
                        src={formData.imageUrl}
                        alt="Couverture"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-emerald-900 text-amber-300 font-bold px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                        {formData.category}
                      </span>
                      <span className="text-slate-500">{formData.date}</span>
                      <span className="text-slate-400">• {formData.readTime}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-[#12371F] font-heading leading-tight">
                      {formData.title || 'Titre de l article en prévisualisation'}
                    </h2>
                  </div>

                  {formData.excerpt && (
                    <div className="p-4 rounded-xl bg-emerald-50 border-l-4 border-[#184E2A] text-[#12371F] font-semibold text-sm leading-relaxed">
                      {formData.excerpt}
                    </div>
                  )}

                  <div className="space-y-3 text-slate-700 leading-relaxed text-sm">
                    {formData.content ? (
                      formData.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <div key={i} className="h-2" />;
                        if (trimmed.startsWith('## ')) {
                          return (
                            <h3 key={i} className="text-lg font-bold text-[#12371F] font-heading pt-2">
                              {trimmed.replace('## ', '')}
                            </h3>
                          );
                        }
                        if (trimmed.startsWith('### ')) {
                          return (
                            <h4 key={i} className="text-base font-bold text-emerald-900 pt-1">
                              {trimmed.replace('### ', '')}
                            </h4>
                          );
                        }
                        if (trimmed.startsWith('> ')) {
                          return (
                            <blockquote key={i} className="p-3 bg-emerald-50/60 border-l-4 border-amber-500 italic text-emerald-950 font-serif">
                              {trimmed.replace('> ', '')}
                            </blockquote>
                          );
                        }
                        if (trimmed.startsWith('- ')) {
                          return (
                            <div key={i} className="flex items-start gap-2 pl-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                              <span>{trimmed.substring(2)}</span>
                            </div>
                          );
                        }
                        const img = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                        if (img) {
                          return (
                            <figure key={i} className="my-4">
                              <img src={img[2]} alt={img[1]} className="rounded-xl shadow w-full max-h-72 object-cover" />
                              {img[1] && <figcaption className="text-center text-xs text-slate-400 mt-1 italic">📷 {img[1]}</figcaption>}
                            </figure>
                          );
                        }
                        return <p key={i}>{line}</p>;
                      })
                    ) : (
                      <p className="text-slate-400 italic">Rédigez du contenu pour voir l'aperçu...</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {activeTab === 'edit' ? 'Cliquez sur Enregistrer pour publier.' : 'Mode aperçu en direct.'}
              </span>

              <div className="flex items-center space-x-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl font-semibold text-xs transition-colors"
                >
                  Fermer
                </button>
                {activeTab === 'edit' && (
                  <button
                    type="submit"
                    form="news-form"
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center space-x-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>{editingArticle ? 'Mettre à Jour' : 'Publier l Article'}</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

