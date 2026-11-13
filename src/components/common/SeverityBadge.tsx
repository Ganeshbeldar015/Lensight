import React from 'react';
import type { Severity } from '@/types';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
}) => {
  const configs = {
    critical: {
      label: 'CRITICAL',
      bg: 'bg-red-500/10 text-red-400 border-red-500/25',
      icon: ShieldAlert,
    },
    high: {
      label: 'HIGH',
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
      icon: AlertCircle,
    },
    medium: {
      label: 'MEDIUM',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      icon: AlertTriangle,
    },
    low: {
      label: 'LOW',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: Info,
    },
  };

  const c = configs[severity] || configs.low;
  const Icon = c.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded border ${
        c.bg
      } ${isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'}`}
    >
      {showIcon && <Icon className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      {c.label}
    </span>
  );
};

