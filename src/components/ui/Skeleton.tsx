import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#242424] rounded-md ${className}`}
      aria-hidden="true"
    />
  );
};
