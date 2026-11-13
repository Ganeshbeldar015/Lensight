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
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-300 bg-white shadow-xs ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center mb-3 text-[#fa5d19]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
