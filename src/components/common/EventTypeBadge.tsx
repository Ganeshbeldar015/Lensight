import React from 'react';
import type { EventType } from '@/types';
import { User, Car, Activity, ShieldAlert } from 'lucide-react';

interface EventTypeBadgeProps {
  type: EventType;
  size?: 'sm' | 'md';
}

export const EventTypeBadge: React.FC<EventTypeBadgeProps> = ({ type, size = 'md' }) => {
  const configs: Record<
    EventType,
    { label: string; icon: React.ElementType; color: string }
  > = {
    person: {
      label: 'Person Detected',
      icon: User,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    vehicle: {
      label: 'Vehicle Detected',
      icon: Car,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    motion: {
      label: 'Motion Detected',
      icon: Activity,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    restricted_area: {
      label: 'Restricted Area Entry',
      icon: ShieldAlert,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
  };

  const c = configs[type] || configs.motion;
  const Icon = c.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${
        c.color
      } ${isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}
    >
      <Icon className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{c.label}</span>
    </span>
  );
};

