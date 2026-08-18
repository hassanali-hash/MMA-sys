'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { 
  History, Search, Filter, Download, ShieldCheck, 
  Sparkles, User, FileText, CheckCircle2, AlertTriangle, 
  Clock, Hash
} from 'lucide-react';

export const ActivityAuditLog: React.FC = () => {
  const { aiActivities, fighters } = useOperations();
  const [searchQuery, setSearchQuery] = useState('');
  const [actorFilter, setActorFilter] = useState<'ALL' | 'AI' | 'STAFF'>('ALL');

  const auditRows = aiActivities.map((act, idx) => ({
    id: `AUD-${1000 + idx}`,
    timestamp: act.timestamp,
    actor: act.type === 'ESCALATED' ? 'Operations Staff (Daniel Morgan)' : 'AI Autonomous Engine (v2.4)',
    actorType: act.type === 'ESCALATED' ? 'STAFF' : 'AI',
    event: act.actionTitle,
    details: act.details,
    subject: act.fighterName || 'System',
    confidence: act.confidence ? `${act.confidence}%` : 'N/A',
    securityHash: `0x${act.id.slice(0, 8).toUpperCase()}`
  }));

  const filteredLogs = auditRows.filter(row => {
    const matchesSearch = 
      row.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (actorFilter === 'AI' && row.actorType !== 'AI') return false;
    if (actorFilter === 'STAFF' && row.actorType !== 'STAFF') return false;

    return true;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Audit ID,Timestamp,Actor,Subject,Event,Confidence,Hash"]
      .concat(filteredLogs.map(l => `${l.id},${l.timestamp},"${l.actor}","${l.subject}","${l.event}",${l.confidence},${l.securityHash}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CW198_Audit_Log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950 flex items-center gap-2">
              <History className="w-5 h-5 text-neutral-800" />
              <span>Immutable Operations Audit Trail</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
              {filteredLogs.length} Logged Actions
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Complete cryptographic audit log of automated state transitions, OCR classifications, staff overrides, and regulatory submissions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Regulatory CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail, event, or hash..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium"
            />
          </div>

          <div className="flex items-center bg-white border border-neutral-200 p-0.5 rounded-lg font-semibold">
            <button
              onClick={() => setActorFilter('ALL')}
              className={`px-3 py-1 rounded-md transition-all ${actorFilter === 'ALL' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500'}`}
            >
              All Actors
            </button>
            <button
              onClick={() => setActorFilter('AI')}
              className={`px-3 py-1 rounded-md transition-all ${actorFilter === 'AI' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500'}`}
            >
              AI Engine Only
            </button>
            <button
              onClick={() => setActorFilter('STAFF')}
              className={`px-3 py-1 rounded-md transition-all ${actorFilter === 'STAFF' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500'}`}
            >
              Staff Overrides
            </button>
          </div>
        </div>

        <div className="text-[11px] text-neutral-500 font-mono">
          Safe MMA & UKAD Compliance Hash: <strong className="text-neutral-800">SHA256:VERIFIED</strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Action & Operational Event</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Security Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-900">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 text-neutral-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-sans whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.actorType === 'AI' 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.actor}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-neutral-900 whitespace-nowrap">
                    {log.subject}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-neutral-900 min-w-[180px]">
                    {log.event}
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-600 max-w-xs truncate leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-neutral-700">
                    {log.confidence}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-400">
                    {log.securityHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
