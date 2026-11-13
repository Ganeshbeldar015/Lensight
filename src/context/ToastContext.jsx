import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.durationMs || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border-muted)] bg-[var(--color-surface-raised)] shadow-2xl text-[var(--color-accent-text)] transition-all animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[var(--color-accent-forest)]" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[var(--color-accent-honey)]" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[var(--color-accent-crimson)]" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-[var(--color-heat-100)]" />}
            </div>

            <div className="flex-1 min-w-0">
              {t.title && <h4 className="text-sm font-semibold mb-0.5">{t.title}</h4>}
              <p className="text-xs text-[#a0a0a0] leading-relaxed">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-[#666] hover:text-[#fff] p-1 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
