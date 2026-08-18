'use client';

import React from 'react';
import { useOperations, NavigationTab } from '@/context/OperationsContext';
import { 
  LayoutDashboard, Users, Cpu, ShieldAlert, 
  MessageSquare, FileText, History, Settings, 
  Sliders, HelpCircle, Smartphone, Calendar, 
  CheckSquare, LogOut
} from 'lucide-react';

interface NavItem {
  tab: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    humanReviewCases, 
    pendingApprovals,
    chatMessages
  } = useOperations();

  const openHumanReviewCount = humanReviewCases.filter(c => c.status === 'OPEN').length;
  const pendingApprovalsCount = pendingApprovals.filter(p => p.status === 'PENDING').length;
  const totalUnreadConversations = Object.keys(chatMessages).length > 0 ? 1 : 0;

  const coreNav: NavItem[] = [
    { tab: 'overview', label: 'Overview', icon: LayoutDashboard },
    { tab: 'events', label: 'Events', icon: Calendar },
    { tab: 'fighters', label: 'Fighters', icon: Users }
  ];

  const aiOpsNav: NavItem[] = [
    { tab: 'ai-ops', label: 'AI Operations', icon: Cpu, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { tab: 'human-review', label: 'Human Review', icon: ShieldAlert, badge: openHumanReviewCount > 0 ? openHumanReviewCount : undefined, badgeColor: 'bg-red-600 text-white' },
    { tab: 'approvals', label: 'AI Approvals', icon: CheckSquare, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { tab: 'communications', label: 'Communications', icon: MessageSquare, badge: totalUnreadConversations > 0 ? 'Live' : undefined, badgeColor: 'bg-blue-500/20 text-blue-300' },
    { tab: 'documents', label: 'Documents', icon: FileText }
  ];

  const configNav: NavItem[] = [
    { tab: 'activity-log', label: 'Activity Audit Log', icon: History },
    { tab: 'event-config', label: 'Event Rules', icon: Settings },
    { tab: 'automation-rules', label: 'Automation', icon: Sliders },
    { tab: 'knowledge-base', label: 'Event Knowledge Q&A', icon: HelpCircle },
    { tab: 'fighter-portal', label: 'Fighter Portal App', icon: Smartphone }
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {title}
      </div>
      <div className="space-y-1">
        {items.map(({ tab, label, icon: Icon, badge, badgeColor }) => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              id={`nav-tab-${tab}`}
              onClick={() => setCurrentTab(tab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left cursor-pointer group ${
                isActive
                  ? 'bg-slate-800 text-white font-medium border-l-2 border-red-600 pl-2.5'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 font-normal'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isActive ? (
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                ) : (
                  <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-200 transition-colors" />
                )}
                <span className="truncate">{label}</span>
              </div>
              {badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    badgeColor || 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-[#0f172a] text-white border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center font-bold text-xs text-white">
            MMA
          </div>
          <h1 className="font-bold tracking-tight text-lg italic text-white">
            FIGHTER OPS
          </h1>
        </div>
        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
          Cage Warriors Europe
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        {renderNavGroup('Operations', coreNav)}
        {renderNavGroup('AI Engine & Operations', aiOpsNav)}
        {renderNavGroup('Configuration & Governance', configNav)}
      </div>

      {/* Bottom User Card */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm border-2 border-slate-600 text-white shrink-0">
              DM
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-semibold text-white truncate">Daniel Morgan</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Ops Manager</p>
            </div>
          </div>
          <button
            title="Sign out / Switch account"
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
