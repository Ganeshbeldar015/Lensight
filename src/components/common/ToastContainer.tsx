import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    message: string;
    durationMs?: number;
  };
  onDismiss: () => void;
}> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.durationMs || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-[#1F2937]',
    warning: 'border-amber-500/30 bg-[#1F2937]',
    error: 'border-red-500/30 bg-[#1F2937]',
    info: 'border-blue-500/30 bg-[#1F2937]',
  };

  return (
    <div
      className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider mb-0.5">
            {toast.title}
          </h4>
        )}
        <p className="text-xs text-[#9CA3AF] leading-relaxed break-words">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-[#6B7280] hover:text-[#F9FAFB] p-0.5 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

