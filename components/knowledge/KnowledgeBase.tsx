'use client';

import React, { useState } from 'react';
import { useOperations } from '@/context/OperationsContext';
import { 
  HelpCircle, Search, Sparkles, BookOpen, 
  Hotel, Scale, ShieldCheck, Clock, FileText, 
  Send, Bot, ChevronRight 
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { currentEvent } = useOperations();
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<{ q: string; a: string; sources: string[] } | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const articles = [
    {
      category: 'Weigh-in Protocol',
      icon: Scale,
      title: 'Official Morning Weigh-In & Weight Cut Allowance',
      content: 'Official weigh-ins occur at 10:00 AM BST on Friday, Oct 23 at the Radisson Blu Host Hotel. Championship bouts require exact weight (0.0 lb allowance). Non-title bouts have a 1.0 lb allowance. In the event of a missed weight, fighters have a 2-hour recovery window.',
      tags: ['Scale', 'Allowance', 'Weight Cut', '10 AM']
    },
    {
      category: 'Medical Regulations',
      icon: ShieldCheck,
      title: 'UKAD & Safe MMA Blood Serology Standards',
      content: 'Blood test panels (HIV Ab/Ag, Hepatitis B Surface Antigen, Hepatitis C Antibody) must be drawn within 180 days of the fight date and signed by a certified laboratory pathologist. Brain MRI must be completed within 24 months without traumatic acute pathology.',
      tags: ['UKAD', 'Blood', 'MRI', 'HIV', 'Hep B']
    },
    {
      category: 'Host Hotel & Logistics',
      icon: Hotel,
      title: 'Host Hotel Rooming & Airport Shuttle Schedule',
      content: `Host hotel is The Midland Hotel Manchester. Cage Warriors covers 3 nights accommodation (Thursday, Friday, Saturday) for the fighter and 1 primary corner. Airport shuttle runs hourly from Manchester Airport (MAN) to the hotel lobby from 08:00 to 22:00 BST.`,
      tags: ['Hotel', 'Manchester', 'Airport', 'Shuttle']
    },
    {
      category: 'Corner Credentials',
      icon: ShieldCheck,
      title: 'Corner Passes & Backstage Access Badges',
      content: 'Each fighter is allocated 3 corner passes (1 chief second, 2 cutmen/cornermen). All cornermen must register their full legal names, photos, and corner licenses with the regulatory commissioner before Thursday 17:00 BST.',
      tags: ['Corner', 'Passes', 'Cornermen', 'Backstage']
    },
    {
      category: 'Fight Night Schedule',
      icon: Clock,
      title: 'Fight Night Call Times & Hand Wrapping Procedures',
      content: 'Arena call time is 15:30 BST at BEC Arena. Hand wrapping begins promptly at 16:15 under referee and opposing corner supervision. No pre-wrapping is permitted in hotel rooms.',
      tags: ['Handwrap', 'Call Time', 'Arena', '15:30']
    }
  ];

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsThinking(true);
    setTimeout(() => {
      const q = aiQuestion.toLowerCase();
      let answer = '';
      let sources = ['Cage Warriors Event Protocol 2026'];

      if (q.includes('weigh') || q.includes('weight') || q.includes('scale')) {
        answer = 'Official morning weigh-ins are held at 10:00 AM BST on Friday, Oct 23 at the Radisson Blu Host Hotel. Championship title bouts have a strict 0.0 lb allowance, while non-title bouts permit a 1.0 lb allowance.';
        sources.push('Section 4.1: Weight Cut & Weigh-in Rules');
      } else if (q.includes('blood') || q.includes('mri') || q.includes('medical') || q.includes('test')) {
        answer = 'UKAD and Safe MMA require blood serology (HIV, Hep B, Hep C) within 180 days of the bout date. Brain MRIs are valid for 24 months provided there are no prior acute head trauma suspensions.';
        sources.push('Section 2.3: Medical & Diagnostic Clearance Standards');
      } else if (q.includes('hotel') || q.includes('flight') || q.includes('airport') || q.includes('room')) {
        answer = `Host hotel is The Midland Hotel Manchester. Cage Warriors covers 3 nights accommodation for the fighter and head coach. Airport shuttles run hourly from Manchester Airport (MAN) between 08:00 and 22:00 BST.`;
        sources.push('Section 5: Host Hotel & Travel Operations');
      } else if (q.includes('corner') || q.includes('pass') || q.includes('badge')) {
        answer = 'Fighters receive 3 registered corner passes. All cornermen must submit identification and be approved by the regulatory commission prior to Thursday 17:00 BST.';
        sources.push('Section 6: Cornermen & Credential Allocations');
      } else {
        answer = `According to the Cage Warriors 198 Event Handbook, all athletes must report to BEC Arena by 15:30 BST on fight night. For specific queries regarding fighter clearance, please check the Fighters Directory checklist.`;
        sources.push('General Fighter Operations Handbook');
      }

      setAiAnswer({
        q: aiQuestion,
        a: answer,
        sources
      });
      setIsThinking(false);
    }, 600);
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-950 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-red-600" />
              <span>Event Knowledge & Regulatory Q&A</span>
            </h1>
            <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
              Ground Truth Source
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Rules, regulatory medical standards, host hotel policies, and instant AI query answering for {currentEvent.title}.
          </p>
        </div>
      </div>

      {/* AI Ask Assistant Box */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-red-500" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Ask Event Operations AI Assistant
          </h2>
        </div>
        <p className="text-xs text-neutral-400">
          Query event logistics, corner rules, weigh-in allowances, or UKAD requirements. Instant citation from official guidelines.
        </p>

        <form onSubmit={handleAskAI} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., What is the weight allowance for title fights? What time is the airport shuttle?"
            value={aiQuestion}
            onChange={e => setAiQuestion(e.target.value)}
            className="flex-1 bg-neutral-800 text-white px-4 py-2.5 rounded-xl border border-neutral-700 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={!aiQuestion.trim() || isThinking}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isThinking ? 'Searching...' : 'Ask AI'}</span>
          </button>
        </form>

        {/* AI Answer Card */}
        {aiAnswer && (
          <div className="p-4 bg-neutral-800 rounded-xl border border-neutral-700 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-red-400 font-bold text-[11px] uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>AI Answer for: &ldquo;{aiAnswer.q}&rdquo;</span>
            </div>
            <p className="text-neutral-100 leading-relaxed font-sans">
              {aiAnswer.a}
            </p>
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-700 text-[10px] text-neutral-400">
              <span className="font-bold text-neutral-300">Ground Truth Citations:</span>
              {aiAnswer.sources.map((src, i) => (
                <span key={i} className="bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                  {src}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Searchable Articles Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Event Regulation Articles ({filteredArticles.length})
          </h3>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search regulations & rules..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((art, idx) => {
            const Icon = art.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs hover:border-neutral-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-red-600 uppercase tracking-wider">
                    <Icon className="w-4 h-4" />
                    <span>{art.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">{art.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-2">
                    {art.content}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-neutral-100">
                  {art.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
