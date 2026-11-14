import React from 'react';

export const PageHeader = ({
  title,
  description,
  badge,
  actions
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 border-b border-[#dce5e7]">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-[#263b40] tracking-tight">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[#61777c] mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
