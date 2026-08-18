'use client';

import React from 'react';
import { useOperations } from '@/context/OperationsContext';
import { mockEvents } from '@/data/mockData';
import { 
  Calendar, MapPin, Trophy, Users, CheckCircle2, 
  Clock, AlertTriangle, ShieldCheck, ArrowRight, 
  Tv, Award, Hotel, ChevronRight 
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProgressBar } from '@/components/common/ProgressBar';

export const EventHub: React.FC = () => {
  const { 
    currentEvent, 
    setSelectedEventId, 
    fighters, 
    setCurrentTab, 
    setSelectedFighterId 
  } = useOperations();

  // Create matchups by pairing fighters
  const matchups = [
    {
      boutType: 'MAIN EVENT • CW WORLD LIGHTWEIGHT CHAMPIONSHIP',
      fighterA: fighters.find(f => f.name === 'Marco Silva') || fighters[0],
      fighterB: fighters.find(f => f.name === 'Liam Carter') || fighters[1],
      isTitle: true
    },
    {
      boutType: 'CO-MAIN EVENT • WELTERWEIGHT DIVISION',
      fighterA: fighters.find(f => f.name === 'Nathan Cole') || fighters[2],
      fighterB: fighters.find(f => f.name === 'Tariq Vance') || fighters[3],
      isTitle: false
    },
    {
      boutType: 'MAIN CARD • FLYWEIGHT DIVISION',
      fighterA: fighters.find(f => f.name === 'Ana Rodrigues') || fighters[4],
      fighterB: fighters.find(f => f.name === 'Elena Rostov') || fighters[5],
      isTitle: false
    },
    {
      boutType: 'MAIN CARD • LIGHT HEAVYWEIGHT DIVISION',
      fighterA: fighters.find(f => f.name === 'James Keller') || fighters[6],
      fighterB: fighters.find(f => f.name === 'Damian Cross') || fighters[7],
      isTitle: false
    },
    {
      boutType: 'PRELIMS • FEATHERWEIGHT DIVISION',
      fighterA: fighters.find(f => f.name === 'Matteo Rossi') || fighters[8],
      fighterB: fighters.find(f => f.name === 'Kalle Niemi') || fighters[9],
      isTitle: false
    }
  ];

  const milestones = [
    { title: 'Bout Agreements Confirmed', date: 'Oct 01, 2026', status: 'COMPLETE' },
    { title: 'Regulatory Medical Exam Cutoff', date: 'Oct 14, 2026', status: 'ACTIVE' },
    { title: 'Travel & Flight Itinerary Confirmation', date: 'Oct 18, 2026', status: 'UPCOMING' },
    { title: 'Fighter Check-in & Host Hotel Arrival', date: 'Oct 22, 2026', status: 'UPCOMING' },
    { title: 'Official Morning Weigh-ins', date: 'Oct 23, 2026 (10:00 AM)', status: 'UPCOMING' },
    { title: 'Fight Night & Broadcast Live', date: 'Oct 24, 2026 (18:00 BST)', status: 'UPCOMING' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Event Selector & Overview Hero */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md border border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white rounded-full">
                Active Operations Hub
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Sanctioned by Safe MMA & UK Athletics
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {currentEvent.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 mt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-500" />
                <span>{currentEvent.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{currentEvent.venue}, {currentEvent.city}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-neutral-400" />
                <span>Weigh-ins: {currentEvent.weighInDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Hotel className="w-4 h-4 text-neutral-400" />
                <span>Arrival: {currentEvent.athleteArrivalDeadline}</span>
              </div>
            </div>
          </div>

          {/* Event Switcher */}
          <div className="flex items-center gap-2 bg-neutral-800 p-1.5 rounded-xl border border-neutral-700">
            <span className="text-xs text-neutral-400 px-2 font-bold uppercase">Switch Event:</span>
            {mockEvents.map(evt => (
              <button
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  evt.id === currentEvent.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {evt.title.split('—')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fight Card Matchups & Clearance Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-red-600" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Fight Card Matchup Readiness Matrix (12 Bouts)
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">Both fighters must reach 100% for bout greenlight</span>
        </div>

        <div className="space-y-3">
          {matchups.map((matchup, idx) => {
            const fA = matchup.fighterA;
            const fB = matchup.fighterB;
            const boutReady = fA.status === 'READY' && fB.status === 'READY';

            return (
              <div 
                key={idx}
                className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs hover:border-neutral-300 transition-all space-y-3"
              >
                {/* Bout Title Strip */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold tracking-wider uppercase text-[11px] ${
                      matchup.isTitle ? 'text-red-700 font-extrabold' : 'text-neutral-600'
                    }`}>
                      {matchup.boutType}
                    </span>
                    {matchup.isTitle && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.2 rounded-full">
                        Title Bout
                      </span>
                    )}
                  </div>

                  <div>
                    {boutReady ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Bout Cleared</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Clearance Incomplete</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 2-Fighter Side-by-Side Arena */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Corner A (Red) */}
                  <div 
                    onClick={() => {
                      setSelectedFighterId(fA.id);
                      setCurrentTab('fighters');
                    }}
                    className="p-3 bg-neutral-50 hover:bg-red-50/40 border border-neutral-200 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {fA.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-neutral-900 group-hover:text-red-600 transition-colors truncate">
                          {fA.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          {fA.country} • Manager: {fA.managerName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-neutral-900">{fA.readinessPercentage}%</div>
                        <div className="w-16"><ProgressBar value={fA.readinessPercentage} size="sm" colorScheme="auto" /></div>
                      </div>
                      <StatusBadge status={fA.status} size="sm" />
                    </div>
                  </div>

                  {/* Corner B (Blue) */}
                  <div 
                    onClick={() => {
                      setSelectedFighterId(fB.id);
                      setCurrentTab('fighters');
                    }}
                    className="p-3 bg-neutral-50 hover:bg-blue-50/40 border border-neutral-200 rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {fB.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-neutral-900 group-hover:text-blue-600 transition-colors truncate">
                          {fB.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          {fB.country} • Manager: {fB.managerName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-neutral-900">{fB.readinessPercentage}%</div>
                        <div className="w-16"><ProgressBar value={fB.readinessPercentage} size="sm" colorScheme="auto" /></div>
                      </div>
                      <StatusBadge status={fB.status} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fight Week Operational Milestones */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-700" />
          <span>Operational Milestones & Regulatory Cutoffs</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.map((m, idx) => (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                m.status === 'COMPLETE' 
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : m.status === 'ACTIVE'
                  ? 'bg-amber-50/50 border-amber-300 text-amber-950 ring-2 ring-amber-400/20'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                <span className="font-mono">{m.date}</span>
                <span className={`px-1.5 py-0.2 rounded ${
                  m.status === 'COMPLETE' ? 'bg-emerald-200 text-emerald-800' :
                  m.status === 'ACTIVE' ? 'bg-amber-200 text-amber-900' :
                  'bg-neutral-200 text-neutral-600'
                }`}>
                  {m.status}
                </span>
              </div>
              <div className="font-bold text-neutral-900">{m.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
