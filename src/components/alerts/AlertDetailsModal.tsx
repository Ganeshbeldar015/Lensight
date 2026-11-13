import React from 'react';
import type { Alert } from '@/types';
import { Modal } from '@/components/common/Modal';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import {
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AlertDetailsModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({
  alert,
  isOpen,
  onClose,
}) => {
  const { acknowledgeAlert, showToast } = useApp();

  if (!alert) return null;

  const handleAcknowledge = () => {
    acknowledgeAlert(alert.id);
    showToast(`Alert ${alert.id} acknowledged`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Security Alert Dossier – ${alert.id}`}
      subtitle={`Associated Event: ${alert.eventId} • Camera: ${alert.cameraName || alert.cameraId}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#151E2D] border border-[#374151]">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={alert.severity} />
            <span className="text-xs font-mono text-[#9CA3AF]">
              Origin: {alert.cameraName || alert.cameraId} ({alert.cameraId})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {alert.acknowledged ? (
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ACKNOWLEDGED
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                ACTION REQUIRED
              </span>
            )}
          </div>
        </div>

        {/* Title and Incident Narrative */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#F9FAFB] leading-snug">{alert.title}</h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed bg-[#151E2D] p-4 rounded-xl border border-[#374151]">
            {alert.description}
          </p>
        </div>

        {/* Timeline & Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#151E2D] border border-[#374151] space-y-1">
            <span className="text-[11px] font-mono text-[#6B7280] uppercase">Detected At</span>
            <div className="font-mono text-[#F9FAFB] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#151E2D] border border-[#374151] space-y-1">
            <span className="text-[11px] font-mono text-[#6B7280] uppercase">Operator Status</span>
            <div className="font-mono text-[#F9FAFB] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              {alert.acknowledged
                ? `Logged by Watch Officer at ${new Date(
                    alert.acknowledgedAt || alert.timestamp
                  ).toLocaleTimeString()}`
                : 'Pending Duty Watch Officer review'}
            </div>
          </div>
        </div>

        {/* Standard Operating Procedure (SOP) guidance */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#374151] space-y-2">
          <h4 className="text-xs font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> Standard Escalation Procedure (SOP)
          </h4>
          <ul className="text-xs text-[#9CA3AF] space-y-1.5 list-disc list-inside">
            <li>Review live camera stream for immediate perimeter threats.</li>
            <li>Dispatch on-duty security patrol unit to {alert.cameraName || alert.cameraId}.</li>
            <li>Preserve optical evidence snapshot and tag supervisor in incident log.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#374151]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-[#263244] border border-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
          >
            Close
          </button>

          {!alert.acknowledged && (
            <button
              type="button"
              onClick={handleAcknowledge}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Acknowledge & Sign Log
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
