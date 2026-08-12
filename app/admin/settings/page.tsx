'use client';

import React, { useState } from 'react';
import { Settings, Lock, CheckCircle2, AlertCircle, ShieldCheck, Key, Server } from 'lucide-react';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de la modification');

      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Paramètres de Sécurité Administrateur</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Gérez votre mot de passe et inspectez les paramètres de sécurité du serveur OCPR Comores
        </p>
      </div>

      {/* Password Change Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Changer le Mot de Passe Administrateur</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Le mot de passe sera immédiatement chiffré avec l algorithme bcrypt (12 rounds)
          </p>
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

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Mot de Passe Actuel *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Nouveau Mot de Passe (min. 8 caractères) *</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Confirmer le Nouveau Mot de Passe *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950 transition-all"
          >
            {loading ? 'Mise à jour...' : 'Mettre à Jour le Mot de Passe'}
          </button>
        </form>
      </div>

      {/* Security Checklist for Hostinger Deployment */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Server className="w-4 h-4 text-amber-400" />
            <span>Checklist Sécurité & Variables d Environnement (Hostinger)</span>
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <p className="font-bold text-white font-mono">DATABASE_URL</p>
            <p className="text-slate-400">
              Chaîne de connexion PostgreSQL sur Hostinger (ex: <code className="text-emerald-400">postgresql://user:password@localhost:5432/ocpr_db</code>).
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <p className="font-bold text-white font-mono">JWT_SECRET</p>
            <p className="text-slate-400">Clé secrète de signature des jetons de session JWT.</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <p className="font-bold text-white font-mono">ADMIN_DEFAULT_PASSWORD</p>
            <p className="text-slate-400">Mot de passe initial pour l administrateur lors de l exécution de la graine (<code className="text-emerald-400">prisma db seed</code>).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
