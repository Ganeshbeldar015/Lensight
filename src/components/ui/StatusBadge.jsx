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
      bg: 'bg-[#eaf7f2]',
      border: 'border-[#299b72]/25',
      text: 'text-[#299b72]',
      dot: 'bg-[#299b72]',
      icon: Wifi,
      label: 'ONLINE'
    },
    warning: {
      bg: 'bg-[#fdf6ea]',
      border: 'border-[#d69a38]/30',
      text: 'text-[#d69a38]',
      dot: 'bg-[#d69a38]',
      icon: AlertTriangle,
      label: 'WARNING'
    },
    offline: {
      bg: 'bg-[#fdf0f0]',
      border: 'border-[#d95757]/25',
      text: 'text-[#d95757]',
      dot: 'bg-[#d95757]',
      icon: WifiOff,
      label: 'OFFLINE'
    }
  }[normalized] || {
    bg: 'bg-[#f0f6f6]',
    border: 'border-[#dce5e7]',
    text: 'text-[#61777c]',
    dot: 'bg-[#8a9b9f]',
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
