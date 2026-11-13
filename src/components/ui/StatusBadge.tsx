import React from 'react';
import type { CameraStatus } from '@/types';
import { Wifi, AlertTriangle, WifiOff } from 'lucide-react';

interface StatusBadgeProps {
  status: CameraStatus;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
  size = 'md'
}) => {
  const isSm = size === 'sm';

  const config = {
    online: {
      bg: 'bg-[rgba(34,197,94,0.12)]',
      border: 'border-[rgba(34,197,94,0.25)]',
      text: 'text-[#42c366]',
      dot: 'bg-[#22c55e]',
      icon: Wifi,
      label: 'ONLINE'
    },
    warning: {
      bg: 'bg-[rgba(245,158,11,0.12)]',
      border: 'border-[rgba(245,158,11,0.25)]',
      text: 'text-[#ecb730]',
      dot: 'bg-[#f59e0b]',
      icon: AlertTriangle,
      label: 'WARNING'
    },
    offline: {
      bg: 'bg-[rgba(239,68,68,0.12)]',
      border: 'border-[rgba(239,68,68,0.25)]',
      text: 'text-[#ef4444]',
      dot: 'bg-[#ef4444]',
      icon: WifiOff,
      label: 'OFFLINE'
    }
  }[status] || {
    bg: 'bg-[#222]',
    border: 'border-[#444]',
    text: 'text-[#aaa]',
    dot: 'bg-[#888]',
    icon: Wifi,
    label: status.toUpperCase()
  };

  const IconComp = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'online' ? 'animate-pulse' : ''}`} />
      {showIcon && <IconComp className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
