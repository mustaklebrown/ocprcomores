'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    async function fetchMe() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.user);
        }
      } catch (e) {
        console.error('Failed to fetch admin info:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [pathname]);

  // If on login page, render full screen without layout sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  }

  const navGroups = [
    {
      title: 'Gestion de Contenu',
      items: [
        { label: "Vue d'ensemble", href: '/admin', icon: LayoutDashboard },
        { label: 'Filières & Produits', href: '/admin/products', icon: Package },
        { label: 'Actualités & Presse', href: '/admin/news', icon: Newspaper },
        { label: 'Documents & Décrets', href: '/admin/documents', icon: FileText },
        { label: 'Médiathèque & Médias', href: '/admin/media', icon: ImageIcon },
      ],
    },
    {
      title: 'Interactions & Système',
      items: [
        { label: 'Messages du Public', href: '/admin/messages', icon: MessageSquare },
        { label: 'Journal de Sécurité', href: '/admin/audit', icon: ShieldAlert },
        { label: 'Paramètres & Configuration', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070D12] text-slate-100 flex flex-col md:flex-row selection:bg-emerald-500 selection:text-white font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#0C151D]/95 backdrop-blur-md border-b border-emerald-950/60 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="flex items-center space-x-2.5">
          <img
            src="/logo-blanc.png"
            alt="OCPR Comores"
            className="h-9 w-auto object-contain"
          />
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors border border-slate-700/50"
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#091219] border-r border-emerald-950/50 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header with Official Main Logo */}
        <div className="p-5 border-b border-emerald-950/40 bg-gradient-to-b from-emerald-950/20 to-transparent">
          <Link href="/admin" className="flex flex-col space-y-2 group">
            <div className="flex items-center justify-between">
              <img
                src="/logo-blanc.png"
                alt="OCPR Comores"
                className="h-12 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
              />
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 shadow-xs">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pl-0.5">
              Portail d'Administration Officiel
            </p>
          </Link>

          {/* System Status Pill */}
          <div className="mt-3.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">Système Actif</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400/90 font-mono text-[10px]">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>MySQL</span>
            </div>
          </div>
        </div>

        {/* Navigation Items grouped */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto custom-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600/90 to-teal-700/80 text-white font-semibold shadow-md shadow-emerald-950/50 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-emerald-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Public Site Quick Link */}
        <div className="p-3 border-t border-emerald-950/30 bg-[#070D12]/50">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-amber-400/90 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 font-medium group transition-all"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Voir le portail public</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Admin User Profile & Logout */}
        <div className="p-3 border-t border-emerald-950/50 bg-[#060B0F] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 border border-emerald-500/40 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-inner">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : <UserCheck className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden text-xs min-w-0">
              <p className="font-semibold text-white truncate text-xs">
                {adminUser?.name || 'Direction OCPR'}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-emerald-400 font-medium">
                  {adminUser?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Déconnexion sécurisée"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-900/40 shrink-0"
            aria-label="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

