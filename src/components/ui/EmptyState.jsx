import React from 'react';
import { Button } from './Button';
import { Search } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#E5E7EB] bg-white shadow-xs ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#EAF5EF] border border-[#16845B]/20 flex items-center justify-center mb-3 text-[#16845B]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#1F2937] mb-1">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
