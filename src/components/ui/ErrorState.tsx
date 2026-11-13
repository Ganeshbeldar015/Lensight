import React from 'react';
import { Button } from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-[rgba(235,52,36,0.25)] bg-[rgba(235,52,36,0.04)] ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[rgba(235,52,36,0.12)] border border-[rgba(235,52,36,0.3)] flex items-center justify-center mb-3 text-[#eb3424]">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#f5f5f5] mb-1">{title}</h3>
      <p className="text-sm text-[#ff9990] max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
