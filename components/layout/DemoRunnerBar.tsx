'use client';

import React from 'react';
import { useOperations } from '@/context/OperationsContext';
import { Sparkles, CheckCircle2, Loader2, ArrowRight, X, Play, RotateCcw } from 'lucide-react';

export const DemoRunnerBar: React.FC = () => {
  const { isDemoRunning, demoState, startAIDemo, resetToDefaultData } = useOperations();

  if (!isDemoRunning && !demoState.completed && demoState.currentStep === 0) {
    return null;
  }

  return (
    <div className="bg-neutral-900 text-white px-4 py-2.5 border-b border-neutral-800 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Status & Current Step */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0 shadow-xs">
            {isDemoRunning ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : demoState.completed ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">
                {demoState.completed ? 'Demo Completed' : `AI Demo Live Execution (${demoState.currentStep}/${demoState.totalSteps})`}
              </span>
              <span className="text-xs font-semibold text-white">
                {demoState.stepName}
              </span>
            </div>
            <div className="text-xs text-neutral-300">
              {demoState.stepDescription}
            </div>
          </div>
        </div>

        {/* Center: Step indicators */}
        <div className="hidden lg:flex items-center gap-1.5">
          {Array.from({ length: 10 }).map((_, idx) => {
            const stepNum = idx + 1;
            const isPast = stepNum < demoState.currentStep;
            const isCurrent = stepNum === demoState.currentStep;
            return (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'w-6 bg-red-500 animate-pulse'
                    : isPast
                    ? 'w-3 bg-emerald-500'
                    : 'w-2 bg-neutral-700'
                }`}
                title={`Step ${stepNum}`}
              />
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {demoState.completed && (
            <button
              onClick={startAIDemo}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Replay Demo</span>
            </button>
          )}
          <button
            onClick={resetToDefaultData}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
