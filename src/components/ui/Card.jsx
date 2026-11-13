import React from 'react';

export const Card = ({
  children,
  hoverable = false,
  raised = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border-muted)] ${
        raised ? 'bg-[var(--color-surface-raised)]' : 'bg-[var(--color-surface)]'
      } p-5 ${
        hoverable
          ? 'hover:border-[#fa5d19]/40 hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
