'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { 
  Cpu, Sparkles, Activity, CheckCircle2, Clock, 
  AlertTriangle, Filter, Calendar, Zap, ShieldCheck, 
  ArrowUpRight, Play, RefreshCw, FileText, MessageSquare 
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export const AIOperationsCenter: React.FC = () => {
  const { 
    aiActivities, 
    startAIDemo, 
    isDemoRunning, 
    setSelectedFighterId, 
    setCurrentTab 
  } = useOperations();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DOCS' | 'MESSAGES' | 'ESCALATIONS'>('ALL');

  const filteredActivities = aiActivities.filter(item => {
    if (activeFilter === 'DOCS') return item.type === 'DOCUMENT_PROCESSED';
    if (activeFilter === 'MESSAGES') return item.type === 'MESSAGE_INTERPRETED' || item.type === 'REMINDER_SCHEDULED';
    if (activeFilter === 'ESCALATIONS') return item.type === 'ESCALATED';
    return true;
  });

  const processingCards = [
    {
      id: 'proc-1',
      title: 'Reviewing Passport OCR & MRZ Checksum',
      subject: 'Marco Silva (Lightweight)',
      source: 'Marco_Silva_Passport.pdf',
      status: 'Active OCR Analysis',
      progress: 92,
      confidence: '98.4%',
      badge: 'Vision & MRZ'
    },
    {
      id: 'proc-2',
      title: 'Interpreting Manager Inbound Message',
      subject: 'Carlos Silva (Manager)',
      source: 'WhatsApp Gateway #CW-991',
      status: 'Extracting Origin City & Dates',
      progress: 84,
      confidence: '96.2%',
      badge: 'NLP Extraction'
    },
    {
      id: 'proc-3',
      title: 'Verifying Blood Serology Lab Panels',
      subject: 'Ana Rodrigues (Flyweight)',
      source: 'Ana_Rodrigues_Blood_Panel_LabCorp.pdf',
      status: 'Cross-referencing UKAD standard',
      progress: 99,
      confidence: '97.0%',
      badge: 'Medical Rules'
    },
    {
      id: 'proc-4',
      title: 'Preparing Automated 48h Follow-up',
      subject: 'James Keller (Light Heavyweight)',
      source: 'Missing MRI Protocol Rule #2',
      status: 'Drafting WhatsApp reminder',
      progress: 68,
      confidence: '98.0%',
      badge: 'Chaser Sequence'
    }
  ];

  const upcomingActions = [
    {
      id: 'up-1',
      time: 'Tomorrow at 09:00 AM',
      target: 'James Keller (Manager: Hans Becker)',
      action: 'Send Stage-2 reminder for missing cranial MRI radiology report',
      channel: 'WhatsApp & Email',
      rule: 'Rule #1: 48h Missing Document Trigger'
    },
    {
      id: 'up-2',
      time: 'Tomorrow at 11:30 AM',
      target: 'Ana Rodrigues (Manager: Marcos De Souza)',
      action: 'Request confirmed flight ticket number into Manchester (MAN)',
      channel: 'WhatsApp',
      rule: 'Rule #4: Travel Logistics Window'
    },
    {
      id: 'up-3',
      time: 'Oct 16 at 09:00 AM',
      target: 'Marco Silva (Manager: Carlos Silva)',
      action: 'Check Lisbon clinic lab status for blood serology panel',
      channel: 'WhatsApp',
      rule: 'Autonomous Follow-up Sequence'
    },
    {
      id: 'up-4',
      time: 'Oct 16 at 02:00 PM',
      target: 'Matteo Rossi (Manager: Giuseppe Moretti)',
      action: 'Send reminder for flight booking departure confirmation',
      channel: 'Email',
      rule: 'Travel Logistics Window'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md border border-neutral-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                Live Engine
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Cage Warriors Operations AI Agent • Version 2.4.0
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-red-500" />
              <span>AI Operations Control Center</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Real-time autonomous monitoring, OCR classification, requirement matching, NLP conversation parsing, and proactive fighter chasing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startAIDemo}
              disabled={isDemoRunning}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isDemoRunning ? 'Executing Demo Cycle...' : 'Run Autonomous Demo Cycle'}</span>
            </button>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-neutral-800 text-xs">
          <div>
            <div className="text-neutral-400 text-[11px]">Autonomous Clearance Rate</div>
            <div className="text-lg font-bold font-mono text-emerald-400">87.5%</div>
            <div className="text-[10px] text-neutral-500">21 of 24 fighters self-served</div>
          </div>
          <div>
            <div className="text-neutral-400 text-[11px]">Vision & OCR Accuracy</div>
            <div className="text-lg font-bold font-mono text-white">99.4%</div>
            <div className="text-[10px] text-neutral-500">58 documents processed</div>
          </div>
          <div>
            <div className="text-neutral-400 text-[11px]">Average Response Latency</div>
            <div className="text-lg font-bold font-mono text-sky-400">1.8s</div>
            <div className="text-[10px] text-neutral-500">Document to status update</div>
          </div>
          <div>
            <div className="text-neutral-400 text-[11px]">Human Review Escalation</div>
            <div className="text-lg font-bold font-mono text-rose-400">3 Cases</div>
            <div className="text-[10px] text-neutral-500">Safely flagged for staff review</div>
          </div>
        </div>
      </div>

      {/* Processing Now Live Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-600 animate-pulse" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Processing Now (Live Pipeline)
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">4 active background workers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processingCards.map(card => (
            <div
              key={card.id}
              className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 rounded-md">
                    {card.badge}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    {card.confidence}
                  </span>
                </div>
                <div className="text-xs font-bold text-neutral-900 line-clamp-2">
                  {card.title}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1 font-medium">
                  {card.subject}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5 truncate font-mono">
                  {card.source}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-neutral-600 font-medium">{card.status}</span>
                  <span className="font-mono font-bold text-neutral-900">{card.progress}%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-red-600 h-1.5 rounded-full transition-all duration-1000 animate-pulse"
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Live Activity Stream + Upcoming AI Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chronological Feed */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-sm font-bold text-neutral-950">
                Autonomous AI Operations Feed
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every classified document, message interpretation, and status change executed by AI.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeFilter === 'ALL' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('DOCS')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeFilter === 'DOCS' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveFilter('MESSAGES')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeFilter === 'MESSAGES' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Communications
              </button>
              <button
                onClick={() => setActiveFilter('ESCALATIONS')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeFilter === 'ESCALATIONS' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Escalations
              </button>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 mt-2">
            {filteredActivities.map(activity => (
              <div 
                key={activity.id}
                onClick={() => {
                  if (activity.fighterId) {
                    setSelectedFighterId(activity.fighterId);
                    setCurrentTab('fighters');
                  }
                }}
                className="py-3.5 hover:bg-neutral-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                      {activity.type === 'DOCUMENT_PROCESSED' && <FileText className="w-4 h-4" />}
                      {activity.type === 'MESSAGE_INTERPRETED' && <MessageSquare className="w-4 h-4" />}
                      {activity.type === 'REQUIREMENT_UPDATED' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {activity.type === 'ESCALATED' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                      {activity.type === 'REMINDER_SCHEDULED' && <Clock className="w-4 h-4 text-amber-600" />}
                      {activity.type === 'TRAVEL_DETECTED' && <Sparkles className="w-4 h-4 text-sky-600" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-neutral-950 group-hover:text-red-600 transition-colors">
                          {activity.actionTitle}
                        </span>
                        {activity.fighterName && (
                          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                            {activity.fighterName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {activity.details}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-neutral-700">{activity.timestamp}</div>
                    {activity.confidence && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded mt-1 inline-block">
                        {activity.confidence}% conf
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Upcoming Scheduled AI Actions */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Calendar className="w-4 h-4 text-neutral-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Upcoming AI Outreach Queue
              </h3>
            </div>

            <div className="space-y-3.5 mt-4">
              {upcomingActions.map(action => (
                <div 
                  key={action.id}
                  className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-mono">
                      {action.time}
                    </span>
                    <span className="text-neutral-500">{action.channel}</span>
                  </div>
                  <div className="font-bold text-neutral-900">
                    {action.target}
                  </div>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">
                    {action.action}
                  </p>
                  <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-200/60 font-mono">
                    {action.rule}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Autonomous Guardrails Active</span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-1">
              Actions trigger according to the Event Configuration rules. All escalations and edge cases stop for human approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
