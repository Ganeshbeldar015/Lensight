import React from 'react';
import { Wifi, AlertTriangle, WifiOff } from 'lucide-react';

export const StatusBadge = ({
  status,
  showIcon = true,
  className = '',
  size = 'md'
}) => {
  const isSm = size === 'sm';

  const normalized = (status || '').toLowerCase();

  const config = {
    online: {
      bg: 'bg-[#eaf5ef]',
      border: 'border-[#16845b]/25',
      text: 'text-[#16845b]',
      dot: 'bg-[#16845b]',
      icon: Wifi,
      label: 'ONLINE'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-[#b47a16]',
      dot: 'bg-[#d99a26]',
      icon: AlertTriangle,
      label: 'WARNING'
    },
    offline: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-[#dc5656]',
      dot: 'bg-[#dc5656]',
      icon: WifiOff,
      label: 'OFFLINE'
    }
  }[normalized] || {
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
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border font-medium ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'online' ? 'animate-pulse' : ''}`} />
      {showIcon && <IconComp className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
