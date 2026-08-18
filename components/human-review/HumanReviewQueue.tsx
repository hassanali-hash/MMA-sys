'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { HumanReviewCase } from '@/types';
import { 
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  FileText, MessageSquare, ExternalLink, Sparkles, 
  HelpCircle, Check, Eye, User
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export const HumanReviewQueue: React.FC = () => {
  const { 
    humanReviewCases, 
    resolveHumanReviewCase,
    setCurrentTab,
    setSelectedFighterId,
    setSelectedDocumentId
  } = useOperations();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(humanReviewCases[0]?.id || '');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const activeCase = humanReviewCases.find(c => c.id === selectedCaseId) || humanReviewCases[0];

  const handleResolve = (resolution: 'VALID' | 'INVALID' | 'RESOLVED') => {
    if (!activeCase) return;
    resolveHumanReviewCase(activeCase.id, resolution, resolutionNotes);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Human Review & Escalation Queue</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              {humanReviewCases.length} Active Cases
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Safety threshold enforcement: edge cases, degraded documents, and date ambiguities requiring manual staff authorization.
          </p>
        </div>
      </div>

      {humanReviewCases.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-400">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-800">Human Review Queue Cleared</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            No active escalations or document ambiguities pending staff resolution.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Cases List */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">
              Pending Escalation Tickets ({humanReviewCases.length})
            </div>

            {humanReviewCases.map(item => {
              const isSelected = item.id === activeCase?.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-rose-50/70 border-rose-400 shadow-xs ring-2 ring-rose-500/10'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                      item.priority === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">{item.createdAt}</span>
                  </div>

                  <h3 className="text-xs font-bold text-neutral-900 line-clamp-1">
                    {item.fighterName} — {item.title}
                  </h3>

                  <p className="text-[11px] text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
                    {item.reason}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-200/50 text-[10px]">
                    <span className="text-neutral-500 font-mono">
                      Confidence: <strong className="text-rose-700">{item.aiConfidence}%</strong>
                    </span>
                    <span className="font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 2 Columns: Active Case Deep Inspector */}
          {activeCase && (
            <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-neutral-950">{activeCase.fighterName}</span>
                    <span className="text-xs text-neutral-500 font-medium">({activeCase.weightClass})</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      activeCase.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {activeCase.priority} PRIORITY
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-rose-700 mt-1">
                    {activeCase.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedFighterId(activeCase.fighterId);
                      setCurrentTab('communications');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Contact Manager</span>
                  </button>
                  <StatusBadge status="HUMAN ACTION" size="md" />
                </div>
              </div>

              {/* Reason Explanation Box */}
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1.5 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Ambiguity / Safety Flag Description</span>
                </div>
                <p className="text-neutral-800 leading-relaxed">
                  {activeCase.reason}
                </p>
              </div>

              {/* Side-by-side: Detected OCR Values vs Possible Interpretations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Detected Document OCR Values
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {Object.entries(activeCase.detectedValues).map(([k, v]) => (
                      <div key={k} className="p-1.5 bg-white rounded border border-neutral-200">
                        <span className="text-neutral-500 font-sans block text-[10px] uppercase">{k}</span>
                        <span className="font-bold text-neutral-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    AI Strategic Recommendation
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 leading-relaxed font-sans text-xs">
                    {activeCase.aiRecommendation}
                  </div>

                  {activeCase.possibleValues && (
                    <div className="space-y-1 pt-2 font-mono text-[11px]">
                      {Object.entries(activeCase.possibleValues).map(([k, v]) => (
                        <div key={k} className="p-1.5 bg-white rounded border border-neutral-200">
                          <span className="text-neutral-500 font-sans block text-[10px] uppercase">{k}</span>
                          <span className="text-neutral-800">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Document Preview Snippet (Placeholder) */}
              <div className="p-4 bg-neutral-900 text-white rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between text-neutral-400 pb-1 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-white">Document Preview & OCR Raw Extract</span>
                  </div>
                  {activeCase.documentId && (
                    <button
                      onClick={() => {
                        setSelectedDocumentId(activeCase.documentId!);
                        setCurrentTab('documents');
                      }}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <span>Open Full Inspector</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="p-3 bg-neutral-800 rounded font-mono text-[11px] text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {`STATE ATHLETIC COMMISSION / REGULATORY MEDICAL CERTIFICATE\n` +
                   `ATHLETE NAME: ${activeCase.fighterName.toUpperCase()}\n` +
                   `FLAGGED SECTION: Date format ambiguity / Name spelling\n` +
                   `OCR CONFIDENCE RATING: ${activeCase.aiConfidence}% (Standard threshold: 75%)`}
                </div>
              </div>

              {/* Resolution Notes & Actions */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Staff Resolution Notes (Logged to Audit Trail):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Verified with physician clinic in Los Angeles; exam date confirmed as Aug 12 2026."
                    value={resolutionNotes}
                    onChange={e => setResolutionNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFighterId(activeCase.fighterId);
                        setCurrentTab('communications');
                      }}
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Request New Document
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve('INVALID')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Mark Invalid / Reject</span>
                    </button>

                    <button
                      onClick={() => handleResolve('VALID')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Clear Requirement</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
