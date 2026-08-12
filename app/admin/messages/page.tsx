'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  CheckCircle2,
  Trash2,
  Clock,
  User,
  X,
  Search,
  Filter,
} from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UNREAD' | 'READ' | 'REPLIED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Échec mise à jour statut');
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer le message de "${name}" ?`)) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Échec suppression');
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (e: any) {
      alert(e.message);
    }
  }

  const filteredMessages = messages.filter((m) => {
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            <span>Boîte de Réception Demandes & Contact</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Demandes transmises par les visiteurs, acheteurs et coopératives via le site officiel
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Filtrer:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="ALL">Tous les messages ({messages.length})</option>
            <option value="UNREAD">Non lus ({messages.filter((m) => m.status === 'UNREAD').length})</option>
            <option value="READ">Lus</option>
            <option value="REPLIED">Répondus</option>
          </select>
        </div>
      </div>

      {/* Messages List Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Messages Feed */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 max-h-[75vh] overflow-y-auto">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher expéditeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Chargement des messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">Aucun message trouvé.</div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'UNREAD') {
                    updateStatus(msg.id, 'READ');
                  }
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  selectedMessage?.id === msg.id
                    ? 'bg-slate-800 border-blue-500 shadow-md'
                    : msg.status === 'UNREAD'
                    ? 'bg-slate-950 border-blue-800/80'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white truncate max-w-[160px]">{msg.name}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      msg.status === 'UNREAD'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : msg.status === 'REPLIED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {msg.status === 'UNREAD' ? 'Nouveau' : msg.status === 'REPLIED' ? 'Répondu' : 'Lu'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-200 truncate">{msg.subject}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{msg.message}</p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate">{msg.email}</span>
                  <span>{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Message Detail Drawer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[500px]">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{selectedMessage.subject}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-semibold text-slate-200">{selectedMessage.name}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-amber-400 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </span>
                    {selectedMessage.phone && (
                      <>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{selectedMessage.phone}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateStatus(selectedMessage.id, 'REPLIED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marquer Répondu</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                    className="p-2 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl border border-red-800/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              {/* Sender & Metadata footer */}
              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 text-xs text-slate-400 space-y-1">
                <p>Date de réception: {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</p>
                <p>Adresse IP d origine: {selectedMessage.ipAddress || 'Non spécifiée'}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs space-y-3 py-20">
              <MessageSquare className="w-12 h-12 text-slate-700" />
              <p>Sélectionnez un message dans la liste de gauche pour lire les détails.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
