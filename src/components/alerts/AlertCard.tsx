import React from 'react';
import type { Alert } from '@/types';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { CheckCircle2, Clock, Camera, Eye, BellOff, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AlertCardProps {
  alert: Alert;
  onSelectAlert: (alert: Alert) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onSelectAlert }) => {
  const { markAlertAsRead, markAlertAsUnread, acknowledgeAlert } = useApp();

  const isCritical = alert.severity === 'critical';
  const isHigh = alert.severity === 'high';

  return (
    <div
      onClick={() => onSelectAlert(alert)}
      className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer ${
        !alert.read
          ? isCritical
            ? 'bg-[#1F2937] border-red-500/50 shadow-lg shadow-red-500/5'
            : isHigh
            ? 'bg-[#1F2937] border-orange-500/40'
            : 'bg-[#1F2937] border-amber-500/30'
          : 'bg-[#151E2D]/70 border-[#374151] hover:border-[#4B5563]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {alert.id}
            </span>
            <SeverityBadge severity={alert.severity} size="sm" />

            {!alert.read && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                UNREAD
              </span>
            )}

            {alert.acknowledged ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Acknowledged</span>
              </span>
            ) : (
              <span className="text-[11px] font-mono text-amber-400 font-medium">
                Pending Acknowledgment
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-[#F9FAFB] group-hover:text-emerald-400 transition-colors line-clamp-1">
            {alert.title}
          </h3>

          <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
            {alert.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6B7280] pt-1">
            <span className="flex items-center gap-1 text-[#9CA3AF]">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              {alert.cameraName || alert.cameraId} ({alert.cameraId})
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div
          className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#374151]/50"
          onClick={(e) => e.stopPropagation()}
        >
          {!alert.acknowledged ? (
            <button
              onClick={() => acknowledgeAlert(alert.id)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
              title="Acknowledge alert"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acknowledge</span>
            </button>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400/80">
              Resolved: {new Date(alert.acknowledgedAt || alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => (alert.read ? markAlertAsUnread(alert.id) : markAlertAsRead(alert.id))}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#263244] transition-colors"
              title={alert.read ? 'Mark as Unread' : 'Mark as Read'}
            >
              <BellOff className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectAlert(alert)}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#263244] transition-colors"
              title="View Incident Dossier"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

