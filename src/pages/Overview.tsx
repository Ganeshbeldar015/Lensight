import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { EventTypeBadge } from '@/components/common/EventTypeBadge';
import { EventsLineChart } from '@/components/analytics/EventsLineChart';
import { CameraDetailsModal } from '@/components/cameras/CameraDetailsModal';
import { EventDetailsModal } from '@/components/events/EventDetailsModal';
import { AlertDetailsModal } from '@/components/alerts/AlertDetailsModal';
import type { Camera, DetectionEvent, Alert } from '@/types';
import {
  Camera as CameraIcon,
  Video,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Radio,
  Eye,
} from 'lucide-react';

export const Overview: React.FC = () => {
  const { cameras, events, alerts, kpis, acknowledgeAlert } = useApp();

  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DetectionEvent | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Recent 6 detection events
  const recentEvents = useMemo(() => events.slice(0, 6), [events]);

  // Top critical or high alerts
  const criticalAlerts = useMemo(
    () => alerts.filter((a) => a.severity === 'critical' || a.severity === 'high').slice(0, 4),
    [alerts]
  );

  // Hourly event trend today for Recharts
  const hourlyActivityData = useMemo(() => {
    const hours = ['02:00', '05:00', '08:00', '11:00', '14:00', '17:00', '20:00', '23:00'];
    return hours.map((hour, idx) => {
      const base = 8 + ((idx * 7 + 3) % 15);
      return {
        time: hour,
        person: Math.floor(base * 0.45),
        vehicle: Math.floor(base * 0.3),
        motion: Math.floor(base * 0.15),
        restricted_area: Math.floor(base * 0.1),
        total: base,
      };
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Operations Overview"
        subtitle="Unified command telemetry, active optical detections, and critical alert dispatch"
        breadcrumbs={[{ label: 'Lensight' }, { label: 'Overview' }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/monitoring"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Open Video Wall</span>
            </Link>
          </div>
        }
      />

      {/* KPI Cards Row (Total Cameras: 20, Active Cameras: 17, Events Today: 145, Critical Alerts: 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Cameras"
          value={kpis.totalCameras}
          icon={CameraIcon}
          subtext="Distributed surveillance fleet"
          trend={{ value: '100% Provisioned', isPositive: true }}
          indicatorColor="blue"
        />

        <StatCard
          label="Active Cameras"
          value={kpis.activeCameras}
          icon={Video}
          subtext={`${kpis.warningCount} warning • ${kpis.offlineCount} offline`}
          trend={{ value: `${Math.round((kpis.activeCameras / kpis.totalCameras) * 100)}% Operational`, isPositive: true }}
          indicatorColor="emerald"
        />

        <StatCard
          label="Events Today"
          value={kpis.eventsToday}
          icon={Activity}
          subtext="AI Computer Vision Detections"
          trend={{ value: '+14% vs avg', isPositive: true }}
          indicatorColor="amber"
        />

        <StatCard
          label="Critical Alerts"
          value={kpis.criticalAlerts}
          icon={AlertTriangle}
          subtext="Immediate operator attention"
          trend={{ value: `${alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length} unacknowledged`, isPositive: false }}
          indicatorColor="red"
          highlight={alerts.some((a) => a.severity === 'critical' && !a.acknowledged)}
        />
      </div>

      {/* Camera Health & Critical Alerts Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section A: Camera Health Overview */}
        <div className="lg:col-span-5 bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
              <CameraIcon className="w-4 h-4 text-emerald-400" />
              Camera Health Distribution
            </h3>
            <Link
              to="/cameras"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              Manage Fleet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Health Bar Progress */}
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-[#111827] rounded-full overflow-hidden flex border border-[#374151]">
              <div
                style={{ width: `${(kpis.onlineCount / kpis.totalCameras) * 100}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`Online: ${kpis.onlineCount}`}
              />
              <div
                style={{ width: `${(kpis.warningCount / kpis.totalCameras) * 100}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Warning: ${kpis.warningCount}`}
              />
              <div
                style={{ width: `${(kpis.offlineCount / kpis.totalCameras) * 100}%` }}
                className="bg-red-500 h-full transition-all duration-500"
                title={`Offline: ${kpis.offlineCount}`}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[#9CA3AF]">Online ({kpis.onlineCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-[#9CA3AF]">Warning ({kpis.warningCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[#9CA3AF]">Offline ({kpis.offlineCount})</span>
              </div>
            </div>
          </div>

          {/* Quick list of non-normal cameras */}
          <div className="pt-3 border-t border-[#374151]/60 space-y-2.5">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block">
              Attention Required
            </span>

            {cameras
              .filter((c) => c.status !== 'online')
              .map((cam) => (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCamera(cam)}
                  className="p-2.5 rounded-xl bg-[#151E2D] border border-[#374151] flex items-center justify-between text-xs cursor-pointer hover:border-[#4B5563] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">{cam.id}</span>
                    <span className="text-[#F9FAFB] font-medium">{cam.name}</span>
                  </div>
                  <StatusBadge status={cam.status} size="sm" />
                </div>
              ))}
          </div>
        </div>

        {/* Section C: Critical Alerts */}
        <div className="lg:col-span-7 bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Priority Incident Queue
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-mono font-bold">
                {kpis.criticalAlerts} Critical
              </span>
            </div>

            <Link
              to="/alerts"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              View All Alerts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className="p-3 rounded-xl bg-[#151E2D] border border-[#374151] hover:border-[#4B5563] transition-colors flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{alert.id}</span>
                    <SeverityBadge severity={alert.severity} size="sm" />
                    <span className="text-[10px] font-mono text-[#9CA3AF]">
                      {alert.cameraName || alert.cameraId}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#F9FAFB] truncate">{alert.title}</h4>
                  <p className="text-[11px] text-[#9CA3AF] line-clamp-1">{alert.description}</p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] font-mono text-[#6B7280]">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!alert.acknowledged ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] font-mono transition-colors"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Ack
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section D: Event Activity Chart */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Event Activity Trend (Today)
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Hourly distribution of AI detections across all optical cameras
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#9CA3AF]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Total
            </span>
            <span className="flex items-center gap-1.5 text-[#9CA3AF]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Person
            </span>
            <span className="flex items-center gap-1.5 text-[#9CA3AF]">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Vehicle
            </span>
          </div>
        </div>

        <EventsLineChart data={hourlyActivityData} />
      </div>

      {/* Section B: Recent Detection Activity */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Recent AI Detection Activity
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Latest computer vision telemetry events logged from active streams
            </p>
          </div>

          <Link
            to="/events"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            Open Event Audit Log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#374151] bg-[#151E2D] text-[#9CA3AF] font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Camera</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]/50 text-[#F9FAFB]">
              {recentEvents.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="hover:bg-[#263244]/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">{evt.id}</td>
                  <td className="py-3 px-3">
                    <EventTypeBadge type={evt.type} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-medium">{evt.cameraName || evt.cameraId}</td>
                  <td className="py-3 px-3 font-mono text-[#9CA3AF]">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">
                    {Math.round(evt.confidence * 100)}%
                  </td>
                  <td className="py-3 px-3">
                    <SeverityBadge severity={evt.severity} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(evt);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#263244] border border-[#374151] text-[#9CA3AF] group-hover:text-emerald-400 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CameraDetailsModal
        camera={selectedCamera}
        isOpen={Boolean(selectedCamera)}
        onClose={() => setSelectedCamera(null)}
      />

      <EventDetailsModal
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
      />

      <AlertDetailsModal
        alert={selectedAlert}
        isOpen={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
};
