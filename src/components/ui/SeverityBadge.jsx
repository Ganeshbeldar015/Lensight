import React from 'react';
import { AlertOctagon, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';

export const SeverityBadge = ({
  severity,
  showIcon = true,
  className = '',
  size = 'md'
}) => {
  const isSm = size === 'sm';

  const normalized = (severity || '').toLowerCase();

  const config = {
    critical: {
      bg: 'bg-[#fdf0f0]',
      border: 'border-[#d95757]/25',
      text: 'text-[#d95757]',
      dot: 'bg-[#d95757]',
      icon: AlertOctagon,
      label: 'CRITICAL'
    },
    high: {
      bg: 'bg-[#fdf6ea]',
      border: 'border-[#d69a38]/30',
      text: 'text-[#d69a38]',
      dot: 'bg-[#d69a38]',
      icon: AlertTriangle,
      label: 'HIGH'
    },
    medium: {
      bg: 'bg-[#fdf6ea]/70',
      border: 'border-[#d69a38]/25',
      text: 'text-[#d69a38]',
      dot: 'bg-[#d69a38]',
      icon: AlertCircle,
      label: 'MEDIUM'
    },
    low: {
      bg: 'bg-[#f0f5fa]',
      border: 'border-[#4b83c5]/25',
      text: 'text-[#4b83c5]',
      dot: 'bg-[#4b83c5]',
      icon: ShieldCheck,
      label: 'LOW'
    }
  }[normalized] || {
    bg: 'bg-[#f0f6f6]',
    border: 'border-[#dce5e7]',
    text: 'text-[#61777c]',
    dot: 'bg-[#8a9b9f]',
    icon: ShieldCheck,
    label: (severity || 'INFO').toUpperCase()
  };

  const IconComp = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border font-medium ${config.bg} ${config.border} ${config.text} ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <IconComp className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
