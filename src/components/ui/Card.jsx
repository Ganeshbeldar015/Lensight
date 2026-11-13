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
      className={`rounded-xl border border-[#dce5e7] ${
        raised ? 'bg-[#f0f6f6]' : 'bg-white'
      } p-5 shadow-xs transition-all duration-200 ${
        hoverable
          ? 'hover:border-[#69aeb0] hover:shadow-sm cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
