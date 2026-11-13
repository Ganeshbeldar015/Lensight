import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { AlertCard } from '@/components/alerts/AlertCard';
import { AlertDetailsModal } from '@/components/alerts/AlertDetailsModal';
import { EmptyState } from '@/components/common/EmptyState';
import type { Alert } from '@/types';
import {
  Bell,
  CheckCircle2,
  ShieldAlert,
  Search,
  CheckCheck,
} from 'lucide-react';

export const Alerts: React.FC = () => {
  const {
    alerts,
    markAllAlertsAsRead,
    acknowledgeAllAlerts,
    unreadAlertsCount,
    criticalAlertCount,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'pending'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
      if (statusFilter === 'unread' && alert.read) return false;
      if (statusFilter === 'pending' && alert.acknowledged) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = alert.title.toLowerCase().includes(q);
        const matchDesc = alert.description.toLowerCase().includes(q);
        const matchCam = (alert.cameraName || '').toLowerCase().includes(q) || alert.cameraId.toLowerCase().includes(q);
        const matchId = alert.id.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCam && !matchId) return false;
      }
      return true;
    });
  }, [alerts, severityFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Alert Command Center"
        subtitle="Real-time incident dispatch queue, operator acknowledgments, and forensic escalation"
        breadcrumbs={[{ label: 'Lensight' }, { label: 'Alert Center' }]}
        actions={
          <div className="flex items-center gap-2">
            {unreadAlertsCount > 0 && (
              <button
                onClick={markAllAlertsAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#263244] border border-[#374151] hover:border-emerald-500/40 text-[#F9FAFB] hover:text-emerald-400 transition-colors"
              >
                <CheckCheck className="w-4 h-4 text-emerald-400" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              onClick={acknowledgeAllAlerts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Acknowledge All</span>
            </button>
          </div>
        }
      />

      {/* KPI Alert Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#1F2937] border border-red-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-red-400 font-semibold uppercase tracking-wider">
              Critical Severity
            </span>
            <span className="text-2xl font-bold font-mono text-[#F9FAFB] mt-1 block">
              {alerts.filter((a) => a.severity === 'critical').length}
            </span>
            <span className="text-[10px] text-[#9CA3AF] mt-0.5 block">
              {criticalAlertCount} pending acknowledgment
            </span>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1F2937] border border-orange-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-orange-400 font-semibold uppercase tracking-wider">
              High Severity
            </span>
            <span className="text-2xl font-bold font-mono text-[#F9FAFB] mt-1 block">
              {alerts.filter((a) => a.severity === 'high').length}
            </span>
            <span className="text-[10px] text-[#9CA3AF] mt-0.5 block">
              {alerts.filter((a) => a.severity === 'high' && !a.acknowledged).length} pending acknowledgment
            </span>
          </div>
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1F2937] border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              Unread Notifications
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {unreadAlertsCount}
            </span>
            <span className="text-[10px] text-[#9CA3AF] mt-0.5 block">
              Synchronized with top header
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by title or camera..."
            className="w-full bg-[#111827] border border-[#374151] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Severity & Status Tabs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Tabs */}
          <div className="flex rounded-xl bg-[#111827] p-1 border border-[#374151] text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`py-1 px-2.5 rounded-lg font-mono text-xs transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#263244] text-emerald-400 font-semibold'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('unread')}
              className={`py-1 px-2.5 rounded-lg font-mono text-xs transition-colors ${
                statusFilter === 'unread'
                  ? 'bg-[#263244] text-emerald-400 font-semibold'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`py-1 px-2.5 rounded-lg font-mono text-xs transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-[#263244] text-amber-400 font-semibold'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              Pending Ack
            </button>
          </div>

          {/* Severity Tabs */}
          <div className="flex rounded-xl bg-[#111827] p-1 border border-[#374151] text-xs">
            {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`py-1 px-2.5 rounded-lg font-mono text-xs uppercase transition-colors ${
                  severityFilter === sev
                    ? 'bg-[#263244] text-emerald-400 font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Cards List */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No Alerts in Current View"
          description="There are no security alerts matching your selected severity or status filters."
          actionLabel="Reset Alert Filters"
          onAction={() => {
            setSearchQuery('');
            setSeverityFilter('all');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onSelectAlert={(a) => setSelectedAlert(a)}
            />
          ))}
        </div>
      )}

      {/* Alert Dossier Details Modal */}
      <AlertDetailsModal
        alert={selectedAlert}
        isOpen={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
};
