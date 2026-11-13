import React, { useState } from 'react';
import { useAlerts } from '@/context/AlertContext';
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
  ShieldCheck, 
  AlertTriangle,
  X,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlertsPage = () => {
  const navigate = useNavigate();
  const { alerts, unreadCount, acknowledgeAlert, acknowledgeAll } = useAlerts();

  const [activeTab, setActiveTab] = useState('unread');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = alerts.filter((a) => {
    let tabMatch = true;
    if (activeTab === 'unread') tabMatch = !a.acknowledged;
    if (activeTab === 'acknowledged') tabMatch = a.acknowledged;

    const sevMatch = severityFilter === 'all' || a.severity === severityFilter;
    return tabMatch && sevMatch;
  });

  const acknowledgedCount = alerts.filter((a) => a.acknowledged).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alert Center"
        description="Priority dispatch queue for real-time security breaches and operational alarms."
        badge={
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-[#DC5656] flex items-center gap-1.5 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            {unreadCount} Active {unreadCount === 1 ? 'Alert' : 'Alerts'}
          </span>
        }
        actions={
          unreadCount > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={acknowledgeAll}
              leftIcon={<CheckCheck className="w-4 h-4 text-[#16845B]" />}
            >
              Acknowledge All Unread
            </Button>
          ) : undefined
        }
      />

      {/* Tabs and Severity Filter Strip */}
      <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
        {/* Triage Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-[#E5E7EB]">
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-md text-xs uppercase font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'unread'
                ? 'bg-[#16845B] text-white font-semibold shadow-xs'
                : 'text-[#64748B] hover:text-[#1F2937]'
            }`}
          >
            <span>Unread</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
              activeTab === 'unread' ? 'bg-white/30 text-white' : 'bg-slate-200 text-[#1F2937]'
            }`}>
              {unreadCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs uppercase font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#16845B] text-white font-semibold shadow-xs'
                : 'text-[#64748B] hover:text-[#1F2937]'
            }`}
          >
            <span>All Alerts</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
              activeTab === 'all' ? 'bg-white/30 text-white' : 'bg-slate-200 text-[#1F2937]'
            }`}>
              {alerts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('acknowledged')}
            className={`px-3 py-1.5 rounded-md text-xs uppercase font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'acknowledged'
                ? 'bg-[#16845B] text-white font-semibold shadow-xs'
                : 'text-[#64748B] hover:text-[#1F2937]'
            }`}
          >
            <span>Acknowledged</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
              activeTab === 'acknowledged' ? 'bg-white/30 text-white' : 'bg-slate-200 text-[#1F2937]'
            }`}>
              {acknowledgedCount}
            </span>
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase text-[#64748B] font-semibold hidden sm:inline-block">Severity:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-[#E5E7EB]">
            {['all', 'critical', 'high', 'medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-xs uppercase font-medium transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-[#1F2937] text-white font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2937]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="All Clear: No Alerts to Review"
          description={
            activeTab === 'unread'
              ? 'All incoming security alarms and incidents have been acknowledged.'
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
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                  isUnread
                    ? isCritical
                      ? 'bg-red-50/70 border-red-200 hover:border-red-400 hover:shadow-md'
                      : 'bg-amber-50/40 border-amber-200 hover:border-amber-400 hover:shadow-md'
                    : 'bg-white border-[#E5E7EB] opacity-80 hover:opacity-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-[#DC5656] text-white shadow-xs'
                        : alert.severity === 'high'
                        ? 'bg-[#D99A26] text-white shadow-xs'
                        : 'bg-[#4B83C5] text-white shadow-xs font-bold'
                    }`}
                  >
                    {isCritical ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#1F2937]">{alert.id}</span>
                      <SeverityBadge severity={alert.severity} size="sm" />
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#16845B] animate-pulse" />
                      )}
                    </div>
                    <h4 className={`text-sm text-[#1F2937] ${isUnread ? 'font-semibold' : 'font-medium'}`}>
                      {alert.title}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-1">{alert.description}</p>
                    <div className="flex items-center gap-3 text-xs text-[#64748B] pt-0.5">
                      <span className="flex items-center gap-1 font-medium text-[#1F2937]">
                        <Camera className="w-3.5 h-3.5 text-[#16845B]" />
                        {alert.cameraName || alert.cameraId}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
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
                    <span className="flex items-center gap-1.5 text-xs text-[#16845B] bg-[#EAF5EF] px-2.5 py-1 rounded-md border border-[#16845B]/20 font-medium">
                      <Check className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-[#16845B]">{selectedAlert.id}</span>
                <SeverityBadge severity={selectedAlert.severity} size="sm" />
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1F2937] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#1F2937] mb-1">{selectedAlert.title}</h3>
              <p className="text-xs text-[#1F2937] leading-relaxed bg-slate-50 p-3 rounded-lg border border-[#E5E7EB]">
                {selectedAlert.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                <span className="text-[#64748B] block text-[10px] uppercase">Camera</span>
                <span className="text-[#1F2937] font-semibold">{selectedAlert.cameraName || selectedAlert.cameraId}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                <span className="text-[#64748B] block text-[10px] uppercase">Occurred At</span>
                <span className="text-[#1F2937]">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                <span className="text-[#64748B] block text-[10px] uppercase">Linked Event</span>
                <span className="text-[#16845B] font-mono font-medium">{selectedAlert.eventId}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                <span className="text-[#64748B] block text-[10px] uppercase">Status</span>
                <span className={selectedAlert.acknowledged ? 'text-[#16845B] font-semibold' : 'text-[#DC5656] font-semibold'}>
                  {selectedAlert.acknowledged ? 'Acknowledged' : 'Pending Review'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
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
