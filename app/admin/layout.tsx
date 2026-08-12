'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Image as ImageIcon,
  MessageSquare,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import OCPRLogo from '@/components/OCPRLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render full screen without layout sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  }

  const navItems = [
    { label: 'Vue d ensemble', href: '/admin', icon: LayoutDashboard },
    { label: 'Filières & Produits', href: '/admin/products', icon: Package },
    { label: 'Actualités & Presse', href: '/admin/news', icon: Newspaper },
    { label: 'Médiathèque (Photos/Vidéos)', href: '/admin/media', icon: ImageIcon },
    { label: 'Messages du Public', href: '/admin/messages', icon: MessageSquare },
    { label: 'Journal de Sécurité (Audit)', href: '/admin/audit', icon: ShieldAlert },
    { label: 'Paramètres & Sécurité', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-emerald-500 selection:text-white">
      {/* Mobile Top Navbar */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <OCPRLogo className="h-8 w-auto" />
          <span className="font-bold text-sm tracking-tight text-white">OCPR Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-800 rounded-xl text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Logo & Header */}
        <div className="p-6 border-b border-slate-800/80 flex flex-col">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
              <OCPRLogo className="h-9 w-auto" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight">OCPR Comores</h2>
              <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">
                <ShieldCheck className="w-3 h-3" />
                <span>Next API & Postgres</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Site Quick Link */}
        <div className="p-4 px-6 border-t border-slate-800/80 bg-slate-950/40">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-amber-400 hover:text-amber-300 font-medium group transition-colors"
          >
            <span>Voir le site public</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Admin User Footer Badge & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden text-xs">
              <p className="font-semibold text-white truncate">
                {adminUser?.name || 'Administrateur'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {adminUser?.email || 'admin@ocprcomores.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Déconnexion sécurisée"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors ml-2"
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
