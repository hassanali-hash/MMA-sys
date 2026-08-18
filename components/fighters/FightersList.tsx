'use client';

import React, { useState, useMemo } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { Fighter, FighterStatus } from '@/types';
import { 
  Search, Filter, Users, CheckCircle2, Clock, 
  AlertTriangle, ChevronRight, MessageSquare, 
  Upload, ShieldAlert, Sparkles, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { FighterDetailModal } from '@/components/fighters/FighterDetailModal';

export const FightersList: React.FC = () => {
  const { 
    fighters, 
    selectedFighterId, 
    setSelectedFighterId,
    setCurrentTab,
    setIsUploadModalOpen,
    setUploadTargetFighterId
  } = useOperations();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'READY' | 'WAITING' | 'HUMAN_ACTION' | 'MISSING_MEDICAL' | 'MISSING_TRAVEL' | 'MISSING_DOCS'>('ALL');
  const [weightFilter, setWeightFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NAME' | 'READINESS' | 'STATUS'>('READINESS');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeFighter, setActiveFighter] = useState<Fighter | null>(null);

  // Available weight classes
  const weightClasses = useMemo(() => {
    const set = new Set<string>();
    fighters.forEach(f => set.add(f.weightClass));
    return Array.from(set);
  }, [fighters]);

  // Filtered & Sorted Fighters
  const filteredFighters = useMemo(() => {
    return fighters.filter(f => {
      // Search
      const matchesSearch = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.opponentName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Weight Class
      if (weightFilter !== 'ALL' && f.weightClass !== weightFilter) {
        return false;
      }

      // Status
      if (statusFilter === 'READY') return f.status === 'READY';
      if (statusFilter === 'WAITING') return f.status === 'WAITING';
      if (statusFilter === 'HUMAN_ACTION') return f.status === 'HUMAN_ACTION';
      if (statusFilter === 'MISSING_MEDICAL') {
        return f.requirements.some(r => r.category === 'medical' && r.required && r.status !== 'COMPLETE');
      }
      if (statusFilter === 'MISSING_TRAVEL') {
        return f.requirements.some(r => r.category === 'travel' && r.required && r.status !== 'COMPLETE');
      }
      if (statusFilter === 'MISSING_DOCS') {
        return f.requirements.some(r => (r.category === 'contract' || r.category === 'identity') && r.required && r.status !== 'COMPLETE');
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'READINESS') {
        comparison = a.readinessPercentage - b.readinessPercentage;
      } else if (sortBy === 'NAME') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'STATUS') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'ASC' ? comparison : -comparison;
    });
  }, [fighters, searchQuery, statusFilter, weightFilter, sortBy, sortOrder]);

  const handleOpenDetail = (f: Fighter) => {
    setActiveFighter(f);
    setSelectedFighterId(f.id);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950">
              Fighter Operations Directory
            </h1>
            <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
              {filteredFighters.length} Fighters
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Confirmed bout fighters, automated readiness checklists, missing items, and AI communications.
          </p>
        </div>

        {/* Search & Weight Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fighter, manager, country..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          <select
            value={weightFilter}
            onChange={e => setWeightFilter(e.target.value)}
            className="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            <option value="ALL">All Weight Classes</option>
            {weightClasses.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 rounded-lg text-neutral-700 transition-colors"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'ASC' ? 'Lowest Readiness First' : 'Highest First'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { key: 'ALL', label: `All Fighters (${fighters.length})` },
          { key: 'READY', label: `Ready (${fighters.filter(f => f.status === 'READY').length})` },
          { key: 'WAITING', label: `Waiting (${fighters.filter(f => f.status === 'WAITING').length})` },
          { key: 'HUMAN_ACTION', label: `Human Action (${fighters.filter(f => f.status === 'HUMAN_ACTION').length})` },
          { key: 'MISSING_MEDICAL', label: 'Missing Medicals' },
          { key: 'MISSING_DOCS', label: 'Missing ID/Contracts' },
          { key: 'MISSING_TRAVEL', label: 'Missing Travel' }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === filter.key
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Fighters Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">Fighter</th>
                <th className="py-3 px-4">Matchup & Weight</th>
                <th className="py-3 px-4">Manager</th>
                <th className="py-3 px-4">Readiness</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Missing Requirements</th>
                <th className="py-3 px-4">AI Operational Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredFighters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No fighters matching current filters.
                  </td>
                </tr>
              ) : (
                filteredFighters.map(fighter => (
                  <tr 
                    key={fighter.id}
                    onClick={() => handleOpenDetail(fighter)}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Fighter Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {fighter.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-950 group-hover:text-red-600 transition-colors">
                            {fighter.name}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-medium">
                            {fighter.country} • {fighter.record}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Matchup & Weight */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-800">
                        vs {fighter.opponentName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {fighter.weightClass}
                      </div>
                    </td>

                    {/* Manager */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-900">
                        {fighter.managerName}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {fighter.managerPhone}
                      </div>
                    </td>

                    {/* Readiness % */}
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-900 mb-1">
                        <span>{fighter.readinessPercentage}%</span>
                      </div>
                      <ProgressBar value={fighter.readinessPercentage} size="sm" colorScheme="auto" />
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={fighter.status} size="sm" />
                    </td>

                    {/* Missing Items */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      {fighter.missingItems.length === 0 ? (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>All Cleared</span>
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {fighter.missingItems.slice(0, 2).map((item, idx) => (
                            <span 
                              key={idx}
                              className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-medium truncate max-w-[120px]"
                            >
                              {item}
                            </span>
                          ))}
                          {fighter.missingItems.length > 2 && (
                            <span className="text-[10px] text-neutral-500 font-bold">
                              +{fighter.missingItems.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* AI Status */}
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="text-[11px] text-neutral-600 line-clamp-1 leading-relaxed">
                        {fighter.aiStatus}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        Last contact: {fighter.lastContact}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedFighterId(fighter.id);
                            setCurrentTab('communications');
                          }}
                          className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Open Message Thread"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setUploadTargetFighterId(fighter.id);
                            setIsUploadModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Upload & Extract Document"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDetail(fighter)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fighter Detail Modal */}
      {isDetailOpen && activeFighter && (
        <FighterDetailModal
          fighter={activeFighter}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
};
