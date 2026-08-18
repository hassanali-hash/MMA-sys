'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { 
  CheckSquare, Sparkles, Send, Edit3, X, 
  ShieldAlert, Check, Clock, MessageSquare, AlertCircle
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export const ApprovalQueue: React.FC = () => {
  const { 
    pendingApprovals, 
    approvePendingMessage, 
    rejectPendingMessage,
    escalateFighter,
    setCurrentTab,
    setSelectedFighterId
  } = useOperations();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  const startEdit = (id: string, initialText: string) => {
    setEditingId(id);
    setEditedContent(initialText);
  };

  const saveAndApprove = (id: string) => {
    approvePendingMessage(id, editedContent);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-600" />
              <span>AI Message Approval Workflow</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {pendingApprovals.length} Pending
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Human-in-the-loop review queue for autonomous communications before external dispatch.
          </p>
        </div>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-400">
          <Sparkles className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-800">All AI Messages Approved</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            There are currently no queued outgoing fighter outreach messages awaiting staff verification.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingApprovals.map(approval => {
            const isEditing = editingId === approval.id;

            return (
              <div
                key={approval.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs hover:border-neutral-300 transition-all space-y-4"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {approval.fighterName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-neutral-950">{approval.fighterName}</span>
                        <span className="text-xs text-neutral-500 font-medium">
                          (Manager: {approval.managerName})
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-neutral-700">Channel: {approval.channel}</span>
                        <span>•</span>
                        <span className="font-mono">{approval.recipientContact}</span>
                        <span>•</span>
                        <span>{approval.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      Confidence {approval.confidence}%
                    </span>
                    <StatusBadge status="PENDING" size="sm" />
                  </div>
                </div>

                {/* AI Reason & Trigger */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      AI Generation Trigger
                    </div>
                    <div className="font-semibold text-neutral-900 mt-0.5">{approval.triggerEvent}</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      AI Strategic Reason
                    </div>
                    <div className="font-semibold text-neutral-900 mt-0.5">{approval.aiReason}</div>
                  </div>
                </div>

                {/* Missing items highlighted */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-neutral-500 font-medium text-[11px]">Requirements Highlighted:</span>
                  {approval.missingRequirementsHighlighted.map((req, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-medium">
                      {req}
                    </span>
                  ))}
                </div>

                {/* Message Body (Editable or Viewable) */}
                <div className="p-4 bg-neutral-900 text-white rounded-xl text-xs space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Proposed Message Draft</span>
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={5}
                      value={editedContent}
                      onChange={e => setEditedContent(e.target.value)}
                      className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <p className="whitespace-pre-line text-neutral-100 leading-relaxed font-sans">
                      {approval.proposedMessage}
                    </p>
                  )}
                </div>

                {/* Bottom Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFighterId(approval.fighterId);
                        setCurrentTab('communications');
                      }}
                      className="text-xs text-neutral-600 hover:text-neutral-900 font-semibold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View Message History</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveAndApprove(approval.id)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save & Dispatch</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(approval.id, approval.proposedMessage)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Edit Draft</span>
                        </button>

                        <button
                          onClick={() => rejectPendingMessage(approval.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => approvePendingMessage(approval.id)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Approve & Send</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
