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
  Flame, 
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
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Alert Triage & Incident Center"
        description="Priority dispatch queue for real-time security breaches and operational boundary alarms."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 flex items-center gap-1.5 font-bold">
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
              leftIcon={<CheckCheck className="w-4 h-4 text-emerald-600" />}
            >
              Acknowledge All Unread
            </Button>
          ) : undefined
        }
      />

      {/* Tabs and Severity Filter Strip */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
        {/* Triage Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'unread'
                ? 'bg-[#fa5d19] text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Unread</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'unread' ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {unreadCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#fa5d19] text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Alerts</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'all' ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {alerts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('acknowledged')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'acknowledged'
                ? 'bg-[#fa5d19] text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Acknowledged</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'acknowledged' ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {acknowledgedCount}
            </span>
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 font-semibold hidden sm:inline-block">SEVERITY:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['all', 'critical', 'high', 'medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-slate-900 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
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
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                  isUnread
                    ? isCritical
                      ? 'bg-red-50/70 border-red-200 hover:border-red-400 hover:shadow-md'
                      : 'bg-orange-50/40 border-orange-200 hover:border-orange-400 hover:shadow-md'
                    : 'bg-white border-slate-200 opacity-80 hover:opacity-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-red-600 text-white shadow-xs'
                        : alert.severity === 'high'
                        ? 'bg-[#fa5d19] text-white shadow-xs'
                        : 'bg-amber-500 text-white shadow-xs font-bold'
                    }`}
                  >
                    {isCritical ? <Flame className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{alert.id}</span>
                      <SeverityBadge severity={alert.severity} size="sm" />
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#fa5d19] animate-pulse" />
                      )}
                    </div>
                    <h4 className={`text-sm text-slate-900 ${isUnread ? 'font-bold' : 'font-medium'}`}>
                      {alert.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-1">{alert.description}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1 text-slate-600">
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
                    <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Detail Side Panel / Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#fa5d19]">{selectedAlert.id}</span>
                <SeverityBadge severity={selectedAlert.severity} size="sm" />
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{selectedAlert.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedAlert.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">CAMERA NODE</span>
                <span className="text-slate-900 font-semibold">{selectedAlert.cameraName || selectedAlert.cameraId}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">OCCURRED AT</span>
                <span className="text-slate-900">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">LINKED EVENT</span>
                <span className="text-[#fa5d19] font-bold">{selectedAlert.eventId}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">STATUS</span>
                <span className={selectedAlert.acknowledged ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                  {selectedAlert.acknowledged ? 'Acknowledged' : 'Pending Operator Triage'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
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
