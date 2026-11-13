import React from 'react';
import { Flame, AlertOctagon, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SeverityBadge = ({
  severity,
  showIcon = true,
  className = '',
  size = 'md'
}) => {
  const isSm = size === 'sm';

  const config = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      dot: 'bg-red-600',
      icon: Flame,
      label: 'CRITICAL'
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      dot: 'bg-orange-600',
      icon: AlertOctagon,
      label: 'HIGH'
    },
    medium: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      dot: 'bg-amber-600',
      icon: AlertTriangle,
      label: 'MEDIUM'
    },
    low: {
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      text: 'text-slate-700',
      dot: 'bg-slate-500',
      icon: ShieldCheck,
      label: 'LOW'
    }
  }[severity] || {
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    icon: ShieldCheck,
    label: (severity || 'INFO').toUpperCase()
  };

  const IconComp = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border font-semibold ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <IconComp className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
