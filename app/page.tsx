'use client';

import React from 'react';
import { OperationsProvider, useOperations } from '@/context/OperationsContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DemoRunnerBar } from '@/components/layout/DemoRunnerBar';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { UploadModal } from '@/components/documents/UploadModal';

// Views
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { EventHub } from '@/components/events/EventHub';
import { FightersList } from '@/components/fighters/FightersList';
import { AIOperationsCenter } from '@/components/ai-ops/AIOperationsCenter';
import { HumanReviewQueue } from '@/components/human-review/HumanReviewQueue';
import { ApprovalQueue } from '@/components/approvals/ApprovalQueue';
import { CommunicationCenter } from '@/components/communications/CommunicationCenter';
import { DocumentsCenter } from '@/components/documents/DocumentsCenter';
import { ActivityAuditLog } from '@/components/audit/ActivityAuditLog';
import { EventConfig } from '@/components/config/EventConfig';
import { AutomationRules } from '@/components/rules/AutomationRules';
import { KnowledgeBase } from '@/components/knowledge/KnowledgeBase';
import { FighterPortalSimulator } from '@/components/portal/FighterPortalSimulator';

const MainAppContent: React.FC = () => {
  const { currentTab } = useOperations();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'events':
        return <EventHub />;
      case 'fighters':
        return <FightersList />;
      case 'ai-ops':
        return <AIOperationsCenter />;
      case 'human-review':
        return <HumanReviewQueue />;
      case 'approvals':
        return <ApprovalQueue />;
      case 'communications':
        return <CommunicationCenter />;
      case 'documents':
        return <DocumentsCenter />;
      case 'activity-log':
        return <ActivityAuditLog />;
      case 'event-config':
        return <EventConfig />;
      case 'automation-rules':
        return <AutomationRules />;
      case 'knowledge-base':
        return <KnowledgeBase />;
      case 'fighter-portal':
        return <FighterPortalSimulator />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />
        <DemoRunnerBar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>

        {/* Sleek Interface Footer */}
        <footer className="h-12 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 
              12 Items Auto-Verified Today
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-300 rounded-full"></span> 
              Safe MMA & UKAD Compliance Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            v1.2.4-stable • MMA Ops Engine active
          </p>
        </footer>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      <UploadModal />
    </div>
  );
};

export default function Page() {
  return (
    <OperationsProvider>
      <MainAppContent />
    </OperationsProvider>
  );
}
