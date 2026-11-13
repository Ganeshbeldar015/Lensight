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
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#dce5e7] bg-white shadow-xs ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#ddf1f1] border border-[#168a91]/20 flex items-center justify-center mb-3 text-[#168a91]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#263b40] mb-1">{title}</h3>
      <p className="text-sm text-[#61777c] max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
