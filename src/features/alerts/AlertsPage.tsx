import React, { useState } from 'react';
import { useAlerts } from '@/context/AlertContext';
import type { Alert, Severity } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  ShieldAlert, 
  CheckCheck, 
  Check, 
  Clock, 
  Camera, 
  Filter, 
  ShieldCheck, 
  Flame, 
  X,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, unreadCount, acknowledgeAlert, acknowledgeAll } = useAlerts();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'acknowledged'>('unread');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Filter alerts by tab and severity
  const filteredAlerts = alerts.filter((a) => {
    let tabMatch = true;
    if (activeTab === 'unread') tabMatch = !a.acknowledged;
    if (activeTab === 'acknowledged') tabMatch = a.acknowledged;

    const sevMatch = severityFilter === 'all' || a.severity === severityFilter;
    return tabMatch && sevMatch;
  });

  const acknowledgedCount = alerts.filter((a) => a.acknowledged).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Alert Triage & Incident Center"
        description="Priority dispatch queue for real-time security breaches and operational boundary alarms."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[rgba(235,52,36,0.12)] border border-[#eb3424]/30 text-[#eb3424] flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            {unreadCount} ACTIVE ALARMS
          </span>
        }
        actions={
          unreadCount > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={acknowledgeAll}
              leftIcon={<CheckCheck className="w-4 h-4 text-[#22c55e]" />}
            >
              Acknowledge All Unread
            </Button>
          ) : undefined
        }
      />

      {/* Tabs and Severity Filter Strip (FR-AL-2, FR-AL-5) */}
      <div className="p-3.5 rounded-xl border border-[#262626] bg-[#121212] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-md">
        {/* Triage Tabs */}
        <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-[#2d2d2d]">
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-all flex items-center gap-2 ${
              activeTab === 'unread'
                ? 'bg-[#fa5d19] text-white font-bold shadow'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <span>Unread</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40">
              {unreadCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-[#fa5d19] text-white font-bold shadow'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <span>All Alerts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40">
              {alerts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('acknowledged')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-all flex items-center gap-2 ${
              activeTab === 'acknowledged'
                ? 'bg-[#fa5d19] text-white font-bold shadow'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <span>Acknowledged</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40">
              {acknowledgedCount}
            </span>
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#777] hidden sm:inline-block">SEVERITY:</span>
          <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-[#2d2d2d]">
            {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                  severityFilter === sev
                    ? 'bg-[#282828] text-white border border-[#444] font-bold'
                    : 'text-[#777] hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List (FR-AL-1) */}
      {filteredAlerts.length === 0 ? (
        // Empty State (FR-AL-6)
        <EmptyState
          icon={ShieldCheck}
          title="All Clear: No Security Alerts to Review"
          description={
            activeTab === 'unread'
              ? 'All incoming critical alarms and high-priority incidents have been acknowledged.'
              : 'No alerts match the selected criteria.'
          }
          actionLabel={activeTab !== 'all' ? 'View All Alerts' : undefined}
          onAction={() => setActiveTab('all')}
        />
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isUnread = !alert.acknowledged;

            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isUnread
                    ? isCritical
                      ? 'bg-[rgba(235,52,36,0.06)] border-[rgba(235,52,36,0.35)] hover:border-[#eb3424]'
                      : 'bg-[#151515] border-[#fa5d19]/30 hover:border-[#fa5d19]'
                    : 'bg-[#121212] border-[#222] opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-[#eb3424] text-white shadow-md'
                        : alert.severity === 'high'
                        ? 'bg-[#fa5d19] text-white'
                        : 'bg-[#ecb730] text-black font-bold'
                    }`}
                  >
                    {isCritical ? <Flame className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{alert.id}</span>
                      <SeverityBadge severity={alert.severity} size="sm" />
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#fa5d19] animate-pulse" />
                      )}
                    </div>
                    <h4 className={`text-sm text-white ${isUnread ? 'font-bold' : 'font-medium'}`}>
                      {alert.title}
                    </h4>
                    <p className="text-xs text-[#888] line-clamp-1">{alert.description}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#666] pt-0.5">
                      <span className="flex items-center gap-1 text-[#aaa]">
                        <Camera className="w-3 h-3 text-[#fa5d19]" />
                        {alert.cameraName || alert.cameraId}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {isUnread ? (
                    <Button
                      variant={isCritical ? 'destructive' : 'primary'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        acknowledgeAlert(alert.id);
                      }}
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      Acknowledge
                    </Button>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono text-xs text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-md border border-[#22c55e]/20">
                      <Check className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Detail Side Panel / Modal (FR-AL-4) */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-[#333] bg-[#141414] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#fa5d19]">{selectedAlert.id}</span>
                <SeverityBadge severity={selectedAlert.severity} size="sm" />
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1">{selectedAlert.title}</h3>
              <p className="text-xs text-[#aaa] leading-relaxed bg-[#1b1b1b] p-3 rounded-lg border border-[#2a2a2a]">
                {selectedAlert.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#181818] border border-[#262626]">
                <span className="text-[#666] block text-[10px]">CAMERA NODE</span>
                <span className="text-white font-semibold">{selectedAlert.cameraName || selectedAlert.cameraId}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#181818] border border-[#262626]">
                <span className="text-[#666] block text-[10px]">OCCURRED AT</span>
                <span className="text-white">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#181818] border border-[#262626]">
                <span className="text-[#666] block text-[10px]">LINKED EVENT</span>
                <span className="text-[#fa5d19] font-bold">{selectedAlert.eventId}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#181818] border border-[#262626]">
                <span className="text-[#666] block text-[10px]">STATUS</span>
                <span className={selectedAlert.acknowledged ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                  {selectedAlert.acknowledged ? 'Acknowledged' : 'Pending Operator Triage'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  const evId = selectedAlert.eventId;
                  setSelectedAlert(null);
                  navigate(`/events?search=${encodeURIComponent(evId)}`);
                }}
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Jump to Event Log
              </Button>

              <div className="flex items-center gap-2">
                {!selectedAlert.acknowledged && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      acknowledgeAlert(selectedAlert.id);
                      setSelectedAlert({ ...selectedAlert, acknowledged: true });
                    }}
                  >
                    Acknowledge Now
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => setSelectedAlert(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
