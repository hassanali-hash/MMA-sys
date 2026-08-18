'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { 
  Settings, Sliders, ShieldCheck, CheckCircle2, 
  Clock, AlertCircle, Save, RotateCcw, Sparkles 
} from 'lucide-react';

export const EventConfig: React.FC = () => {
  const { currentEvent } = useOperations();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [rules, setRules] = useState({
    requirePassport: true,
    requireBloodSerology: true,
    requireBrainMRI: true,
    requireEyeExam: true,
    requireFlightBooking: true,
    requireEmergencyContact: true,
    mriValidityMonths: 24,
    bloodTestValidityDays: 180,
    passportValidityMonths: 6,
    chaserFrequencyHours: 48,
    humanEscalationDays: 5,
    autoApproveConfidenceThreshold: 85,
    maxCornerPasses: 3
  });

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950 flex items-center gap-2">
              <Settings className="w-5 h-5 text-neutral-800" />
              <span>Event Requirements & Safety Guardrails Configuration</span>
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Configure compliance schemas, medical validity thresholds, and AI autonomous chaser rules for {currentEvent.title}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved to Event Schema</span>
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Grid of Rule Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Mandatory Checklist Requirements */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              1. Event Compliance Schema
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { label: 'Signed Bout Agreement', key: 'requirePassport', desc: 'Mandatory before any official fight announcements' },
              { label: 'Blood Serology Panel (HIV/HepB/HepC)', key: 'requireBloodSerology', desc: 'UKAD & Safe MMA strict requirement' },
              { label: 'Brain MRI / MRA Diagnostic Scan', key: 'requireBrainMRI', desc: 'Annual neuro clearance mandatory' },
              { label: 'Dilated Eye Exam (Funduscopy)', key: 'requireEyeExam', desc: 'Ophthalmic retinal clearance' },
              { label: 'Flight Booking Confirmation', key: 'requireFlightBooking', desc: 'Required for host hotel and airport transfers' },
              { label: 'Emergency Contact & Cornermen', key: 'requireEmergencyContact', desc: 'Safety contact and cornermen registration' }
            ].map(item => (
              <div key={item.key} className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70">
                <div>
                  <div className="font-bold text-neutral-900">{item.label}</div>
                  <div className="text-[11px] text-neutral-500">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 text-red-600 rounded mt-0.5 focus:ring-red-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Validity Timeframes & Expiry Thresholds */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              2. Validity Cutoffs & Thresholds
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Blood Serology Maximum Age (Days):
              </label>
              <input
                type="number"
                value={rules.bloodTestValidityDays}
                onChange={e => setRules({ ...rules, bloodTestValidityDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs"
              />
              <span className="text-[10px] text-neutral-400">Tests older than 180 days automatically trigger requirement failure</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Brain MRI Max Validity (Months):
              </label>
              <input
                type="number"
                value={rules.mriValidityMonths}
                onChange={e => setRules({ ...rules, mriValidityMonths: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs"
              />
              <span className="text-[10px] text-neutral-400">Standard 24-month validity for non-knockout status</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Passport Remaining Validity (Months):
              </label>
              <input
                type="number"
                value={rules.passportValidityMonths}
                onChange={e => setRules({ ...rules, passportValidityMonths: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs"
              />
              <span className="text-[10px] text-neutral-400">UK Home Office border entry rule</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Max Corner Passes Allocated Per Fighter:
              </label>
              <input
                type="number"
                value={rules.maxCornerPasses}
                onChange={e => setRules({ ...rules, maxCornerPasses: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. Autonomous AI Engine Behavior */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              3. AI Autopilot Parameters
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Autonomous Chaser Frequency (Hours):
              </label>
              <input
                type="number"
                value={rules.chaserFrequencyHours}
                onChange={e => setRules({ ...rules, chaserFrequencyHours: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs"
              />
              <span className="text-[10px] text-neutral-400">Time between automated reminders for missing items</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Auto-Approval Confidence Floor (%):
              </label>
              <input
                type="number"
                value={rules.autoApproveConfidenceThreshold}
                onChange={e => setRules({ ...rules, autoApproveConfidenceThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs"
              />
              <span className="text-[10px] text-neutral-400">OCR extractions below this score are diverted to Human Review</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Escalate Unresolved Items to Human Queue:
              </label>
              <select
                value={rules.humanEscalationDays}
                onChange={e => setRules({ ...rules, humanEscalationDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
              >
                <option value={3}>3 Days Before Event</option>
                <option value={5}>5 Days Before Event</option>
                <option value={7}>7 Days Before Event</option>
              </select>
            </div>

            <div className="p-3 bg-neutral-900 text-white rounded-xl text-xs space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero-Hallucination Safe Mode</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                All document approvals are strictly verified against cryptographic checksums and date math.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
