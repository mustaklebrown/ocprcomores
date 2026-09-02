'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  Upload,
  ExternalLink,
  Film,
  Play,
} from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Vanille',
    type: 'PHOTO',
    url: '',
    description: '',
    isPublished: true,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      console.error('Erreur chargement médias:', e);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingMedia(null);
    setFormData({
      title: '',
      category: 'Vanille',
      type: 'PHOTO',
      url: '',
      description: '',
      isPublished: true,
    });
    setMessage(null);
    setIsModalOpen(true);
  }

  function openEditModal(media: any) {
    setEditingMedia(media);
    setFormData({
      title: media.title || '',
      category: media.category || 'Vanille',
      type: media.type || 'PHOTO',
      url: media.url || '',
      description: media.description || '',
      isPublished: media.isPublished !== undefined ? media.isPublished : true,
    });
    setMessage(null);
    setIsModalOpen(true);
  }

  async function handleTogglePublished(media: any) {
    const newStatus = !media.isPublished;
    try {
      const res = await fetch(`/api/admin/media/${media.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...media,
          isPublished: newStatus,
        }),
      });
      if (!res.ok) throw new Error('Échec de la mise à jour du statut');
      fetchMedia();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, isVideo = false) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', isVideo ? 'videos' : 'images');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du téléversement');

      setFormData((prev) => ({
        ...prev,
        url: data.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      }));
    } catch (err: any) {
      alert(err.message || 'Échec du téléversement');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const isEditing = Boolean(editingMedia?.id);
      const endpoint = isEditing ? `/api/admin/media/${editingMedia.id}` : '/api/admin/media';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l’enregistrement');

      setMessage({
        type: 'success',
        text: isEditing ? 'Média modifié avec succès !' : 'Média ajouté à la bibliothèque avec succès !',
      });
      fetchMedia();
      setTimeout(() => setIsModalOpen(false), 900);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le média "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec de la suppression');
      fetchMedia();
    } catch (e: any) {
      alert(e.message);
    }
  }

  function isLocalOrDirectVideo(url: string) {
    if (!url) return false;
    return (
      url.startsWith('/uploads/videos') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      url.endsWith('.ogg') ||
      url.includes('.mp4?') ||
      url.includes('.webm?')
    );
  }

  // Extract unique categories
  const categories = Array.from(new Set(mediaList.map((m) => m.category || 'Général'))).filter(Boolean);

  // Filtered media list
  const filteredMedia = mediaList.filter((m) => {
    const matchesType = filterType === 'ALL' || m.type === filterType;
    const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span>Médiathèque & Vidéothèque</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5">
            Gérez, téléversez et éditez vos photos et vidéos locales ou distantes (YouTube / MP4).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-950/60 transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Média</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        {/* Type Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 shrink-0">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tout ({mediaList.length})
          </button>
          <button
            onClick={() => setFilterType('PHOTO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'PHOTO'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Photos ({mediaList.filter((m) => m.type === 'PHOTO').length})
          </button>
          <button
            onClick={() => setFilterType('VIDEO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'VIDEO'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vidéos ({mediaList.filter((m) => m.type === 'VIDEO').length})
          </button>
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-wrap items-center gap-2 flex-1 md:justify-end">
          {/* Category Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500"
            >
              <option value="ALL">Toutes les filières</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un média..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 outline-none focus:border-amber-500 placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Chargement des médias en cours...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl text-slate-400 text-xs space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-300">Aucun média trouvé</p>
          <p className="text-slate-500">Ajustez vos filtres de recherche ou ajoutez un nouveau média.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((m) => {
            const isLocalVid = isLocalOrDirectVideo(m.url);
            return (
              <div
                key={m.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700/80 transition-all flex flex-col group"
              >
                {/* Media Thumbnail / Video Container */}
                <div className="h-48 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  {m.type === 'PHOTO' ? (
                    <img
                      src={m.url}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : isLocalVid ? (
                    <div className="w-full h-full bg-black relative flex items-center justify-center group/vid">
                      <video
                        src={m.url}
                        controls
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-amber-400 p-4 text-center space-y-2 bg-gradient-to-b from-slate-900 to-slate-950 w-full h-full">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Video className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 truncate max-w-full px-4">{m.url}</span>
                    </div>
                  )}

                  {/* Badges Top Left & Right */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5 pointer-events-none z-10">
                    <span className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-400 border border-amber-500/30 shadow-md">
                      {m.category}
                    </span>
                    <span className="bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-300 border border-slate-800">
                      {m.type === 'PHOTO' ? 'Photo' : isLocalVid ? 'Vidéo Locale' : 'Vidéo Embed'}
                    </span>
                  </div>

                  {/* Published Status Badge */}
                  <button
                    onClick={() => handleTogglePublished(m)}
                    title={m.isPublished ? 'Cliquer pour masquer du site' : 'Cliquer pour publier sur le site'}
                    className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-md flex items-center space-x-1 border transition-all z-10 ${
                      m.isPublished
                        ? 'bg-emerald-950/90 text-emerald-400 border-emerald-700/60 hover:bg-emerald-900'
                        : 'bg-slate-950/90 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {m.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{m.isPublished ? 'En Ligne' : 'Masqué'}</span>
                  </button>
                </div>

                {/* Media Info Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {m.description || 'Aucune description spécifique fournie.'}
                    </p>
                  </div>

                  {/* Action Buttons: Edit & Delete */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString('fr-FR') : ''}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(m)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-700/60 transition-colors"
                        title="Modifier ce média"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => handleDelete(m.id, m.title)}
                        className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-red-800/50 transition-colors"
                        title="Supprimer ce média"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  {editingMedia ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <span>{editingMedia ? 'Modifier le Média' : 'Ajouter un Média à la Médiathèque'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Feedback Message */}
            {message && (
              <div
                className={`p-3 rounded-2xl text-xs flex items-center space-x-2 ${
                  message.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Titre du Média *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Récolte traditionnelle de la Vanille à Mohéli..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Type de Média</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none text-xs"
                  >
                    <option value="PHOTO">Photo (Image)</option>
                    <option value="VIDEO">Vidéo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Filière / Thématique</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Vanille, Girofle, Ylang-Ylang..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none text-xs"
                  />
                </div>
              </div>

              {/* Upload Zone (Photos & Videos directly from machine) */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  {formData.type === 'PHOTO' ? 'Fichier Photo (depuis votre machine)' : 'Fichier Vidéo (depuis votre machine)'}
                </label>

                {formData.type === 'PHOTO' ? (
                  <div className="mb-2">
                    <label className="p-3.5 border-2 border-dashed border-slate-800 hover:border-amber-500/60 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, false)}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-2 text-slate-300 group-hover:text-amber-400 font-medium">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>{uploading ? 'Téléversement en cours...' : '📁 Choisir une photo sur votre ordinateur'}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5">Enregistré dans public/uploads/images (JPG, PNG, WEBP)</span>
                    </label>
                  </div>
                ) : (
                  <div className="mb-2">
                    <label className="p-4 border-2 border-dashed border-amber-500/30 hover:border-amber-500/70 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.ogv,.m4v"
                        onChange={(e) => handleFileUpload(e, true)}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-2 text-slate-200 group-hover:text-amber-400 font-semibold">
                        <Film className="w-5 h-5 text-amber-400" />
                        <span>{uploading ? 'Téléversement de la vidéo en cours...' : '🎬 Choisir un fichier vidéo sur votre ordinateur'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">
                        Formats pris en charge : <strong>MP4, WebM, MOV, OGG</strong> (sauvegardé dans public/uploads/videos)
                      </span>
                    </label>
                  </div>
                )}

                {/* Alternative URL Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-400 font-medium">
                    Ou saisissez une URL directe (Lien Web ou Embed YouTube / Vimeo)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      formData.type === 'PHOTO'
                        ? '/uploads/images/... ou https://images.unsplash.com/...'
                        : '/uploads/videos/... ou https://www.youtube.com/embed/...'
                    }
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none text-xs font-mono"
                  />
                </div>

                {/* Live Preview in Modal */}
                {formData.url && (
                  <div className="mt-3">
                    {formData.type === 'PHOTO' ? (
                      <div className="relative h-28 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={formData.url} alt="Aperçu Photo" className="w-full h-full object-cover" />
                      </div>
                    ) : isLocalOrDirectVideo(formData.url) ? (
                      <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800">
                        <video src={formData.url} controls className="w-full h-36 object-contain bg-black" />
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-2 text-slate-300 text-xs">
                        <Video className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate font-mono text-[11px]">{formData.url}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description (optionnelle)</label>
                <textarea
                  rows={2}
                  placeholder="Précisions sur le média, le lieu ou les acteurs..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white outline-none text-xs"
                />
              </div>

              {/* Publication Status Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-semibold text-white text-xs">Visibilité publique</p>
                  <p className="text-[10px] text-slate-400">Afficher ce média dans la galerie du portail public</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    formData.isPublished ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      formData.isPublished ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-semibold shadow-lg shadow-amber-950/60 transition-all"
                >
                  {saving ? 'Enregistrement...' : editingMedia ? 'Enregistrer les Modifications' : 'Ajouter le Média'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
