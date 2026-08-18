'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { Search, User, FileText, X, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    fighters, 
    documents, 
    setCurrentTab, 
    setSelectedFighterId,
    setSelectedDocumentId
  } = useOperations();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        fighters: fighters.slice(0, 4),
        documents: documents.slice(0, 3)
      };
    }

    const q = query.toLowerCase();

    const matchedFighters = fighters.filter(f => 
      f.name.toLowerCase().includes(q) ||
      f.managerName.toLowerCase().includes(q) ||
      f.country.toLowerCase().includes(q) ||
      f.weightClass.toLowerCase().includes(q) ||
      f.opponentName.toLowerCase().includes(q)
    );

    const matchedDocs = documents.filter(d => 
      d.title.toLowerCase().includes(q) ||
      d.fighterName.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.fileName.toLowerCase().includes(q)
    );

    return {
      fighters: matchedFighters,
      documents: matchedDocs
    };
  }, [query, fighters, documents]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-200 bg-neutral-50/50">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search fighters, managers, passports, medical records, weight classes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="ml-2 px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-200 rounded-md"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Fighters Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-2 mb-2 flex items-center justify-between">
              <span>Fighters & Opponents ({results.fighters.length})</span>
              <span className="text-[10px] text-neutral-400 font-normal">Click to open profile</span>
            </div>
            {results.fighters.length === 0 ? (
              <div className="px-3 py-2 text-xs text-neutral-400">No fighters match query</div>
            ) : (
              <div className="space-y-1">
                {results.fighters.map(fighter => (
                  <div
                    key={fighter.id}
                    onClick={() => {
                      setSelectedFighterId(fighter.id);
                      setCurrentTab('fighters');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {fighter.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors truncate">
                          {fighter.name} <span className="text-neutral-400 font-normal text-[11px]">• vs {fighter.opponentName}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          {fighter.weightClass} • Manager: {fighter.managerName} ({fighter.country})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-neutral-900">{fighter.readinessPercentage}%</div>
                        <div className="text-[10px] text-neutral-400">Ready</div>
                      </div>
                      <StatusBadge status={fighter.status} size="sm" />
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-2 mb-2">
              Documents & Clearance Records ({results.documents.length})
            </div>
            {results.documents.length === 0 ? (
              <div className="px-3 py-2 text-xs text-neutral-400">No documents found</div>
            ) : (
              <div className="space-y-1">
                {results.documents.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocumentId(doc.id);
                      setCurrentTab('documents');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-neutral-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors truncate">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          {doc.fighterName} • {doc.fileName} ({doc.fileSize})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={doc.verificationStatus} size="sm" />
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-neutral-100/70 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1 py-0.5 bg-white border border-neutral-300 rounded font-mono text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-white border border-neutral-300 rounded font-mono text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.5 bg-white border border-neutral-300 rounded font-mono text-[10px]">Enter</kbd> to select</span>
          </div>
          <span>Total {fighters.length} Fighters in Roster</span>
        </div>
      </div>
    </div>
  );
};
