'use client';

import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  colorScheme?: 'auto' | 'emerald' | 'amber' | 'rose' | 'crimson';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  showLabel = false,
  colorScheme = 'auto',
  className = ''
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  let fillGradient = 'bg-red-600';
  if (colorScheme === 'auto') {
    if (clampedValue === 100) fillGradient = 'bg-emerald-500';
    else if (clampedValue >= 75) fillGradient = 'bg-amber-500';
    else if (clampedValue >= 50) fillGradient = 'bg-orange-500';
    else fillGradient = 'bg-red-600';
  } else if (colorScheme === 'emerald') {
    fillGradient = 'bg-emerald-500';
  } else if (colorScheme === 'amber') {
    fillGradient = 'bg-amber-500';
  } else if (colorScheme === 'rose') {
    fillGradient = 'bg-rose-500';
  } else if (colorScheme === 'crimson') {
    fillGradient = 'bg-red-600';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  }[size];

  return (
    <div className={`w-full flex items-center gap-2.5 ${className}`}>
      <div className={`w-full bg-neutral-200/80 rounded-full overflow-hidden ${heightClasses}`}>
        <div
          className={`${heightClasses} ${fillGradient} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-neutral-700 min-w-[36px] text-right font-mono">
          {clampedValue}%
        </span>
      )}
    </div>
  );
};
