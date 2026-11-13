import React from 'react';
import { User, Car, Activity, ShieldAlert, ScanLine } from 'lucide-react';

export const EventTypeBadge = ({
  type,
  showIcon = true,
  className = '',
  size = 'md'
}) => {
  const isSm = size === 'sm';

  const normalizedType = (type || '').toLowerCase();

  const config = {
    person: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      icon: User,
      label: 'Person'
    },
    vehicle: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      dot: 'bg-indigo-500',
      icon: Car,
      label: 'Vehicle'
    },
    motion: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      icon: Activity,
      label: 'Motion'
    },
    restricted_area: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      dot: 'bg-rose-500',
      icon: ShieldAlert,
      label: 'Restricted Area'
    }
  }[normalizedType] || {
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    text: 'text-slate-700',
    dot: 'bg-slate-400',
    icon: ScanLine,
    label: (type || 'Unknown').replace(/_/g, ' ')
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border font-mono tracking-tight transition-all ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      {showIcon && (
        <Icon className={`shrink-0 ${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};

