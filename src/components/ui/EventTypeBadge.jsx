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
      bg: 'bg-[#ddf1f1]',
      border: 'border-[#168a91]/25',
      text: 'text-[#168a91]',
      icon: User,
      label: 'Person'
    },
    vehicle: {
      bg: 'bg-[#e7f3f3]',
      border: 'border-[#69aeb0]/30',
      text: 'text-[#263b40]',
      icon: Car,
      label: 'Vehicle'
    },
    motion: {
      bg: 'bg-[#eaf7f2]',
      border: 'border-[#299b72]/25',
      text: 'text-[#299b72]',
      icon: Activity,
      label: 'Motion'
    },
    restricted_area: {
      bg: 'bg-[#fdf0f0]',
      border: 'border-[#d95757]/25',
      text: 'text-[#d95757]',
      icon: ShieldAlert,
      label: 'Restricted Area'
    }
  }[normalizedType] || {
    bg: 'bg-[#f0f6f6]',
    border: 'border-[#dce5e7]',
    text: 'text-[#61777c]',
    icon: ScanLine,
    label: (type || 'Unknown').replace(/_/g, ' ')
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border font-mono tracking-tight transition-all select-none shadow-2xs ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      } ${className}`}
    >
      {showIcon && (
        <Icon className={`shrink-0 ${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
      )}
      <span className="leading-none">{config.label}</span>
    </span>
  );
};
