'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  AlertCircle,
  Sparkles,
  Award,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'Pilier Majeur',
    icon: 'Sparkles',
    description: '',
    specs: '',
    isoNorms: '',
    exportDetails: '',
    islands: 'Grande Comore, Anjouan, Mohéli',
    imageUrl: '',
    isPublished: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(product?: any) {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        scientificName: product.scientificName,
        category: product.category,
        icon: product.icon || 'Sparkles',
        description: product.description || '',
        specs: typeof product.specs === 'string' ? product.specs : JSON.stringify(product.specs || {}),
        isoNorms: product.isoNorms || '',
        exportDetails: product.exportDetails || '',
        islands: product.islands || 'Grande Comore, Anjouan, Mohéli',
        imageUrl: product.imageUrl || '',
        isPublished: product.isPublished,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        scientificName: '',
        category: 'Pilier Majeur',
        icon: 'Sparkles',
        description: '',
        specs: '{\n  "TauxDePurete": "99.5%",\n  "Humidite": "30%"\n}',
        isoNorms: 'ISO 5565-1:1999',
        exportDetails: 'Conditionnement sous vide certifié export aérien/maritime.',
        islands: 'Grande Comore, Anjouan, Mohéli',
        imageUrl: '',
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
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erreur lors de l enregistrement');

      setMessage({
        type: 'success',
        text: editingProduct ? 'Produit mis à jour avec succès !' : 'Produit créé avec succès !',
      });

      fetchProducts();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le produit "${name}" ?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec de la suppression');
      fetchProducts();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function togglePublish(product: any) {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !product.isPublished }),
      });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Package className="w-6 h-6 text-emerald-400" />
            <span>Filières & Produits de Rente</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Gérez les fiches techniques des produits d exportation (Vanille Bourbon, Ylang-Ylang, Girofle, etc.)
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Filière</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom ou espèce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-400">Catégorie:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="ALL">Toutes les catégories</option>
            <option value="Pilier Majeur">Pilier Majeur</option>
            <option value="Filière Émergente">Filière Émergente</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Chargement des produits depuis PostgreSQL...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 text-xs">
          Aucun produit ne correspond à votre recherche.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded-lg text-[10px] font-semibold text-emerald-400 uppercase">
                    {p.category}
                  </span>
                  <button
                    onClick={() => togglePublish(p)}
                    title={p.isPublished ? 'Masquer du site public' : 'Publier sur le site public'}
                    className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                      p.isPublished
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{p.isPublished ? 'En ligne' : 'Masqué'}</span>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white mt-3">{p.name}</h3>
                <p className="text-xs text-emerald-400 italic font-mono mt-0.5">{p.scientificName}</p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{p.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center text-slate-400">
                    <Award className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
                    <span className="truncate">Normes: {p.isoNorms}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400 mr-1.5 shrink-0" />
                    <span className="truncate">Îles: {p.islands}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenModal(p)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Éditer</span>
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl text-xs font-semibold flex items-center space-x-1 border border-red-800/50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>{editingProduct ? 'Modifier la Filière' : 'Ajouter une Nouvelle Filière'}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nom du Produit *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Vanille Bourbon des Comores"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nom Scientifique / Botanique *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Vanilla planifolia"
                    value={formData.scientificName}
                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  >
                    <option value="Pilier Majeur">Pilier Majeur</option>
                    <option value="Filière Émergente">Filière Émergente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Normes ISO / Certifications</label>
                  <input
                    type="text"
                    placeholder="ex: ISO 5565-1:1999"
                    value={formData.isoNorms}
                    onChange={(e) => setFormData({ ...formData, isoNorms: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description Synthétique</label>
                <textarea
                  rows={3}
                  placeholder="Caractéristiques principales et valeur ajoutée..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Spécifications Techniques (Format JSON / Texte)</label>
                <textarea
                  rows={3}
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-emerald-400 font-mono text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Détails d Exportation & Conditionnement</label>
                <input
                  type="text"
                  placeholder="ex: Boîtes métalliques sous vide de 10 kg..."
                  value={formData.exportDetails}
                  onChange={(e) => setFormData({ ...formData, exportDetails: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Îles de Production</label>
                  <input
                    type="text"
                    value={formData.islands}
                    onChange={(e) => setFormData({ ...formData, islands: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">URL Image d illustration</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <label htmlFor="isPublished" className="text-slate-300 font-medium">
                  Publier immédiatement sur le site officiel OCPR
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-950 transition-all flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Enregistrer dans PostgreSQL</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
