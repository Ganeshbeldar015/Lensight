import React from 'react';
import type { Severity } from '@/types';
import { Flame, AlertOctagon, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SeverityBadgeProps {
  severity: Severity;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  showIcon = true,
  className = '',
  size = 'md'
}) => {
  const isSm = size === 'sm';

  const config = {
    critical: {
      bg: 'bg-[rgba(235,52,36,0.15)]',
      border: 'border-[rgba(235,52,36,0.35)]',
      text: 'text-[#ff5242]',
      dot: 'bg-[#eb3424]',
      icon: Flame,
      label: 'CRITICAL'
    },
    high: {
      bg: 'bg-[rgba(250,93,25,0.15)]',
      border: 'border-[rgba(250,93,25,0.35)]',
      text: 'text-[#fa5d19]',
      dot: 'bg-[#fa5d19]',
      icon: AlertOctagon,
      label: 'HIGH'
    },
    medium: {
      bg: 'bg-[rgba(236,183,48,0.15)]',
      border: 'border-[rgba(236,183,48,0.35)]',
      text: 'text-[#ecb730]',
      dot: 'bg-[#ecb730]',
      icon: AlertTriangle,
      label: 'MEDIUM'
    },
    low: {
      bg: 'bg-[rgba(144,150,165,0.12)]',
      border: 'border-[rgba(144,150,165,0.25)]',
      text: 'text-[#a0a5b2]',
      dot: 'bg-[#808896]',
      icon: ShieldCheck,
      label: 'LOW'
    }
  }[severity];

  const IconComp = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${severity === 'critical' ? 'animate-ping' : ''}`} />
      {showIcon && <IconComp className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
