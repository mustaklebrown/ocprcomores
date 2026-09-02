'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  FileCode,
  FileCheck,
  FolderOpen,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DocumentData {
  id: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  fileName?: string;
  fileSize: string;
  fileFormat: string;
  date: string;
  downloads: number;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentData | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Réglementation',
    description: '',
    fileUrl: '',
    fileName: '',
    fileSize: '1.0 MB',
    fileFormat: 'PDF',
    date: new Date().getFullYear().toString(),
    isPublished: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(doc?: DocumentData) {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title,
        category: doc.category || 'Réglementation',
        description: doc.description || '',
        fileUrl: doc.fileUrl,
        fileName: doc.fileName || '',
        fileSize: doc.fileSize || '1.0 MB',
        fileFormat: doc.fileFormat || 'PDF',
        date: doc.date || new Date().getFullYear().toString(),
        isPublished: doc.isPublished,
      });
    } else {
      setEditingDoc(null);
      setFormData({
        title: '',
        category: 'Réglementation',
        description: '',
        fileUrl: '',
        fileName: '',
        fileSize: '',
        fileFormat: 'PDF',
        date: new Date().getFullYear().toString(),
        isPublished: true,
      });
    }
    setMessage(null);
    setIsModalOpen(true);
  }

  // Handle direct file upload to /api/admin/upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'documents');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du téléversement');

      // Compute friendly file size string
      let sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
      if (file.size >= 1024 * 1024) {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      // Compute format
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';

      setFormData((prev) => ({
        ...prev,
        fileUrl: data.url,
        fileName: file.name,
        fileSize: sizeStr,
        fileFormat: ext,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      }));
    } catch (err: any) {
      alert(err.message || 'Échec du téléversement du document.');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.fileUrl) {
      alert('Veuillez téléverser un fichier ou renseigner une URL.');
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const url = editingDoc ? `/api/admin/documents/${editingDoc.id}` : '/api/admin/documents';
      const method = editingDoc ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'enregistrement");

      setMessage({
        type: 'success',
        text: editingDoc ? 'Document mis à jour !' : 'Document ajouté et disponible au téléchargement !',
      });

      fetchDocuments();
      setTimeout(() => setIsModalOpen(false), 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer définitivement le document "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec suppression');
      fetchDocuments();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function togglePublish(doc: DocumentData) {
    try {
      await fetch(`/api/admin/documents/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !doc.isPublished }),
      });
      fetchDocuments();
    } catch (e) {
      console.error(e);
    }
  }

  const filteredDocs = documents.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const categories = ['ALL', 'Réglementation', 'Exportation', 'Formulaire', 'Rapport', 'Guide'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Documents & Textes Réglementaires</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Téléversez et gérez les décrets, guides d'exportation et formulaires officiels au format PDF ou Word.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un document, décret ou formulaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'Tous' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid / List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Chargement des documents...</div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 text-xs space-y-3">
          <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <p>Aucun document trouvé. Cliquez sur "Ajouter un Document" pour téléverser votre premier PDF.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-md group space-y-4"
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-emerald-950/80 border border-emerald-800/60 rounded-xl text-emerald-400 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800/60 rounded font-semibold text-emerald-300 text-[10px]">
                      {doc.category}
                    </span>
                    <span className="text-slate-400 text-[11px]">Année : {doc.date}</span>
                    <span className="px-1.5 py-0.5 bg-slate-800 text-amber-300 rounded font-mono text-[10px] font-bold">
                      {doc.fileFormat} • {doc.fileSize}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger ({doc.fileFormat})</span>
                </a>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePublish(doc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      doc.isPublished
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {doc.isPublished ? 'En ligne' : 'Masqué'}
                  </button>

                  <button
                    onClick={() => handleOpenModal(doc)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                    title="Éditer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-300 rounded-lg border border-red-800/40"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#091219] border border-emerald-950/60 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>{editingDoc ? 'Modifier le Document' : 'Téléverser un Nouveau Document'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
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

            <form id="doc-form" onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto pr-1">
              {/* File Upload Zone */}
              <div>
                <label className="block text-slate-200 font-semibold mb-1.5">
                  Fichier du Document <span className="text-emerald-400">*</span>
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="p-2.5 bg-emerald-950/50 rounded-xl border border-emerald-800/40 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {uploadingFile ? 'Téléversement en cours...' : 'Cliquez pour sélectionner votre fichier PDF, Word ou Excel'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Enregistré automatiquement dans public/uploads/documents (Max 50 Mo)</p>
                </div>

                {formData.fileUrl && (
                  <div className="mt-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-mono text-[11px] text-emerald-300 truncate">
                        {formData.fileUrl}
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-amber-400 font-mono shrink-0 ml-2">
                      {formData.fileFormat} • {formData.fileSize}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-200 font-semibold mb-1">
                  Titre Officiel du Document <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Guide des Normes d'Exportation de la Vanille Bourbon..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-200 font-semibold mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  >
                    <option value="Réglementation">Réglementation</option>
                    <option value="Exportation">Exportation</option>
                    <option value="Formulaire">Formulaire</option>
                    <option value="Rapport">Rapport</option>
                    <option value="Guide">Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-200 font-semibold mb-1">Format</label>
                  <input
                    type="text"
                    placeholder="PDF, DOCX, XLSX"
                    value={formData.fileFormat}
                    onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 font-semibold mb-1">Année / Date</label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-200 font-semibold mb-1">Description Synthétique</label>
                <textarea
                  rows={2}
                  placeholder="Spécifications, décrets officiels ou indications pour remplir le document..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none leading-relaxed"
                />
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="docIsPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <label htmlFor="docIsPublished" className="text-slate-200 font-medium cursor-pointer">
                  Mettre à disposition du public sur la section Téléchargements
                </label>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl font-semibold text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="doc-form"
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-emerald-950/40"
              >
                {saving ? 'Enregistrement...' : editingDoc ? 'Mettre à Jour' : 'Enregistrer le Document'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
