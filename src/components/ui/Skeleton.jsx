import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#242424] rounded-md ${className}`}
      aria-hidden="true"
    />
  );
};
