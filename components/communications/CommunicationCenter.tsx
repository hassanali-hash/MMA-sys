'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { 
  Search, Send, Sparkles, CheckCircle2, Clock, 
  AlertTriangle, Paperclip, FileText, Bot, 
  User, ShieldAlert, ArrowRight, Check, X, 
  Edit3, ExternalLink, ShieldCheck
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export const CommunicationCenter: React.FC = () => {
  const { 
    fighters, 
    selectedFighterId, 
    setSelectedFighterId, 
    chatMessages, 
    sendChatMessage,
    setCurrentTab,
    setSelectedDocumentId,
    escalateFighter
  } = useOperations();

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [draftContent, setDraftContent] = useState('');

  const currentFighter = fighters.find(f => f.id === selectedFighterId) || fighters[0];
  const messages = chatMessages[currentFighter.id] || [];

  // Filtered fighter list for inbox
  const filteredFighters = fighters.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.managerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active AI analysis context from the last AI-handled message
  const lastAnalyzedMessage = [...messages].reverse().find(m => m.aiAnalysis);
  const aiContext = lastAnalyzedMessage?.aiAnalysis;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(currentFighter.id, inputMessage, 'Staff');
    setInputMessage('');
  };

  const handleSimulateManagerReply = () => {
    sendChatMessage(
      currentFighter.id,
      `Hi Daniel, Carlos here. We have confirmed Marco's travel from Lisbon. Blood test sample was drawn this morning at Clinica Lisboa.`,
      'Manager'
    );
  };

  return (
    <div className="h-[calc(100vh-135px)] flex flex-col bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
      {/* 3-Column Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Fighter & Manager Inbox List */}
        <div className="w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/50 shrink-0">
          <div className="p-3.5 border-b border-neutral-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search athlete or manager..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 custom-scrollbar">
            {filteredFighters.map(fighter => {
              const isSelected = fighter.id === currentFighter.id;
              const fMessages = chatMessages[fighter.id] || [];
              const lastMsg = fMessages[fMessages.length - 1];

              return (
                <div
                  key={fighter.id}
                  onClick={() => setSelectedFighterId(fighter.id)}
                  className={`p-3.5 cursor-pointer transition-colors text-left ${
                    isSelected ? 'bg-white border-l-4 border-red-600 shadow-2xs' : 'hover:bg-neutral-100/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-xs text-neutral-900 truncate">
                      {fighter.name}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                      {lastMsg ? lastMsg.timestamp.split('-')[1]?.trim() || fighter.lastContact : fighter.lastContact}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">
                    Manager: {fighter.managerName} ({fighter.country})
                  </div>

                  <p className="text-[11px] text-neutral-600 truncate mt-1">
                    {lastMsg ? lastMsg.content : fighter.aiStatus}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-neutral-200/40 text-[10px]">
                    <span className="font-mono font-bold text-neutral-700">
                      {fighter.readinessPercentage}% Ready
                    </span>
                    <StatusBadge status={fighter.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Chat Thread & Composer */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Thread Header */}
          <div className="px-5 py-3 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {currentFighter.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-neutral-950">{currentFighter.name}</h2>
                  <span className="text-xs text-neutral-500 font-medium">• Manager: {currentFighter.managerName}</span>
                </div>
                <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                  <span>{currentFighter.fighterPhone}</span>
                  <span>•</span>
                  <span>{currentFighter.weightClass}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">WhatsApp & Portal Gateway Connected</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateManagerReply}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg border border-neutral-200 transition-colors"
                title="Simulate manager sending a response to trigger AI parser"
              >
                + Sim Manager Reply
              </button>
              <StatusBadge status={currentFighter.status} size="sm" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-neutral-50/40 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <Bot className="w-10 h-10 text-neutral-300 mb-2" />
                <div className="text-xs font-bold text-neutral-700">No message history yet</div>
                <div className="text-[11px] max-w-xs mt-1">
                  Start a conversation with {currentFighter.managerName} or run the AI Demo to simulate incoming documents.
                </div>
              </div>
            ) : (
              messages.map(msg => {
                const isAI = msg.senderRole === 'AI';
                const isStaff = msg.senderRole === 'Staff';
                const isManagerOrFighter = msg.senderRole === 'Manager' || msg.senderRole === 'Fighter';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isManagerOrFighter ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-neutral-400">
                      <span className="font-semibold text-neutral-700">{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isAI
                          ? 'bg-neutral-900 text-white rounded-br-xs border border-neutral-800'
                          : isStaff
                          ? 'bg-red-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>

                      {/* Attachments chip */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-neutral-200/40 space-y-1.5">
                          {msg.attachments.map(att => (
                            <div
                              key={att.id}
                              onClick={() => {
                                if (att.documentId) {
                                  setSelectedDocumentId(att.documentId);
                                  setCurrentTab('documents');
                                }
                              }}
                              className="flex items-center justify-between p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Paperclip className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                                <span className="font-bold truncate">{att.name}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">({att.size})</span>
                              </div>
                              <span className="text-[10px] text-red-600 font-bold ml-2">Inspect</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Pre-filled Action Prompts */}
          <div className="px-4 py-2 bg-neutral-100/70 border-t border-neutral-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">
              AI Templates:
            </span>
            <button
              onClick={() => setInputMessage(`Hi ${currentFighter.managerName}, please send the certified blood test results (HIV, Hep B, Hep C) for ${currentFighter.name} to complete UKAD clearance.`)}
              className="px-2.5 py-1 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-md font-medium whitespace-nowrap"
            >
              Request Blood Test
            </button>
            <button
              onClick={() => setInputMessage(`Hi ${currentFighter.managerName}, we need ${currentFighter.name}'s flight booking confirmation number into Manchester Airport (MAN) to arrange host hotel airport shuttles.`)}
              className="px-2.5 py-1 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-md font-medium whitespace-nowrap"
            >
              Request Flight Itinerary
            </button>
            <button
              onClick={() => setInputMessage(`Hi ${currentFighter.managerName}, please confirm arrival time for official morning weigh-ins at Radisson Blu Manchester Airport (Oct 23, 10:00 AM).`)}
              className="px-2.5 py-1 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-md font-medium whitespace-nowrap"
            >
              Weigh-in Protocol
            </button>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-neutral-200 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message ${currentFighter.managerName} (${currentFighter.name})...`}
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right Column: AI Interpretation & Context Panel */}
        <div className="w-84 border-l border-neutral-200 bg-white flex flex-col shrink-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                AI Interpretation & Context
              </h3>
            </div>
            {aiContext?.confidence && (
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                {aiContext.confidence}% Conf
              </span>
            )}
          </div>

          {/* AI Extraction Summary Card */}
          {aiContext ? (
            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Detected Intent & Fields
                </div>
                <div className="font-bold text-neutral-900">{aiContext.intent}</div>
                <div className="space-y-1 pt-1 border-t border-neutral-200/60 font-mono text-[11px]">
                  {Object.entries(aiContext.detectedFields).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-neutral-500">{k}:</span>
                      <span className="font-bold text-neutral-900">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Taken Card */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Autonomous Actions Executed</span>
                </div>
                <ul className="space-y-1 text-[11px] text-emerald-900 list-disc list-inside">
                  {aiContext.actionsTaken.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              {/* Next Scheduled Action */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Scheduled Next Step</span>
                </div>
                <p className="text-[11px] text-neutral-700 leading-relaxed">
                  {aiContext.nextAction}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-500 text-center">
              No recent AI analysis required for this thread. AI actively monitors incoming attachments and messages.
            </div>
          )}

          {/* MVP Controls: Requires Human Approval Toggle & Action Buttons */}
          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <div className="text-xs font-bold text-neutral-900">Requires Approval</div>
                <div className="text-[10px] text-neutral-500">Hold outgoing AI drafts for staff</div>
              </div>
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={e => setRequiresApproval(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => {
                  sendChatMessage(currentFighter.id, "Follow-up reminder sent directly by operations manager.", 'Staff');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Send Latest Draft</span>
              </button>

              <button
                onClick={() => escalateFighter(currentFighter.id, 'Staff requested manual escalation from communication center')}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Escalate Thread to Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
