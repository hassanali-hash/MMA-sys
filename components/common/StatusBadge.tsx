'use client';

import React from 'react';
import { FighterStatus, RequirementStatus } from '@/types';
import { CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: FighterStatus | RequirementStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true,
  className = '' 
}) => {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-neutral-100 text-neutral-700 border-neutral-200';
  let label = status;
  let Icon = Clock;

  switch (normalized) {
    case 'READY':
    case 'COMPLETE':
    case 'VERIFIED':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10';
      label = normalized === 'READY' ? 'READY' : normalized === 'COMPLETE' ? 'Complete' : 'Verified';
      Icon = CheckCircle2;
      break;

    case 'WAITING':
    case 'PENDING':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10';
      label = normalized === 'WAITING' ? 'WAITING' : 'Pending';
      Icon = Clock;
      break;

    case 'HUMAN_ACTION':
    case 'HUMAN ACTION':
    case 'ACTION_REQUIRED':
    case 'NEEDS REVIEW':
    case 'UNDER_REVIEW':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10 font-semibold';
      label = normalized.includes('HUMAN') ? 'HUMAN ACTION' : normalized === 'UNDER_REVIEW' ? 'Under Review' : 'Action Required';
      Icon = AlertTriangle;
      break;

    case 'PROCESSING':
      colorClasses = 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-500/10';
      label = 'Processing';
      Icon = Loader2;
      break;

    case 'OPTIONAL':
      colorClasses = 'bg-neutral-100 text-neutral-600 border-neutral-200';
      label = 'Optional';
      Icon = Clock;
      break;

    case 'REJECTED':
    case 'EXPIRED':
      colorClasses = 'bg-red-50 text-red-700 border-red-200';
      label = normalized === 'REJECTED' ? 'Rejected' : 'Expired';
      Icon = AlertTriangle;
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap tracking-wide transition-colors ${sizeClasses} ${colorClasses} ${className}`}
    >
      {showIcon && <Icon className={`shrink-0 ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${normalized === 'PROCESSING' ? 'animate-spin' : ''}`} />}
      <span>{label}</span>
    </span>
  );
};
