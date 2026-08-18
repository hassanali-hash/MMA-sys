'use client';

import React from 'react';
import { useOperations } from '@/context/OperationsContext';
import { ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export const OverviewDashboard: React.FC = () => {
  const { 
    currentEvent, 
    fighters, 
    humanReviewCases, 
    pendingApprovals,
    aiActivities,
    setCurrentTab, 
    setSelectedFighterId,
    startAIDemo,
    isDemoRunning
  } = useOperations();

  // Metrics
  const totalFighters = fighters.length;
  const readyFighters = fighters.filter(f => f.status === 'READY').length;
  const waitingFighters = fighters.filter(f => f.status === 'WAITING').length;
  const humanActionFighters = fighters.filter(f => f.status === 'HUMAN_ACTION').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top 4 Sleek Stat Cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div 
          onClick={() => setCurrentTab('fighters')}
          className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Total Fighters</p>
          <p className="text-2xl font-bold text-slate-900">{totalFighters}</p>
        </div>

        <div 
          onClick={() => setCurrentTab('fighters')}
          className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider mb-1">Ready</p>
          <p className="text-2xl font-bold text-emerald-600">{readyFighters}</p>
        </div>

        <div 
          onClick={() => setCurrentTab('fighters')}
          className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <p className="text-[10px] text-amber-500 uppercase font-bold tracking-wider mb-1">Waiting</p>
          <p className="text-2xl font-bold text-amber-500">{waitingFighters}</p>
        </div>

        <div 
          onClick={() => setCurrentTab('human-review')}
          className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-red-300 transition-all cursor-pointer"
        >
          <p className="text-[10px] text-red-600 uppercase font-bold tracking-wider mb-1">Human Action</p>
          <p className="text-2xl font-bold text-red-600">{humanActionFighters}</p>
        </div>
      </div>

      {/* Grid: Main Fighter Readiness (2 Cols) + Right AI Sidebars (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fighter Readiness Table */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Fighter Readiness — {currentEvent.city}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Automated tracking & live document ingestion</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={startAIDemo}
                disabled={isDemoRunning}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-[10px] px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
              >
                {isDemoRunning ? 'Simulating...' : 'Run AI Demo'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-slate-100">
                <tr className="text-[10px] uppercase font-bold text-slate-400">
                  <th className="px-5 py-3">Fighter</th>
                  <th className="px-4 py-3">Readiness</th>
                  <th className="px-4 py-3">Missing Requirements</th>
                  <th className="px-4 py-3">AI Status</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {fighters.slice(0, 8).map(fighter => {
                  const missingReqs = fighter.requirements.filter(r => r.required && r.status !== 'COMPLETE');
                  const isHighlighted = fighter.status === 'READY' ? 'bg-emerald-50/20' : fighter.status === 'HUMAN_ACTION' ? 'bg-red-50/30' : '';

                  return (
                    <tr 
                      key={fighter.id}
                      onClick={() => {
                        setSelectedFighterId(fighter.id);
                        setCurrentTab('fighters');
                      }}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${isHighlighted}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-sm text-slate-900">{fighter.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-tighter">
                          {fighter.weightClass} • {fighter.country}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              fighter.readinessPercentage === 100 ? 'bg-emerald-500' :
                              fighter.status === 'HUMAN_ACTION' ? 'bg-red-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${fighter.readinessPercentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold mt-1 inline-block text-slate-800">
                          {fighter.readinessPercentage}%
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {missingReqs.length === 0 ? (
                          <span className="text-slate-300 italic text-[11px]">None</span>
                        ) : (
                          <span className={`text-xs ${fighter.status === 'HUMAN_ACTION' ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                            {missingReqs.map(r => r.title.split(' ')[0]).join(', ')}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className={`text-[10px] ${
                          fighter.status === 'READY' ? 'text-emerald-600 font-medium' :
                          fighter.status === 'HUMAN_ACTION' ? 'text-red-700 font-semibold' : 'text-slate-500 italic'
                        }`}>
                          {fighter.status === 'READY' ? 'Verification Complete' :
                           fighter.status === 'HUMAN_ACTION' ? 'Escalated to staff' :
                           'AI Follow-up active'}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <StatusBadge status={fighter.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Showing top confirmed fighters for {currentEvent.title.split('—')[0]}</span>
            <button
              onClick={() => setCurrentTab('fighters')}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Directory (24)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Processing Now & AI Activity Log */}
        <div className="flex flex-col gap-4">
          {/* Dark Processing Now Container */}
          <div className="bg-[#1e293b] rounded-xl shadow-md overflow-hidden flex flex-col shrink-0 border border-slate-800">
            <div className="px-4 py-3 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Processing Now</h4>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Scanning Doc</span>
                  <span className="text-[9px] text-slate-400 font-mono">98% OCR Confidence</span>
                </div>
                <p className="text-xs text-white font-medium">Passport-MarcoSilva.pdf</p>
                <div className="mt-2 h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]"></div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <div className="w-2 h-2 rounded-full border border-slate-500"></div>
                <p className="text-[11px] text-slate-400 italic">Interpreting manager WhatsApp message...</p>
              </div>
            </div>
          </div>

          {/* AI Activity Log Stream */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Activity Log</h4>
              <button
                onClick={() => setCurrentTab('ai-ops')}
                className="text-[10px] text-red-600 font-bold hover:underline"
              >
                Live Ops
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-80 custom-scrollbar">
              {aiActivities.slice(0, 6).map(act => {
                const isHuman = act.type === 'ESCALATED';
                const isWarning = act.type === 'REMINDER_SCHEDULED' || act.type === 'MESSAGE_INTERPRETED';

                return (
                  <div 
                    key={act.id} 
                    onClick={() => {
                      if (act.fighterId) {
                        setSelectedFighterId(act.fighterId);
                        setCurrentTab('fighters');
                      }
                    }}
                    className={`flex gap-3 cursor-pointer group ${isHuman ? 'border-l-2 border-red-500 pl-2.5' : ''}`}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        isHuman ? 'bg-red-600' :
                        isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></div>
                    </div>

                    <div className="text-xs">
                      <p className={`text-[11px] font-bold ${isHuman ? 'text-red-600' : 'text-slate-900'}`}>
                        {act.timestamp} {isHuman && '— HUMAN ACTION'}
                      </p>
                      <p className={`text-slate-600 text-[11px] mt-0.5 leading-snug ${isHuman ? 'font-semibold text-slate-700' : ''}`}>
                        {act.fighterName && <strong>{act.fighterName}: </strong>}
                        {act.actionTitle}. {act.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
