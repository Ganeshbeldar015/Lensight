import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-lg border ${
              isDestructive
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-sm text-[#9CA3AF] leading-relaxed">{message}</div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#374151]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-[#263244] border border-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] hover:border-[#4B5563] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-medium rounded-lg text-white transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

