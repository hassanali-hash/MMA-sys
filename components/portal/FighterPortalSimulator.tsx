'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { 
  Smartphone, Upload, CheckCircle2, Clock, 
  AlertTriangle, MessageSquare, ChevronRight, 
  ShieldCheck, ArrowLeft, Camera, FileText, 
  Sparkles, Hotel, Trophy, User, Plus
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@/components/common/ProgressBar';

export const FighterPortalSimulator: React.FC = () => {
  const { 
    fighters, 
    selectedFighterId, 
    setSelectedFighterId, 
    currentEvent,
    setIsUploadModalOpen,
    setUploadTargetFighterId
  } = useOperations();

  const currentFighter = fighters.find(f => f.id === selectedFighterId) || fighters[0];

  const [cornerPassNames, setCornerPassNames] = useState<string[]>([
    'Carlos Silva (Head Coach)',
    'Rui Costa (Cutman / Conditioning)'
  ]);
  const [newCornerName, setNewCornerName] = useState('');
  const [isAddingCorner, setIsAddingCorner] = useState(false);

  const handleAddCorner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCornerName.trim()) return;
    setCornerPassNames([...cornerPassNames, newCornerName]);
    setNewCornerName('');
    setIsAddingCorner(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-red-600" />
              <span>Fighter Mobile Onboarding Experience Simulator</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full">
              Athlete & Manager View
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Zero-login magic link web portal accessed by athletes to upload medicals, register cornermen, and track fight-week clearance.
          </p>
        </div>

        {/* Fighter Switcher for Simulator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-500 uppercase">Simulate Fighter:</span>
          <select
            value={currentFighter.id}
            onChange={e => setSelectedFighterId(e.target.value)}
            className="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {fighters.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.readinessPercentage}% • {f.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulator Presentation Area: Centered Smartphone Mock */}
      <div className="flex items-center justify-center p-4 bg-neutral-100/60 rounded-3xl border border-neutral-200">
        {/* Smartphone Bezel */}
        <div className="w-full max-w-[390px] bg-neutral-950 rounded-[44px] p-3.5 shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700/50">
          {/* Dynamic Island / Notch */}
          <div className="w-28 h-5 bg-neutral-950 rounded-full mx-auto mb-2 flex items-center justify-center relative z-20">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 mr-2" />
            <div className="w-2 h-2 rounded-full bg-neutral-800" />
          </div>

          {/* Phone Screen Canvas */}
          <div className="bg-white rounded-[32px] overflow-hidden text-neutral-900 flex flex-col h-[740px] shadow-inner relative">
            {/* App Header */}
            <div className="bg-neutral-900 text-white p-4 pt-3 flex items-center justify-between border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs">
                  CW
                </div>
                <div>
                  <div className="text-xs font-black tracking-tight">CAGE WARRIORS</div>
                  <div className="text-[9px] text-neutral-400">Fighter Operations Portal</div>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-neutral-800 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                {currentEvent.title.split('—')[0]}
              </span>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
              {/* Fighter Matchup Card */}
              <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-3 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="font-bold uppercase tracking-wider text-red-400">{currentFighter.weightClass}</span>
                  <span className="font-mono">{currentEvent.date}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div>
                    <div className="text-sm font-black text-white">{currentFighter.name}</div>
                    <div className="text-[10px] text-neutral-400">Record: {currentFighter.record}</div>
                  </div>
                  <span className="text-xs font-black text-red-500 font-serif italic">VS</span>
                  <div className="text-right">
                    <div className="text-sm font-black text-neutral-200">{currentFighter.opponentName}</div>
                    <div className="text-[10px] text-neutral-400">Challenger</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400">Venue: {currentEvent.venue}</span>
                  <span className="text-neutral-300 font-medium">Manchester, UK</span>
                </div>
              </div>

              {/* Clearance Progress Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">Fight-Week Clearance</span>
                  <span className="text-xs font-mono font-extrabold text-neutral-950">
                    {currentFighter.readinessPercentage}%
                  </span>
                </div>
                <ProgressBar value={currentFighter.readinessPercentage} size="md" colorScheme="auto" />
                <div className="text-[10px] text-neutral-500 flex items-center justify-between pt-1">
                  <span>{currentFighter.status === 'READY' ? 'All Cleared' : `${currentFighter.missingItems.length} items pending`}</span>
                  <StatusBadge status={currentFighter.status} size="sm" />
                </div>
              </div>

              {/* 1-Tap Document Upload Action */}
              <button
                onClick={() => {
                  setUploadTargetFighterId(currentFighter.id);
                  setIsUploadModalOpen(true);
                }}
                className="w-full p-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Upload Medical / Passport</div>
                    <div className="text-[10px] text-red-100">AI auto-extracts & clears in seconds</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              {/* Requirements Checklist */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-1">
                  Your Clearance Checklist
                </div>

                <div className="space-y-1.5">
                  {currentFighter.requirements.slice(0, 6).map(req => (
                    <div 
                      key={req.id}
                      className="p-2.5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-neutral-900 truncate">
                          {req.title}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {req.category.toUpperCase()} • {req.required ? 'Mandatory' : 'Optional'}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {req.status === 'COMPLETE' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Upload</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner Passes Submission Card */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-neutral-900">Cornermen Passes (Max 3)</div>
                  <span className="text-[10px] font-mono text-neutral-500">{cornerPassNames.length}/3 Registered</span>
                </div>

                <div className="space-y-1">
                  {cornerPassNames.map((name, i) => (
                    <div key={i} className="p-2 bg-neutral-50 rounded-lg text-[11px] font-medium text-neutral-800 flex items-center gap-2">
                      <User className="w-3 h-3 text-neutral-500" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>

                {cornerPassNames.length < 3 && (
                  isAddingCorner ? (
                    <form onSubmit={handleAddCorner} className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Cornerman full name & role..."
                        value={newCornerName}
                        onChange={e => setNewCornerName(e.target.value)}
                        className="flex-1 text-[11px] px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1.5 bg-neutral-900 text-white rounded-lg text-[10px] font-bold"
                      >
                        Add
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsAddingCorner(true)}
                      className="w-full py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Register Cornerman</span>
                    </button>
                  )
                )}
              </div>

              {/* Help & Support Widget */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-bold text-neutral-900">Questions about weigh-in?</div>
                    <div className="text-[10px] text-neutral-500">24/7 AI Operations WhatsApp</div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Simulated opening WhatsApp chat with Cage Warriors Operations AI for ${currentFighter.name}`)}
                  className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg"
                >
                  Chat AI
                </button>
              </div>
            </div>

            {/* Bottom Nav Simulation */}
            <div className="p-3 bg-white border-t border-neutral-200 flex items-center justify-around text-[10px] font-bold text-neutral-500 shrink-0">
              <span className="text-red-600">Clearance</span>
              <span>Host Hotel</span>
              <span>Schedule</span>
              <span>Rules</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
