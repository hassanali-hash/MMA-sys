export type FighterStatus = 'READY' | 'WAITING' | 'HUMAN_ACTION' | 'PROCESSING';

export type WeightClass = 
  | 'Flyweight (125 lbs)' 
  | 'Bantamweight (135 lbs)' 
  | 'Featherweight (145 lbs)' 
  | 'Lightweight (155 lbs)' 
  | 'Welterweight (170 lbs)' 
  | 'Middleweight (185 lbs)' 
  | 'Light Heavyweight (205 lbs)' 
  | 'Heavyweight (265 lbs)'
  | "Women's Strawweight (115 lbs)"
  | "Women's Flyweight (125 lbs)";

export type RequirementCategory = 
  | 'contract' 
  | 'identity' 
  | 'medical' 
  | 'fighter_info' 
  | 'media' 
  | 'travel' 
  | 'event_info';

export type RequirementStatus = 'COMPLETE' | 'PENDING' | 'ACTION_REQUIRED' | 'UNDER_REVIEW' | 'OPTIONAL';

export interface RequirementItem {
  id: string;
  category: RequirementCategory;
  title: string;
  description?: string;
  status: RequirementStatus;
  required: boolean;
  dueDate?: string;
  completedAt?: string;
  verifiedBy?: 'AI' | 'HUMAN' | 'NONE';
  confidence?: number;
  extractedData?: Record<string, string | number | boolean>;
  notes?: string;
  documentId?: string;
}

export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  photoUrl: string;
  country: string;
  countryCode: string;
  opponentName: string;
  opponentId?: string;
  weightClass: WeightClass;
  division: string;
  record: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  fighterEmail: string;
  fighterPhone: string;
  readinessPercentage: number;
  status: FighterStatus;
  lastContact: string;
  aiStatus: string;
  missingItems: string[];
  eventId: string;
  requirements: RequirementItem[];
  cornerCount: number;
  cornerPassesAllocated: number;
  medicalClearanceExpiry?: string;
  notes?: string;
}

export interface DocumentItem {
  id: string;
  fighterId: string;
  fighterName: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'docx';
  category: 'passport' | 'contract' | 'medical' | 'travel' | 'photo' | 'other';
  uploadedBy: string;
  uploaderRole: 'Manager' | 'Fighter' | 'Staff' | 'System';
  uploadDate: string;
  aiConfidence: number;
  verificationStatus: 'Verified' | 'Processing' | 'Needs Review' | 'Rejected' | 'Expired';
  previewUrl?: string;
  extractedFields: Record<string, string | number>;
  ocrSnippet?: string;
  flagReason?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  documentId?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  fighterId: string;
  senderName: string;
  senderRole: 'AI' | 'Manager' | 'Fighter' | 'Staff';
  timestamp: string;
  content: string;
  attachments?: MessageAttachment[];
  aiAnalysis?: {
    intent: string;
    detectedFields: Record<string, string>;
    confidence: number;
    actionsTaken: string[];
    nextAction: string;
    requiresApproval?: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected' | 'modified';
  };
}

export interface PendingAIApproval {
  id: string;
  fighterId: string;
  fighterName: string;
  managerName: string;
  channel: 'WhatsApp' | 'Email' | 'Portal';
  recipientContact: string;
  proposedMessage: string;
  aiReason: string;
  confidence: number;
  createdAt: string;
  triggerEvent: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  missingRequirementsHighlighted: string[];
}

export interface HumanReviewCase {
  id: string;
  fighterId: string;
  fighterName: string;
  weightClass: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  category: 'Medical' | 'Identity' | 'Contract' | 'Travel' | 'Eligibility';
  reason: string;
  aiConfidence: number;
  detectedValues: Record<string, string>;
  possibleValues?: Record<string, string>;
  aiRecommendation: string;
  documentPreviewUrl?: string;
  documentId?: string;
  createdAt: string;
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
  resolutionNotes?: string;
}

export interface AIActivityItem {
  id: string;
  timestamp: string;
  fighterId: string;
  fighterName: string;
  actionTitle: string;
  details: string;
  type: 'DOCUMENT_PROCESSED' | 'MESSAGE_INTERPRETED' | 'REQUIREMENT_UPDATED' | 'ESCALATED' | 'REMINDER_SCHEDULED' | 'TRAVEL_DETECTED' | 'STATUS_CHANGED';
  confidence?: number;
  actor: 'AI Agent' | 'Operations Staff' | 'Fighter' | 'Manager' | 'System';
  isLive?: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  fighterId: string;
  fighterName: string;
  actor: 'AI Agent' | 'Fighter' | 'Manager' | 'Operations Staff' | 'System';
  action: string;
  previousState: string;
  newState: string;
  confidence?: number;
  metadata?: string;
}

export interface MMAEvent {
  id: string;
  title: string;
  shortCode: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  totalFighters: number;
  readyFighters: number;
  waitingFighters: number;
  humanActionFighters: number;
  eventReadiness: number;
  outstandingRequirements: number;
  weighInDate: string;
  weighInVenue: string;
  athleteArrivalDeadline: string;
  handbookUrl?: string;
}

export interface KnowledgeItem {
  id: string;
  category: 'Schedule' | 'Venue' | 'Medicals' | 'Travel' | 'Rules' | 'Hotel';
  question: string;
  answer: string;
  sourceDoc: string;
  sourceSection: string;
  lastUpdated: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
  timeframe: string;
  primaryAction: string;
  escalationAction: string;
  category: 'Reminders' | 'Confidence' | 'Escalation' | 'Verification';
  appliedCount: number;
}
