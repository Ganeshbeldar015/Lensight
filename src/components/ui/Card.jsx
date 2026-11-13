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
      className={`rounded-xl border border-slate-200 ${
        raised ? 'bg-slate-50' : 'bg-white'
      } p-5 shadow-xs transition-all duration-200 ${
        hoverable
          ? 'hover:border-slate-300 hover:shadow-sm cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
