'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Fighter, DocumentItem, ChatMessage, PendingAIApproval, HumanReviewCase, 
  AIActivityItem, AuditLogItem, MMAEvent, KnowledgeItem, AutomationRule, RequirementItem, RequirementStatus 
} from '@/types';
import { 
  mockEvents, mockFighters, mockDocuments, mockChatMessages, 
  mockPendingApprovals, mockHumanReviewCases, mockAIActivities, 
  mockAuditLogs, mockKnowledgeBase, mockAutomationRules 
} from '@/data/mockData';

export type NavigationTab = 
  | 'overview' 
  | 'events' 
  | 'fighters' 
  | 'ai-ops' 
  | 'human-review' 
  | 'approvals'
  | 'communications' 
  | 'documents' 
  | 'activity-log' 
  | 'event-config' 
  | 'automation-rules' 
  | 'knowledge-base' 
  | 'fighter-portal';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  timestamp: string;
  read: boolean;
  linkTab?: NavigationTab;
  linkFighterId?: string;
}

export interface DemoStepState {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  stepDescription: string;
  active: boolean;
  completed: boolean;
}

interface OperationsContextType {
  // Navigation & View state
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  currentEvent: MMAEvent;
  
  // Fighters & Detail
  fighters: Fighter[];
  selectedFighterId: string | null;
  setSelectedFighterId: (id: string | null) => void;
  selectedFighter: Fighter | null;
  updateFighterRequirement: (fighterId: string, requirementId: string, status: RequirementStatus, notes?: string) => void;
  escalateFighter: (fighterId: string, reason: string) => void;
  recalculateFighterReadiness: (fighterId: string) => void;

  // Documents
  documents: DocumentItem[];
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  selectedDocument: DocumentItem | null;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => Promise<DocumentItem>;
  updateDocumentStatus: (docId: string, status: DocumentItem['verificationStatus'], flagReason?: string) => void;

  // Communications & AI Approvals
  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (fighterId: string, content: string, senderRole?: 'Staff' | 'Manager' | 'Fighter') => void;
  pendingApprovals: PendingAIApproval[];
  approvePendingMessage: (approvalId: string, customMessage?: string) => void;
  rejectPendingMessage: (approvalId: string, reason?: string) => void;

  // Human Review Queue
  humanReviewCases: HumanReviewCase[];
  resolveHumanReviewCase: (caseId: string, resolution: 'VALID' | 'INVALID' | 'RESOLVED', notes?: string) => void;

  // AI Center & Audit
  aiActivities: AIActivityItem[];
  auditLogs: AuditLogItem[];
  addAuditLog: (entry: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
  addAIActivity: (activity: Omit<AIActivityItem, 'id' | 'timestamp'>) => void;

  // Rules & Config
  automationRules: AutomationRule[];
  toggleAutomationRule: (ruleId: string) => void;
  knowledgeBase: KnowledgeItem[];
  askKnowledgeBase: (query: string) => Promise<{ answer: string; sources: KnowledgeItem[]; confidence: number }>;

  // Modals & UI Controls
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  uploadTargetFighterId: string | null;
  setUploadTargetFighterId: (id: string | null) => void;

  // Notifications
  notifications: ToastNotification[];
  unreadNotificationCount: number;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<ToastNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Demo Runner
  isDemoRunning: boolean;
  demoState: DemoStepState;
  startAIDemo: () => void;
  resetToDefaultData: () => void;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mma_fighter_ops_state_v1';

export const OperationsProvider = ({ children }: { children: ReactNode }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [selectedEventId, setSelectedEventId] = useState<string>('cw-198');
  const [fighters, setFighters] = useState<Fighter[]>(mockFighters);
  const [selectedFighterId, setSelectedFighterId] = useState<string | null>('ft-1');
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(mockChatMessages);
  const [pendingApprovals, setPendingApprovals] = useState<PendingAIApproval[]>(mockPendingApprovals);
  const [humanReviewCases, setHumanReviewCases] = useState<HumanReviewCase[]>(mockHumanReviewCases);
  const [aiActivities, setAiActivities] = useState<AIActivityItem[]>(mockAIActivities);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [knowledgeBase] = useState<KnowledgeItem[]>(mockKnowledgeBase);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetFighterId, setUploadTargetFighterId] = useState<string | null>('ft-1');

  // Notifications
  const [notifications, setNotifications] = useState<ToastNotification[]>([
    {
      id: 'notif-1',
      title: 'Passport Verified',
      message: 'AI extracted and verified passport for Marco Silva (98% confidence).',
      type: 'ai',
      timestamp: '10:32 AM',
      read: false,
      linkTab: 'fighters',
      linkFighterId: 'ft-1'
    },
    {
      id: 'notif-2',
      title: 'Human Review Required',
      message: 'Nathan Cole medical certificate date requires manual confirmation.',
      type: 'warning',
      timestamp: '10:00 AM',
      read: false,
      linkTab: 'human-review'
    },
    {
      id: 'notif-3',
      title: 'Fighter Ready',
      message: 'Liam Carter has satisfied all 18 requirements and is READY FOR EVENT.',
      type: 'success',
      timestamp: '09:12 AM',
      read: false,
      linkTab: 'fighters',
      linkFighterId: 'ft-2'
    }
  ]);

  // Demo Runner State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoState, setDemoState] = useState<DemoStepState>({
    currentStep: 0,
    totalSteps: 10,
    stepName: 'Ready',
    stepDescription: 'Click Run AI Demo to experience autonomous operations.',
    active: false,
    completed: false
  });

  // Current active event
  const currentEvent = mockEvents.find(e => e.id === selectedEventId) || mockEvents[0];
  const selectedFighter = fighters.find(f => f.id === selectedFighterId) || fighters[0] || null;
  const selectedDocument = documents.find(d => d.id === selectedDocumentId) || null;

  // Add Notification
  const addNotification = useCallback((notif: Omit<ToastNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: ToastNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Add Audit Log
  const addAuditLog = useCallback((entry: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const newLog: AuditLogItem = {
      ...entry,
      id: 'aud-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  // Add AI Activity
  const addAIActivity = useCallback((activity: Omit<AIActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: AIActivityItem = {
      ...activity,
      id: 'act-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLive: true
    };
    setAiActivities(prev => [newActivity, ...prev]);
  }, []);

  // Recalculate Fighter Readiness %
  const recalculateFighterReadiness = useCallback((fighterId: string) => {
    setFighters(prev => prev.map(fighter => {
      if (fighter.id !== fighterId) return fighter;

      const reqs = fighter.requirements;
      const requiredItems = reqs.filter(r => r.required);
      const completedRequired = requiredItems.filter(r => r.status === 'COMPLETE');
      
      const percentage = requiredItems.length > 0 
        ? Math.round((completedRequired.length / requiredItems.length) * 100) 
        : 100;

      const missing = requiredItems
        .filter(r => r.status !== 'COMPLETE')
        .map(r => r.title.replace(/\(.*\)/, '').trim());

      let newStatus: Fighter['status'] = fighter.status;
      if (percentage === 100) {
        newStatus = 'READY';
      } else if (reqs.some(r => r.status === 'ACTION_REQUIRED' || r.status === 'UNDER_REVIEW')) {
        newStatus = 'HUMAN_ACTION';
      } else {
        newStatus = 'WAITING';
      }

      return {
        ...fighter,
        readinessPercentage: percentage,
        status: newStatus,
        missingItems: missing
      };
    }));
  }, []);

  // Update Fighter Requirement
  const updateFighterRequirement = useCallback((fighterId: string, requirementId: string, status: RequirementStatus, notes?: string) => {
    setFighters(prev => prev.map(f => {
      if (f.id !== fighterId) return f;

      const updatedReqs = f.requirements.map(req => {
        if (req.id === requirementId) {
          return {
            ...req,
            status,
            completedAt: status === 'COMPLETE' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
            verifiedBy: status === 'COMPLETE' ? ('HUMAN' as const) : req.verifiedBy,
            notes: notes !== undefined ? notes : req.notes
          };
        }
        return req;
      });

      const requiredItems = updatedReqs.filter(r => r.required);
      const completedCount = requiredItems.filter(r => r.status === 'COMPLETE').length;
      const pct = Math.round((completedCount / requiredItems.length) * 100);

      const missing = requiredItems
        .filter(r => r.status !== 'COMPLETE')
        .map(r => r.title.replace(/\(.*\)/, '').trim());

      const newStatus = pct === 100 ? 'READY' : updatedReqs.some(r => r.status === 'ACTION_REQUIRED' || r.status === 'UNDER_REVIEW') ? 'HUMAN_ACTION' : 'WAITING';

      return {
        ...f,
        requirements: updatedReqs,
        readinessPercentage: pct,
        status: newStatus,
        missingItems: missing
      };
    }));

    const fighter = fighters.find(f => f.id === fighterId);
    if (fighter) {
      addAuditLog({
        fighterId,
        fighterName: fighter.name,
        actor: 'Operations Staff',
        action: `Manual Requirement Update: ${requirementId}`,
        previousState: 'Modified',
        newState: status,
        confidence: 100
      });
    }
  }, [fighters, addAuditLog]);

  // Escalate Fighter to Human Action
  const escalateFighter = useCallback((fighterId: string, reason: string) => {
    const fighter = fighters.find(f => f.id === fighterId);
    if (!fighter) return;

    setFighters(prev => prev.map(f => f.id === fighterId ? { ...f, status: 'HUMAN_ACTION', aiStatus: `Escalated: ${reason}` } : f));

    const newCase: HumanReviewCase = {
      id: 'rev-' + Date.now(),
      fighterId,
      fighterName: fighter.name,
      weightClass: fighter.weightClass,
      priority: 'HIGH',
      title: `Manual Escalation: ${reason}`,
      category: 'Eligibility',
      reason,
      aiConfidence: 100,
      detectedValues: { 'Escalated By': 'Operations Staff' },
      aiRecommendation: 'Review athlete documentation with matchmaker & operations lead.',
      createdAt: 'Just now',
      status: 'OPEN'
    };

    setHumanReviewCases(prev => [newCase, ...prev]);

    addNotification({
      title: 'Fighter Escalated',
      message: `${fighter.name} was escalated to Human Review Queue: ${reason}`,
      type: 'warning',
      linkTab: 'human-review'
    });

    addAuditLog({
      fighterId,
      fighterName: fighter.name,
      actor: 'Operations Staff',
      action: 'Escalated to Human Review',
      previousState: fighter.status,
      newState: 'HUMAN_ACTION'
    });
  }, [fighters, addNotification, addAuditLog]);

  // Add Document
  const addDocument = useCallback(async (docData: Omit<DocumentItem, 'id' | 'uploadDate'>): Promise<DocumentItem> => {
    const newDoc: DocumentItem = {
      ...docData,
      id: 'doc-' + Date.now(),
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setDocuments(prev => [newDoc, ...prev]);

    addAIActivity({
      fighterId: docData.fighterId,
      fighterName: docData.fighterName,
      actionTitle: `Document Received: ${docData.fileName}`,
      details: `AI classified as ${docData.category.toUpperCase()} with ${docData.aiConfidence}% confidence.`,
      type: 'DOCUMENT_PROCESSED',
      confidence: docData.aiConfidence,
      actor: 'AI Agent'
    });

    addAuditLog({
      fighterId: docData.fighterId,
      fighterName: docData.fighterName,
      actor: docData.uploaderRole === 'Manager' ? 'Manager' : docData.uploaderRole === 'Fighter' ? 'Fighter' : 'Operations Staff',
      action: `Uploaded ${docData.title}`,
      previousState: 'Missing',
      newState: docData.verificationStatus,
      confidence: docData.aiConfidence
    });

    return newDoc;
  }, [addAIActivity, addAuditLog]);

  // Update Document Status
  const updateDocumentStatus = useCallback((docId: string, status: DocumentItem['verificationStatus'], flagReason?: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      return {
        ...d,
        verificationStatus: status,
        flagReason: flagReason || d.flagReason
      };
    }));
  }, []);

  // Send Chat Message with Simulated AI reaction
  const sendChatMessage = useCallback((fighterId: string, content: string, senderRole: 'Staff' | 'Manager' | 'Fighter' = 'Staff') => {
    const fighter = fighters.find(f => f.id === fighterId);
    const fighterName = fighter ? fighter.name : 'Athlete';

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      fighterId,
      senderName: senderRole === 'Staff' ? 'Daniel Morgan (Operations)' : senderRole === 'Manager' ? `${fighter?.managerName || 'Manager'}` : fighterName,
      senderRole,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' - ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content
    };

    setChatMessages(prev => ({
      ...prev,
      [fighterId]: [...(prev[fighterId] || []), newMsg]
    }));

    addAuditLog({
      fighterId,
      fighterName,
      actor: senderRole === 'Staff' ? 'Operations Staff' : senderRole === 'Manager' ? 'Manager' : 'Fighter',
      action: `Sent message in communication channel`,
      previousState: 'Active',
      newState: 'Message logged'
    });

    // If message comes from manager or fighter, simulate autonomous AI interpretation
    if (senderRole === 'Manager' || senderRole === 'Fighter') {
      setTimeout(() => {
        const lower = content.toLowerCase();
        let extractedCity = '';
        if (lower.includes('lisbon') || lower.includes('lisboa')) extractedCity = 'Lisbon (LIS)';
        if (lower.includes('london')) extractedCity = 'London (LHR)';
        if (lower.includes('dublin')) extractedCity = 'Dublin (DUB)';
        if (lower.includes('paris')) extractedCity = 'Paris (CDG)';

        const isBloodMention = lower.includes('blood') || lower.includes('serology') || lower.includes('lab');

        const aiReplyContent = `Thank you ${senderRole === 'Manager' ? fighter?.managerName || 'Manager' : fighterName}. ${extractedCity ? `Departure city (${extractedCity}) has been confirmed and saved to athlete logistics.` : ''} ${isBloodMention ? 'We have noted your update regarding the pending blood test results.' : 'We have logged your message in the event operations file.'}`;

        const aiMsg: ChatMessage = {
          id: 'msg-ai-' + Date.now(),
          fighterId,
          senderName: 'Cage Warriors Operations AI',
          senderRole: 'AI',
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' - ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: aiReplyContent,
          aiAnalysis: {
            intent: 'Logistics / Requirement Update',
            detectedFields: {
              ...(extractedCity ? { 'Departure City': extractedCity } : {}),
              ...(isBloodMention ? { 'Blood Test Status': 'Pending Lab sheet' } : {})
            },
            confidence: 96,
            actionsTaken: [
              ...(extractedCity ? [`Updated departure city to ${extractedCity}`] : []),
              'Auto-reply generated from Event Operations Protocol'
            ],
            nextAction: 'Monitor incoming attachments.'
          }
        };

        setChatMessages(curr => ({
          ...curr,
          [fighterId]: [...(curr[fighterId] || []), aiMsg]
        }));

        addAIActivity({
          fighterId,
          fighterName,
          actionTitle: 'AI replied autonomously to manager message',
          details: `Processed intent with 96% confidence and recorded response.`,
          type: 'MESSAGE_INTERPRETED',
          confidence: 96,
          actor: 'AI Agent'
        });
      }, 1200);
    }
  }, [fighters, addAuditLog, addAIActivity]);

  // Approve Pending AI Message
  const approvePendingMessage = useCallback((approvalId: string, customMessage?: string) => {
    const item = pendingApprovals.find(a => a.id === approvalId);
    if (!item) return;

    setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));

    const finalContent = customMessage || item.proposedMessage;
    sendChatMessage(item.fighterId, finalContent, 'Staff');

    addNotification({
      title: 'AI Message Approved & Sent',
      message: `Follow-up message dispatched to ${item.managerName} (${item.fighterName}).`,
      type: 'success',
      linkTab: 'communications',
      linkFighterId: item.fighterId
    });

    addAuditLog({
      fighterId: item.fighterId,
      fighterName: item.fighterName,
      actor: 'Operations Staff',
      action: 'Approved & Dispatched AI Message',
      previousState: 'PENDING_APPROVAL',
      newState: 'DISPATCHED',
      confidence: 100
    });
  }, [pendingApprovals, sendChatMessage, addNotification, addAuditLog]);

  // Reject Pending Message
  const rejectPendingMessage = useCallback((approvalId: string, reason?: string) => {
    const item = pendingApprovals.find(a => a.id === approvalId);
    if (!item) return;

    setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));

    addNotification({
      title: 'AI Message Rejected',
      message: `Draft message for ${item.fighterName} was cancelled: ${reason || 'Staff override'}.`,
      type: 'info'
    });

    addAuditLog({
      fighterId: item.fighterId,
      fighterName: item.fighterName,
      actor: 'Operations Staff',
      action: 'Rejected AI Follow-up Message',
      previousState: 'PENDING_APPROVAL',
      newState: 'CANCELLED'
    });
  }, [pendingApprovals, addNotification, addAuditLog]);

  // Resolve Human Review Case
  const resolveHumanReviewCase = useCallback((caseId: string, resolution: 'VALID' | 'INVALID' | 'RESOLVED', notes?: string) => {
    const caseItem = humanReviewCases.find(c => c.id === caseId);
    if (!caseItem) return;

    setHumanReviewCases(prev => prev.filter(c => c.id !== caseId));

    if (caseItem.documentId) {
      updateDocumentStatus(caseItem.documentId, resolution === 'VALID' ? 'Verified' : 'Rejected', notes);
    }

    // Update fighter state if cleared
    if (resolution === 'VALID') {
      setFighters(prev => prev.map(f => {
        if (f.id !== caseItem.fighterId) return f;

        const updatedReqs = f.requirements.map(req => {
          if (caseItem.category === 'Medical' && req.category === 'medical' && req.status !== 'COMPLETE') {
            return { ...req, status: 'COMPLETE' as const, verifiedBy: 'HUMAN' as const, confidence: 100, notes: `Cleared in Human Review: ${notes || 'Verified by Operations'}` };
          }
          if (caseItem.category === 'Identity' && req.category === 'identity') {
            return { ...req, status: 'COMPLETE' as const, verifiedBy: 'HUMAN' as const, confidence: 100, notes: `Name spelling variance approved by staff: ${notes || 'Confirmed'}` };
          }
          return req;
        });

        const requiredItems = updatedReqs.filter(r => r.required);
        const completedCount = requiredItems.filter(r => r.status === 'COMPLETE').length;
        const pct = Math.round((completedCount / requiredItems.length) * 100);
        const missing = requiredItems.filter(r => r.status !== 'COMPLETE').map(r => r.title.replace(/\(.*\)/, '').trim());

        return {
          ...f,
          requirements: updatedReqs,
          readinessPercentage: pct,
          status: pct === 100 ? 'READY' : 'WAITING',
          aiStatus: 'Human Review resolved — Cleared',
          missingItems: missing
        };
      }));
    }

    addNotification({
      title: 'Human Review Resolved',
      message: `${caseItem.fighterName}: ${caseItem.title} resolved as ${resolution}.`,
      type: resolution === 'VALID' ? 'success' : 'warning'
    });

    addAuditLog({
      fighterId: caseItem.fighterId,
      fighterName: caseItem.fighterName,
      actor: 'Operations Staff',
      action: `Resolved Human Review: ${caseItem.title}`,
      previousState: 'HUMAN_ACTION',
      newState: resolution,
      confidence: 100
    });
  }, [humanReviewCases, updateDocumentStatus, addNotification, addAuditLog]);

  // Toggle Automation Rule
  const toggleAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  }, []);

  // Knowledge Base Search / Ask
  const askKnowledgeBase = useCallback(async (query: string) => {
    // Simulated instant grounding retrieval
    await new Promise(r => setTimeout(r, 450));
    const lower = query.toLowerCase();

    const matches = knowledgeBase.filter(k => 
      k.question.toLowerCase().includes(lower) || 
      k.answer.toLowerCase().includes(lower) ||
      k.category.toLowerCase().includes(lower)
    );

    if (matches.length > 0) {
      return {
        answer: matches[0].answer,
        sources: matches.slice(0, 2),
        confidence: 99
      };
    }

    // Default intelligent fallbacks
    if (lower.includes('hotel') || lower.includes('stay') || lower.includes('room')) {
      const match = knowledgeBase.find(k => k.category === 'Hotel')!;
      return { answer: match.answer, sources: [match], confidence: 96 };
    }
    if (lower.includes('blood') || lower.includes('medical') || lower.includes('hiv') || lower.includes('mri')) {
      const match = knowledgeBase.find(k => k.category === 'Medicals')!;
      return { answer: match.answer, sources: [match], confidence: 98 };
    }
    if (lower.includes('weigh') || lower.includes('scale') || lower.includes('time')) {
      const match = knowledgeBase.find(k => k.category === 'Schedule')!;
      return { answer: match.answer, sources: [match], confidence: 97 };
    }

    return {
      answer: "All fighters must report to the Radisson Blu Manchester Airport by 3:00 PM on October 22. For immediate event day schedule details, please review the official Cage Warriors 198 Athlete Handbook or message event operations directly.",
      sources: [knowledgeBase[0]],
      confidence: 91
    };
  }, [knowledgeBase]);

  // RUN AI DEMO - Choreographed 10-Step Operational Sequence
  const startAIDemo = useCallback(() => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setCurrentTab('communications');
    setSelectedFighterId('ft-1');

    // 10 Steps Choreography
    const steps = [
      {
        step: 1,
        name: 'Step 1/10: New Manager Message Arrives',
        desc: 'Carlos Silva (Manager) messages operations: "Hi! Marco’s passport attached. Marco will fly from Lisbon. Blood test results in 48h."',
        delay: 500,
        action: () => {
          setDemoState({
            currentStep: 1,
            totalSteps: 10,
            stepName: 'New Message Received',
            stepDescription: 'Carlos Silva (Manager) sent message + Marco_Silva_Passport.pdf',
            active: true,
            completed: false
          });
          addNotification({
            title: 'New Inbound Message',
            message: 'Carlos Silva attached Marco_Silva_Passport.pdf for Marco Silva.',
            type: 'info',
            linkTab: 'communications',
            linkFighterId: 'ft-1'
          });
        }
      },
      {
        step: 2,
        name: 'Step 2/10: Attachment Detected & Classified',
        desc: 'AI Vision & Classifier identifies document format: Portuguese International Passport (Type P).',
        delay: 1500,
        action: () => {
          setDemoState(s => ({
            ...s,
            currentStep: 2,
            stepName: 'AI Classifying Attachment',
            stepDescription: 'Vision Model classified file as International Passport (98% confidence)'
          }));
          addAIActivity({
            fighterId: 'ft-1',
            fighterName: 'Marco Silva',
            actionTitle: 'AI Vision: Document Classified',
            details: 'Attachment classified as Republica Portuguesa Passport.',
            type: 'DOCUMENT_PROCESSED',
            confidence: 98,
            actor: 'AI Agent'
          });
        }
      },
      {
        step: 3,
        name: 'Step 3/10: Information Extracted from Passport',
        desc: 'AI OCR extracts Name: Marco Antonio Silva, DOB: May 17 1995, Passport No: P9821448, Expiry: April 18 2031.',
        delay: 3000,
        action: () => {
          setDemoState(s => ({
            ...s,
            currentStep: 3,
            stepName: 'OCR Data Extraction',
            stepDescription: 'Extracted Full Name, DOB, MRZ Checksum, and Expiry Date (April 2031)'
          }));
        }
      },
      {
        step: 4,
        name: 'Step 4/10: Passport Requirement Marked COMPLETE',
        desc: 'Autonomous rule verified validity period > 6 months. Passport requirement status updated to COMPLETE.',
        delay: 4500,
        action: () => {
          setFighters(prev => prev.map(f => {
            if (f.id !== 'ft-1') return f;
            const updated = f.requirements.map(r => r.id === 'req-id-passport' ? { ...r, status: 'COMPLETE' as const, completedAt: 'Today', verifiedBy: 'AI' as const, confidence: 98 } : r);
            return { ...f, requirements: updated };
          }));
          setDemoState(s => ({
            ...s,
            currentStep: 4,
            stepName: 'Requirement Verified',
            stepDescription: 'Passport requirement updated to COMPLETE (Autonomous verification)'
          }));
          addAuditLog({
            fighterId: 'ft-1',
            fighterName: 'Marco Silva',
            actor: 'AI Agent',
            action: 'Passport Requirement Auto-Cleared',
            previousState: 'PENDING',
            newState: 'COMPLETE',
            confidence: 98
          });
        }
      },
      {
        step: 5,
        name: 'Step 5/10: Travel Departure City Extracted',
        desc: 'NLP Agent extracts origin city: "Lisbon (LIS)" from manager message text. Updates travel logistics profile.',
        delay: 6000,
        action: () => {
          setFighters(prev => prev.map(f => {
            if (f.id !== 'ft-1') return f;
            const updated = f.requirements.map(r => r.id === 'req-travel-city' ? { ...r, status: 'COMPLETE' as const, extractedData: { 'Origin': 'Lisbon (LIS)', 'Extracted': 'Manager Message' } } : r);
            return { ...f, requirements: updated };
          }));
          setDemoState(s => ({
            ...s,
            currentStep: 5,
            stepName: 'Travel City Detected',
            stepDescription: 'Extracted origin city "Lisbon" from text; updated athlete logistics.'
          }));
          addAIActivity({
            fighterId: 'ft-1',
            fighterName: 'Marco Silva',
            actionTitle: 'Detected Departure City: Lisbon',
            details: 'Updated athlete origin hub to Lisbon (LIS).',
            type: 'TRAVEL_DETECTED',
            confidence: 96,
            actor: 'AI Agent'
          });
        }
      },
      {
        step: 6,
        name: 'Step 6/10: Missing Medical Requirement Detected',
        desc: 'AI compares active event checklist against athlete file. Identifies Blood Serology panel is still outstanding.',
        delay: 7500,
        action: () => {
          setDemoState(s => ({
            ...s,
            currentStep: 6,
            stepName: 'Detecting Missing Requirements',
            stepDescription: 'Blood Test Serology Panel remains outstanding.'
          }));
        }
      },
      {
        step: 7,
        name: 'Step 7/10: AI Generates Tailored Follow-Up',
        desc: 'AI composes polite, personalized confirmation and follow-up message to manager Carlos Silva.',
        delay: 9000,
        action: () => {
          setDemoState(s => ({
            ...s,
            currentStep: 7,
            stepName: 'AI Response Generated',
            stepDescription: 'Autonomous follow-up message dispatched acknowledging passport & requesting blood test.'
          }));
        }
      },
      {
        step: 8,
        name: 'Step 8/10: Fighter Readiness Bumps to 86%',
        desc: 'Readiness calculation engine updates Marco Silva readiness from 74% to 86%.',
        delay: 10500,
        action: () => {
          recalculateFighterReadiness('ft-1');
          setDemoState(s => ({
            ...s,
            currentStep: 8,
            stepName: 'Readiness Recalculated',
            stepDescription: 'Marco Silva readiness jumped from 74% to 86%.'
          }));
        }
      },
      {
        step: 9,
        name: 'Step 9/10: Timeline & Operations Center Synchronized',
        desc: 'Live activity logs, notifications, and event dashboard KPIs update in real-time.',
        delay: 12000,
        action: () => {
          setDemoState(s => ({
            ...s,
            currentStep: 9,
            stepName: 'Operations Sync',
            stepDescription: 'Dashboard KPIs and AI feed updated.'
          }));
          addNotification({
            title: 'Readiness Increased',
            message: 'Marco Silva reached 86% event readiness.',
            type: 'success',
            linkTab: 'fighters',
            linkFighterId: 'ft-1'
          });
        }
      },
      {
        step: 10,
        name: 'Step 10/10: Autonomous Operational Cycle Complete',
        desc: 'Demonstration completed successfully. The AI autonomously handled intake, OCR, classification, status update, and scheduled reminder.',
        delay: 13500,
        action: () => {
          setDemoState({
            currentStep: 10,
            totalSteps: 10,
            stepName: 'Demo Completed',
            stepDescription: 'Autonomous fighter intake & document cycle finished perfectly!',
            active: false,
            completed: true
          });
          setIsDemoRunning(false);
        }
      }
    ];

    steps.forEach(({ delay, action }) => {
      setTimeout(action, delay);
    });
  }, [isDemoRunning, addNotification, addAIActivity, addAuditLog, recalculateFighterReadiness]);

  // Reset Data to Default
  const resetToDefaultData = useCallback(() => {
    setFighters(mockFighters);
    setDocuments(mockDocuments);
    setChatMessages(mockChatMessages);
    setPendingApprovals(mockPendingApprovals);
    setHumanReviewCases(mockHumanReviewCases);
    setAiActivities(mockAIActivities);
    setAuditLogs(mockAuditLogs);
    setAutomationRules(mockAutomationRules);
    setSelectedFighterId('ft-1');
    setIsDemoRunning(false);
    setDemoState({
      currentStep: 0,
      totalSteps: 10,
      stepName: 'Ready',
      stepDescription: 'Click Run AI Demo to experience autonomous operations.',
      active: false,
      completed: false
    });
    addNotification({
      title: 'State Reset',
      message: 'All fighter operational records restored to baseline demo state.',
      type: 'info'
    });
  }, [addNotification]);

  return (
    <OperationsContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedEventId,
        setSelectedEventId,
        currentEvent,
        fighters,
        selectedFighterId,
        setSelectedFighterId,
        selectedFighter,
        updateFighterRequirement,
        escalateFighter,
        recalculateFighterReadiness,
        documents,
        selectedDocumentId,
        setSelectedDocumentId,
        selectedDocument,
        addDocument,
        updateDocumentStatus,
        chatMessages,
        sendChatMessage,
        pendingApprovals,
        approvePendingMessage,
        rejectPendingMessage,
        humanReviewCases,
        resolveHumanReviewCase,
        aiActivities,
        auditLogs,
        addAuditLog,
        addAIActivity,
        automationRules,
        toggleAutomationRule,
        knowledgeBase,
        askKnowledgeBase,
        isSearchOpen,
        setIsSearchOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        uploadTargetFighterId,
        setUploadTargetFighterId,
        notifications,
        unreadNotificationCount,
        markAllNotificationsRead,
        addNotification,
        isDemoRunning,
        demoState,
        startAIDemo,
        resetToDefaultData
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
};
