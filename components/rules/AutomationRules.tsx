'use client';

import React from 'react';
import { 
  Sliders, ArrowRight, Zap, ShieldAlert, 
  MessageSquare, FileText, CheckCircle2, Clock, 
  Sparkles, Bot, AlertTriangle 
} from 'lucide-react';

export const AutomationRules: React.FC = () => {
  const rulesList = [
    {
      id: 'rule-1',
      name: 'Fight Confirmation & Onboarding Trigger',
      trigger: 'Matchmaker confirms bout in management roster',
      aiAction: 'Generate personalized magic portal link & dispatch WhatsApp welcome sequence to Manager with full checklist breakdown.',
      guardrail: 'No action if bout is tentative or unconfirmed.',
      status: 'ACTIVE',
      category: 'ONBOARDING'
    },
    {
      id: 'rule-2',
      name: 'Document Ingestion & Zero-Touch OCR Match',
      trigger: 'File uploaded via WhatsApp or Fighter Portal',
      aiAction: 'Run high-resolution OCR, verify MRZ / lab panel dates, auto-match against compliance checklist, and mark requirement complete.',
      guardrail: 'Requires >= 85% confidence score and valid date range.',
      status: 'ACTIVE',
      category: 'DOCUMENT_OCR'
    },
    {
      id: 'rule-3',
      name: 'Safety Ambiguity Escalation Protocol',
      trigger: 'Document degraded, date ambiguous, or name spelling mismatch',
      aiAction: 'Hold requirement state, divert file into Human Review Queue, and highlight conflict for operations staff.',
      guardrail: 'Strict zero-hallucination policy. Never guess unreadable text.',
      status: 'ACTIVE',
      category: 'HUMAN_REVIEW'
    },
    {
      id: 'rule-4',
      name: 'Autonomous Proactive Chaser Sequence',
      trigger: 'Mandatory requirement missing >= 48 hours after reminder',
      aiAction: 'Draft polite, contextual follow-up message outlining exactly what is missing and provide 1-tap upload link.',
      guardrail: 'Max 3 automated chasers before escalating to staff phone call ticket.',
      status: 'ACTIVE',
      category: 'CHASER'
    },
    {
      id: 'rule-5',
      name: 'Natural Language Travel & Hotel Extractor',
      trigger: 'Manager sends casual chat message describing flight details',
      aiAction: 'Extract airport code (MAN), arrival timestamp, and flight number; store in travel manifest and update checklist.',
      guardrail: 'Flags flight if arrival is after mandatory weigh-in cutoff.',
      status: 'ACTIVE',
      category: 'TRAVEL'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-red-600" />
              <span>Autonomous AI Rule Engine & Logic Flowchart</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              5 Active Rules
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Visual pipeline representation of how the AI Operations Agent autonomously manages fighter workflows.
          </p>
        </div>
      </div>

      {/* Interactive Visual Flowchart */}
      <div className="space-y-4">
        {rulesList.map((rule, idx) => (
          <div
            key={rule.id}
            className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs hover:border-neutral-300 transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-neutral-950">{rule.name}</h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {rule.status}
              </span>
            </div>

            {/* Pipeline Steps (Trigger -> AI Action -> Guardrail) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Trigger */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Trigger Event</span>
                  </div>
                  <p className="font-semibold text-neutral-900 leading-relaxed">
                    {rule.trigger}
                  </p>
                </div>
              </div>

              {/* AI Autonomous Action */}
              <div className="p-3.5 bg-red-50/40 rounded-xl border border-red-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-700 mb-1">
                    <Sparkles className="w-3 h-3 text-red-600" />
                    <span>Autonomous AI Action</span>
                  </div>
                  <p className="text-neutral-900 font-medium leading-relaxed">
                    {rule.aiAction}
                  </p>
                </div>
              </div>

              {/* Guardrail */}
              <div className="p-3.5 bg-neutral-900 text-white rounded-xl border border-neutral-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <ShieldAlert className="w-3 h-3 text-emerald-400" />
                    <span>Safety Guardrail & Threshold</span>
                  </div>
                  <p className="text-neutral-200 text-[11px] leading-relaxed">
                    {rule.guardrail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
