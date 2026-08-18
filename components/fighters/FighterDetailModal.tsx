'use client';

import React, { useState } from 'react';
import { Fighter, RequirementItem, RequirementStatus } from '@/types';
import { useOperations } from '@/context/OperationsContext';
import { 
  X, CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  Upload, MessageSquare, Phone, Mail, User, 
  Sparkles, ChevronDown, ChevronRight, FileText, 
  MapPin, Plane, ShieldAlert, Award, ExternalLink
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@/components/common/ProgressBar';

interface FighterDetailModalProps {
  fighter: Fighter;
  onClose: () => void;
}

export const FighterDetailModal: React.FC<FighterDetailModalProps> = ({ fighter, onClose }) => {
  const { 
    updateFighterRequirement, 
    escalateFighter, 
    setCurrentTab, 
    setSelectedFighterId, 
    setIsUploadModalOpen, 
    setUploadTargetFighterId,
    chatMessages,
    aiActivities
  } = useOperations();

  const [activeTab, setActiveTab] = useState<'CHECKLIST' | 'TIMELINE' | 'INFO'>('CHECKLIST');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    contract: true,
    identity: true,
    medical: true,
    fighter_info: true,
    media: false,
    travel: true,
    event_info: false
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const categories = [
    { key: 'contract', title: '1. Bout Contract & Legal' },
    { key: 'identity', title: '2. Identity & Passport' },
    { key: 'medical', title: '3. Medical & Diagnostic Clearance' },
    { key: 'fighter_info', title: '4. Fighter Profile & Cornermen' },
    { key: 'media', title: '5. Photos & Broadcast Assets' },
    { key: 'travel', title: '6. Travel Logistics & Accommodation' },
    { key: 'event_info', title: '7. Final Event Protocol & Briefings' }
  ];

  const fighterMessages = chatMessages[fighter.id] || [];
  const fighterActivities = aiActivities.filter(a => a.fighterId === fighter.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-neutral-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 border-2 border-neutral-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg text-white">
              {fighter.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white">{fighter.name}</h2>
                {fighter.nickname && (
                  <span className="text-xs font-serif italic text-red-400">&ldquo;{fighter.nickname}&rdquo;</span>
                )}
                <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                  {fighter.country} ({fighter.countryCode})
                </span>
              </div>
              <div className="text-xs text-neutral-300 flex items-center gap-2 mt-1">
                <span className="font-semibold text-white">{fighter.weightClass}</span>
                <span>•</span>
                <span className="text-red-400 font-bold">vs {fighter.opponentName}</span>
                <span>•</span>
                <span className="text-neutral-400">Record: {fighter.record}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-neutral-400 font-medium">Event Readiness</div>
              <div className="text-xl font-mono font-black text-white">{fighter.readinessPercentage}%</div>
            </div>
            <StatusBadge status={fighter.status} size="lg" />
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setSelectedFighterId(fighter.id);
                setCurrentTab('communications');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 rounded-lg font-semibold transition-colors shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Contact Manager ({fighter.managerName})</span>
            </button>

            <button
              onClick={() => {
                setUploadTargetFighterId(fighter.id);
                setIsUploadModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 rounded-lg font-semibold transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Upload Document</span>
            </button>

            <button
              onClick={() => {
                escalateFighter(fighter.id, 'Manual staff review requested');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg font-semibold transition-colors shadow-2xs"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Escalate to Human Review</span>
            </button>
          </div>

          {/* Tab Switcher inside modal */}
          <div className="flex items-center bg-neutral-200/80 p-0.5 rounded-lg font-semibold">
            <button
              onClick={() => setActiveTab('CHECKLIST')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'CHECKLIST' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Checklist ({fighter.requirements.length})
            </button>
            <button
              onClick={() => setActiveTab('TIMELINE')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'TIMELINE' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              AI Timeline ({fighterActivities.length + fighterMessages.length})
            </button>
            <button
              onClick={() => setActiveTab('INFO')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'INFO' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Fighter & Corner Info
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {activeTab === 'CHECKLIST' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="text-xs text-neutral-500">
                  Click any status pill or toggle to manually verify or change requirement state.
                </div>
                <div className="text-xs font-mono font-bold text-neutral-700">
                  {fighter.requirements.filter(r => r.status === 'COMPLETE').length} of {fighter.requirements.length} Completed
                </div>
              </div>

              {categories.map(cat => {
                const reqs = fighter.requirements.filter(r => r.category === cat.key);
                if (reqs.length === 0) return null;

                const completedCount = reqs.filter(r => r.status === 'COMPLETE').length;
                const isExpanded = expandedCategories[cat.key];

                return (
                  <div key={cat.key} className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      onClick={() => toggleCategory(cat.key)}
                      className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100/70 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-neutral-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-neutral-500" />
                        )}
                        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          {cat.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-500">
                          {completedCount}/{reqs.length}
                        </span>
                        {completedCount === reqs.length ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Complete
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-neutral-100 p-2 space-y-1">
                        {reqs.map(req => (
                          <div 
                            key={req.id}
                            className="p-3 hover:bg-neutral-50/80 rounded-lg transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-neutral-950">{req.title}</span>
                                {req.required ? (
                                  <span className="text-[10px] bg-red-50 text-red-700 font-bold px-1.5 py-0.2 rounded border border-red-200">
                                    Mandatory
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded">
                                    Optional
                                  </span>
                                )}
                                {req.confidence && (
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                                    AI Verified ({req.confidence}%)
                                  </span>
                                )}
                              </div>
                              {req.description && (
                                <p className="text-neutral-500 text-[11px] mt-0.5">{req.description}</p>
                              )}
                              {req.extractedData && (
                                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] font-mono">
                                  {Object.entries(req.extractedData).map(([k, v]) => (
                                    <span key={k} className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
                                      <strong className="text-neutral-600">{k}:</strong> {String(v)}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {req.notes && (
                                <div className="text-[11px] text-amber-700 bg-amber-50/60 p-1.5 rounded mt-1.5 border border-amber-200">
                                  <strong>Note:</strong> {req.notes}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                              <select
                                value={req.status}
                                onChange={(e) => updateFighterRequirement(fighter.id, req.id, e.target.value as RequirementStatus)}
                                className="text-xs font-semibold bg-white border border-neutral-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
                              >
                                <option value="COMPLETE">Mark Complete</option>
                                <option value="PENDING">Mark Pending</option>
                                <option value="ACTION_REQUIRED">Action Required</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                              </select>
                              <StatusBadge status={req.status} size="sm" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'TIMELINE' && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-500 pb-2 border-b border-neutral-100">
                Chronological timeline of all incoming manager messages, document classifications, OCR extractions, and autonomous actions.
              </div>

              {fighterActivities.length === 0 && fighterMessages.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  No automated timeline events recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {fighterActivities.map(act => (
                    <div key={act.id} className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-neutral-800">{act.timestamp}</span>
                        {act.confidence && (
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            {act.confidence}% Confidence
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-neutral-900">{act.actionTitle}</div>
                      <p className="text-neutral-600 text-[11px] leading-relaxed">{act.details}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'INFO' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2.5">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                  Fighter Profile Details
                </h4>
                <div><strong>Full Name:</strong> {fighter.name}</div>
                <div><strong>Weight Class:</strong> {fighter.weightClass}</div>
                <div><strong>Nationality:</strong> {fighter.country} ({fighter.countryCode})</div>
                <div><strong>Email:</strong> {fighter.fighterEmail}</div>
                <div><strong>Phone / WhatsApp:</strong> {fighter.fighterPhone}</div>
                <div><strong>Medical Expiry:</strong> {fighter.medicalClearanceExpiry || 'Active (UKAD 2026/27)'}</div>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2.5">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                  Manager & Corner Credentials
                </h4>
                <div><strong>Manager:</strong> {fighter.managerName}</div>
                <div><strong>Manager Email:</strong> {fighter.managerEmail}</div>
                <div><strong>Manager Phone:</strong> {fighter.managerPhone}</div>
                <div><strong>Corner Passes Allocated:</strong> {fighter.cornerPassesAllocated} Passes</div>
                <div><strong>Registered Cornermen:</strong> Carlos Silva, Rui Costa</div>
                <div><strong>Host Hotel Room:</strong> Radisson Blu Manchester Airport (Twin Room)</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
          <span className="text-neutral-500">
            Fighter ID: <strong className="font-mono text-neutral-700">{fighter.id}</strong> • Event: Cage Warriors 198
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
