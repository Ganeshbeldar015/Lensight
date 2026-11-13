import React from 'react';
import type { CameraStatus } from '@/types';

interface StatusBadgeProps {
  status: CameraStatus;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', pulse = true }) => {
  const configs = {
    online: {
      label: 'ONLINE',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    warning: {
      label: 'WARNING',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      dot: 'bg-amber-500',
    },
    offline: {
      label: 'OFFLINE',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      dot: 'bg-red-500',
    },
  };

  const c = configs[status] || configs.offline;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-md border ${
        c.bg
      } ${c.text} ${c.border} ${isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}
    >
      <span
        className={`inline-block rounded-full ${c.dot} ${
          isSm ? 'w-1.5 h-1.5' : 'w-2 h-2'
        } ${pulse && status === 'online' ? 'animate-pulse' : ''}`}
      />
      {c.label}
    </span>
  );
};

