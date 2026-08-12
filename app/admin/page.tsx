'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Newspaper,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Server,
  Database,
  Plus,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productsCount: 0,
    newsCount: 0,
    mediaCount: 0,
    messagesCount: 0,
    unreadMessages: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [prodRes, newsRes, mediaRes, msgRes, auditRes] = await Promise.all([
          fetch('/api/admin/products').then((r) => r.json()).catch(() => ({ products: [] })),
          fetch('/api/admin/news').then((r) => r.json()).catch(() => ({ news: [] })),
          fetch('/api/admin/media').then((r) => r.json()).catch(() => ({ media: [] })),
          fetch('/api/admin/messages').then((r) => r.json()).catch(() => ({ messages: [] })),
          fetch('/api/admin/audit-logs').then((r) => r.json()).catch(() => ({ auditLogs: [] })),
        ]);

        const products = prodRes.products || [];
        const news = newsRes.news || [];
        const media = mediaRes.media || [];
        const messages = msgRes.messages || [];
        const unread = messages.filter((m: any) => m.status === 'UNREAD').length;

        setStats({
          productsCount: products.length,
          newsCount: news.length,
          mediaCount: media.length,
          messagesCount: messages.length,
          unreadMessages: unread,
        });

        setRecentLogs((auditRes.auditLogs || []).slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Système d Administration Sécurisé</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Tableau de Bord OCPR Comores
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
              Gestion centralisée des filières agricoles (Vanille, Ylang-Ylang, Girofle), des actualités officielles, de la médiathèque et des demandes de contact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Produit</span>
            </Link>
            <Link
              href="/admin/news"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Publier Actualité</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Filières & Produits</span>
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{loading ? '...' : stats.productsCount}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Produits de rente enregistrés</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/products" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center space-x-1">
              <span>Gérer les fiches</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric 2: News */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-teal-500/50 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Actualités & Presse</span>
            <div className="p-3 bg-teal-950/60 border border-teal-800/50 rounded-2xl text-teal-400">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{loading ? '...' : stats.newsCount}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Articles publiés sur le site</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/news" className="text-xs font-semibold text-teal-400 hover:underline flex items-center space-x-1">
              <span>Voir les articles</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Media */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Médiathèque</span>
            <div className="p-3 bg-amber-950/60 border border-amber-800/50 rounded-2xl text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{loading ? '...' : stats.mediaCount}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Photos & Vidéos galerie</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/media" className="text-xs font-semibold text-amber-400 hover:underline flex items-center space-x-1">
              <span>Gérer la galerie</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric 4: Messages */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Messages Publics</span>
            <div className="p-3 bg-blue-950/60 border border-blue-800/50 rounded-2xl text-blue-400 relative">
              <MessageSquare className="w-5 h-5" />
              {stats.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {stats.unreadMessages}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{loading ? '...' : stats.messagesCount}</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats.unreadMessages > 0 ? (
                <span className="text-red-400 font-semibold">{stats.unreadMessages} message(s) non lu(s)</span>
              ) : (
                'Tous les messages sont lus'
              )}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <Link href="/admin/messages" className="text-xs font-semibold text-blue-400 hover:underline flex items-center space-x-1">
              <span>Ouvrir la boîte</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Security Status & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Security Audit Activity Log */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Journal d Audit de Sécurité Récent</span>
              </h2>
              <p className="text-xs text-slate-400">Traçabilité des actions administratives en temps réel</p>
            </div>
            <Link href="/admin/audit" className="text-xs text-emerald-400 font-medium hover:underline">
              Tout afficher →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Chargement de l audit...</div>
          ) : recentLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">Aucune activité enregistrée récemment.</div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {recentLogs.map((log: any) => (
                <div key={log.id} className="py-3.5 flex items-start justify-between space-x-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 p-1.5 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{log.action}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-500 mt-1">
                        <span>Par: {log.adminEmail}</span>
                        <span>•</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Hostinger & Security Health Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>État du Système & Hébergement</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Configuration recommandée pour Hostinger</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-white">Base de Données PostgreSQL</p>
                  <p className="text-[10px] text-slate-400">Prisma ORM & Requêtes paramétrées</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
                Actif
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <div>
                  <p className="font-semibold text-white">Authentification JWT</p>
                  <p className="text-[10px] text-slate-400">Cookie HttpOnly + SameSite=Strict</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-teal-950 text-teal-400 border border-teal-800 text-[10px] font-semibold">
                Sécurisé
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="font-semibold text-white">En-têtes Sécurité HTTP</p>
                  <p className="text-[10px] text-slate-400">HSTS, CSP, X-Frame-Options</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-semibold">
                Opérationnel
              </span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-800/40 rounded-2xl text-xs space-y-2">
            <h4 className="font-bold text-emerald-300">Prêt pour l Hébergement Hostinger</h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Ce projet est compilé en mode <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400">standalone</code> sans dépendances CMS ni CDN externes. Il s exécute directement sur un VPS ou hébergement Node.js Hostinger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
