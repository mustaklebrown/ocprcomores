'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, ShieldCheck, Clock, User, HardDrive } from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  async function fetchAuditLogs() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      setLogs(data.auditLogs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.ipAddress && l.ipAddress.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <span>Journal d Audit de Sécurité (Traçabilité)</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Historique inaltérable de toutes les opérations d administration, connexions et modifications
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par action, email ou adresse IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">Chargement du journal d audit...</div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 text-xs">
          Aucun événement d audit correspondant.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Action</th>
                  <th className="p-4">Détails de l Opération</th>
                  <th className="p-4">Administrateur</th>
                  <th className="p-4">Adresse IP</th>
                  <th className="p-4">Horodatage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-4 font-mono font-bold">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] ${
                          log.action.includes('SUCCESS') || log.action.includes('CREATE')
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : log.action.includes('FAILED') || log.action.includes('DELETE')
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-blue-950 text-blue-400 border border-blue-800'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        <span>{log.action}</span>
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-200">{log.details}</td>
                    <td className="p-4 text-slate-400">{log.adminEmail}</td>
                    <td className="p-4 font-mono text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
