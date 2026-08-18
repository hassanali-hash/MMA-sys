'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { mockEvents } from '@/data/mockData';
import { 
  Search, Bell, Sparkles, Play, RotateCcw, 
  Upload, ChevronDown, CheckCheck, Smartphone, 
  Building2, ShieldAlert, Cpu
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedEventId,
    setSelectedEventId,
    currentEvent,
    setIsSearchOpen,
    setIsUploadModalOpen,
    setUploadTargetFighterId,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    setCurrentTab,
    setSelectedFighterId,
    currentTab,
    startAIDemo,
    isDemoRunning,
    resetToDefaultData
  } = useOperations();

  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (eventRef.current && !eventRef.current.contains(e.target as Node)) {
        setIsEventDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-5 bg-white border-b border-neutral-200 shadow-xs">
      {/* Left: Event Switcher & Portal Mode */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={eventRef}>
          <button
            id="event-selector-btn"
            onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-left transition-colors cursor-pointer group"
          >
            <div className="w-2 h-2 rounded-full bg-red-600 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-bold text-neutral-900 leading-tight">
                {currentEvent.title}
              </div>
              <div className="text-[10px] text-neutral-500 font-medium">
                {currentEvent.venue} • {currentEvent.date}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-1 group-hover:text-neutral-700" />
          </button>

          {isEventDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Select Active Organization Event
              </div>
              {mockEvents.map(evt => (
                <button
                  key={evt.id}
                  onClick={() => {
                    setSelectedEventId(evt.id);
                    setIsEventDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    evt.id === selectedEventId 
                      ? 'bg-red-50 text-red-950 font-semibold border border-red-200/60' 
                      : 'hover:bg-neutral-50 text-neutral-800'
                  }`}
                >
                  <div>
                    <div className="font-bold">{evt.title}</div>
                    <div className="text-[11px] text-neutral-500">{evt.venue}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{evt.totalFighters} Confirmed Fighters • {evt.eventReadiness}% Ready</div>
                  </div>
                  {evt.id === selectedEventId && (
                    <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mode Toggle: Staff Dashboard vs Fighter Onboarding Portal */}
        <div className="hidden lg:flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
          <button
            id="switch-staff-portal"
            onClick={() => setCurrentTab(currentTab === 'fighter-portal' ? 'overview' : currentTab)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentTab !== 'fighter-portal'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-neutral-700" />
            <span>Staff Portal</span>
          </button>
          <button
            id="switch-fighter-portal"
            onClick={() => setCurrentTab('fighter-portal')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentTab === 'fighter-portal'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-neutral-700" />
            <span>Fighter View</span>
          </button>
        </div>
      </div>

      {/* Center: Global Search Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          id="global-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-neutral-500 bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-700 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span>Search fighters, documents, managers, rules...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-neutral-200 text-neutral-500 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: AI Agent Status, Demo Runner, Upload Sim, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Autonomous AI Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Cpu className="w-3 h-3 text-emerald-600" />
          <span>AI Autonomous Ops Active</span>
          <span className="text-[10px] font-mono bg-emerald-200/60 text-emerald-900 px-1 rounded font-bold">99.4%</span>
        </div>

        {/* DEMO RUNNER BUTTON */}
        <button
          id="run-ai-demo-btn"
          onClick={startAIDemo}
          disabled={isDemoRunning}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
            isDemoRunning
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-red-600 hover:bg-red-700 active:scale-98 text-white ring-2 ring-red-600/20'
          }`}
          title="Simulate the complete 10-step autonomous workflow"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{isDemoRunning ? 'AI Running...' : 'Run AI Demo'}</span>
        </button>

        {/* Upload Simulation Modal Trigger */}
        <button
          id="quick-upload-sim-btn"
          onClick={() => {
            setUploadTargetFighterId('ft-1');
            setIsUploadModalOpen(true);
          }}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-medium border border-neutral-200 transition-colors"
          title="Upload mock document to test AI vision & OCR extraction"
        >
          <Upload className="w-3.5 h-3.5 text-neutral-600" />
          <span>Upload Sim</span>
        </button>

        {/* Reset State Button */}
        <button
          id="reset-demo-state-btn"
          onClick={resetToDefaultData}
          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          title="Reset all demo data to baseline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-bell-btn"
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="relative p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900">Activity Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    No new activity notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.linkTab) setCurrentTab(n.linkTab);
                        if (n.linkFighterId) setSelectedFighterId(n.linkFighterId);
                        setIsNotifDropdownOpen(false);
                      }}
                      className={`p-3 text-xs hover:bg-neutral-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                          {n.type === 'ai' && <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />}
                          {n.type === 'warning' && <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />}
                          <span>{n.title}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-neutral-600 mt-1 leading-relaxed text-[11px]">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
