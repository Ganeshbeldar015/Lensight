import React from 'react';
import { Wifi, AlertTriangle, WifiOff } from 'lucide-react';

export const StatusBadge = ({
  status,
  showIcon = true,
  className = '',
  size = 'sm'
}) => {
  const isSm = size === 'sm';

  const normalized = (status || '').toLowerCase();

  const config = {
    online: {
      bg: 'bg-[#eaf7f2]',
      border: 'border-[#299b72]/25',
      text: 'text-[#299b72]',
      icon: Wifi,
      label: 'ONLINE'
    },
    warning: {
      bg: 'bg-[#fdf6ea]',
      border: 'border-[#d69a38]/30',
      text: 'text-[#d69a38]',
      icon: AlertTriangle,
      label: 'WARNING'
    },
    offline: {
      bg: 'bg-[#fdf0f0]',
      border: 'border-[#d95757]/25',
      text: 'text-[#d95757]',
      icon: WifiOff,
      label: 'OFFLINE'
    }
  }[normalized] || {
    bg: 'bg-[#f0f6f6]',
    border: 'border-[#dce5e7]',
    text: 'text-[#61777c]',
    icon: Wifi,
    label: (status || 'UNKNOWN').toUpperCase()
  };

  const IconComp = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold select-none shadow-2xs ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-3 py-1 text-[11px] gap-1.5' : 'px-3.5 py-1.5 text-xs gap-2'
      } ${className}`}
    >
      {showIcon && <IconComp className={isSm ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />}
      <span className="tracking-wider uppercase">{config.label}</span>
    </span>
  );
};
