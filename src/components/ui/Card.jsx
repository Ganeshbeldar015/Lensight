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
      className={`rounded-xl border border-slate-200/90 ${
        raised ? 'bg-slate-50' : 'bg-white'
      } p-5 shadow-xs transition-all duration-200 ${
        hoverable
          ? 'hover:border-orange-300 hover:shadow-md cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
