import React from 'react';
import { Wifi, AlertTriangle, WifiOff } from 'lucide-react';

export const StatusBadge = ({
  status,
  showIcon = true,
  className = '',
  size = 'md'
}) => {
  const isSm = size === 'sm';

  const config = {
    online: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      icon: Wifi,
      label: 'ONLINE'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      label: 'WARNING'
    },
    offline: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      dot: 'bg-rose-500',
      icon: WifiOff,
      label: 'OFFLINE'
    }
  }[status] || {
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    icon: Wifi,
    label: (status || 'UNKNOWN').toUpperCase()
  };

  const IconComp = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border font-semibold ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'online' ? 'animate-pulse' : ''}`} />
      {showIcon && <IconComp className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
