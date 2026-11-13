import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center rounded-xl border border-dashed border-[#374151] bg-[#151E2D]/40">
      <div className="w-12 h-12 rounded-full bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#9CA3AF] mb-4">
        <Icon className="w-6 h-6 text-[#9CA3AF]" />
      </div>
      <h3 className="text-base font-semibold text-[#F9FAFB]">{title}</h3>
      <p className="mt-1 text-sm text-[#9CA3AF] max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-[#263244] border border-[#374151] text-[#F9FAFB] hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

