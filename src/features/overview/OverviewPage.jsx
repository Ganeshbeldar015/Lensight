import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCameras } from '@/context/CameraContext';
import { useAlerts } from '@/context/AlertContext';
import { dataProvider } from '@/services/dataProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { EventTypeBadge } from '@/components/ui/EventTypeBadge';
import { CCTVVideoFeed } from '@/components/cameras/CCTVVideoFeed';
import { EventDetailModal } from '@/components/events/EventDetailModal';
import { 
  Camera, 
  Activity, 
  ShieldAlert, 
  ArrowRight, 
  Video, 
  TrendingUp, 
  AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const OverviewPage = () => {
  const navigate = useNavigate();
  const { cameras, loading: camerasLoading } = useCameras();
  const { alerts, acknowledgeAlert } = useAlerts();

  const [kpis, setKpis] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [playingCamera, setPlayingCamera] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const kpiData = await dataProvider.getOverviewKpis();
        setKpis(kpiData);

        const eventsRes = await dataProvider.getEvents({ limit: 8, sortBy: 'timestamp', sortOrder: 'desc' });
        setRecentEvents(eventsRes.events);

        const analytics = await dataProvider.getAnalyticsData('24h');
        const miniTrend = analytics.eventsOverTime.slice(-12).map((b) => ({
          hour: b.label,
          count: b.count
        }));
        setTrendData(miniTrend);
      } catch (err) {
        console.error('Failed to load overview data', err);
      }
    }
    loadData();
  }, [cameras, alerts]);

  const urgentAlerts = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged);
  const previewCameras = cameras.slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Operations Overview"
        description="Unified monitoring dashboard for multi-camera feeds, security alerts, and detection telemetry."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/live')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Live Camera Wall
          </Button>
        }
      />

      {/* Critical Alerts Banner if any */}
      {urgentAlerts.length > 0 && (
        <div className="p-4 rounded-xl border border-[#d95757]/30 bg-[#fdf0f0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#d95757] flex items-center justify-center text-white shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#263b40]">
                  {urgentAlerts.length} Critical Security {urgentAlerts.length === 1 ? 'Alert' : 'Alerts'} Pending
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#fdf0f0] text-[#d95757] border border-[#d95757]/30 font-semibold">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-[#61777c] mt-0.5">
                {urgentAlerts[0].title} &bull; <span className="font-medium text-[#263b40]">{urgentAlerts[0].cameraName || urgentAlerts[0].cameraId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => acknowledgeAlert(urgentAlerts[0].id)}
            >
              Acknowledge Incident
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/alerts')}
            >
              View Alerts
            </Button>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cameras */}
        <Card hoverable onClick={() => navigate('/cameras')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#61777c] font-semibold">Total Cameras</span>
            <div className="w-8 h-8 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-center justify-center text-[#61777c] group-hover:text-[#168a91] group-hover:border-[#168a91]/30 transition-colors">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#263b40]">
              {camerasLoading ? '...' : kpis?.totalCameras || cameras.length}
            </span>
            <span className="text-xs text-[#61777c]">devices configured</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#dce5e7] flex items-center justify-between text-xs text-[#61777c]">
            <span className="text-[#299b72] font-medium">{kpis?.onlineCount || 0} Online</span>
            <span className="text-[#d69a38] font-medium">{kpis?.warningCount || 0} Warning</span>
            <span className="text-[#d95757] font-medium">{kpis?.offlineCount || 0} Offline</span>
          </div>
        </Card>

        {/* Active Streams */}
        <Card hoverable onClick={() => navigate('/live')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#61777c] font-semibold">Active Streams</span>
            <div className="w-8 h-8 rounded-lg bg-[#ddf1f1] border border-[#168a91]/20 flex items-center justify-center text-[#168a91] transition-colors">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#263b40]">
              {camerasLoading ? '...' : kpis?.activeCameras || 0}
            </span>
            <span className="text-xs text-[#168a91] font-medium">
              {kpis?.totalCameras ? `${Math.round(((kpis.onlineCount) / kpis.totalCameras) * 100)}%` : '0%'} uptime
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#dce5e7] flex items-center gap-1.5 text-xs text-[#61777c]">
            <span className="w-2 h-2 rounded-full bg-[#299b72] animate-pulse" />
            <span>Streaming simulated CCTV feeds</span>
          </div>
        </Card>

        {/* Events Today */}
        <Card hoverable onClick={() => navigate('/events')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#61777c] font-semibold">Events Today</span>
            <div className="w-8 h-8 rounded-lg bg-[#ddf1f1] border border-[#168a91]/20 flex items-center justify-center text-[#168a91] transition-colors">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#263b40]">
              {kpis?.eventsToday ?? recentEvents.length}
            </span>
            <span className="text-xs text-[#168a91] font-medium">since 00:00</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#dce5e7] flex items-center justify-between text-xs text-[#61777c]">
            <span>Security detections logged</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#168a91]" />
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card 
          hoverable 
          onClick={() => navigate('/alerts')} 
          className={`relative overflow-hidden group ${
            (kpis?.criticalAlerts || 0) > 0 
              ? 'border-[#d95757]/30 bg-[#fdf0f0]/60' 
              : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#d95757] font-semibold">Critical Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-[#fdf0f0] border border-[#d95757]/20 flex items-center justify-center text-[#d95757]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#d95757]">
              {kpis?.criticalAlerts || 0}
            </span>
            <span className="text-xs text-[#d95757] font-medium">unacknowledged</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#dce5e7] flex items-center justify-between text-xs text-[#61777c]">
            <span>Requires operational review</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#d95757]" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Mini Camera Preview + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Camera Grid Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#168a91]" />
              <h2 className="text-sm font-semibold text-[#263b40]">
                Live Monitoring Preview
              </h2>
            </div>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => navigate('/live')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              All {cameras.length} Feeds
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previewCameras.map((camera) => {
              return (
                <div
                  key={camera.id}
                  className="group rounded-xl border border-[#dce5e7] bg-white overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-[#168a91]/30"
                >
                  <div className="px-4 py-3 bg-white border-b border-[#dce5e7] flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="text-sm font-semibold text-[#263b40] truncate leading-tight">{camera.name}</p>
                      <p className="text-xs text-[#61777c] truncate mt-0.5">{camera.location}</p>
                    </div>
                    <StatusBadge status={camera.status} size="sm" />
                  </div>

                  <CCTVVideoFeed
                    camera={camera}
                    isPlaying={playingCamera === camera.id || playingCamera === null}
                    onTogglePlay={() => setPlayingCamera(playingCamera === camera.id ? 'PAUSED' : camera.id)}
                    onFocus={() => navigate('/live')}
                  />
                </div>
              );
            })}
          </div>

          {/* Mini Events-Over-Time Chart */}
          <Card className="p-4 bg-white border-[#dce5e7]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#168a91]" />
                <span className="text-sm font-semibold text-[#263b40]">
                  Detection Activity Trend (Last 12 Hours)
                </span>
              </div>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => navigate('/analytics')}
              >
                Analytics
              </Button>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#168a91" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#168a91" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    stroke="#8a9b9f" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#8a9b9f" 
                    fontSize={11} 
                    tickLine={false} 
                    width={28} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: '#dce5e7', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#263b40',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#168a91"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#eventGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col): Recent Activity List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#168a91]" />
              <h2 className="text-sm font-semibold text-[#263b40]">
                Recent Events
              </h2>
            </div>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => navigate('/events')}
            >
              View All
            </Button>
          </div>

          <Card className="p-3 bg-white border-[#dce5e7] divide-y divide-[#dce5e7]">
            {recentEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#61777c]">
                Monitoring for security events...
              </div>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="py-3 px-2 rounded-lg hover:bg-[#f0f6f6] transition-colors cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#61777c]">
                        {event.id}
                      </span>
                      <EventTypeBadge type={event.type} size="sm" />
                      <SeverityBadge severity={event.severity} size="sm" />
                    </div>
                    <p className="text-xs text-[#263b40] font-medium leading-snug line-clamp-2 group-hover:text-[#168a91] transition-colors">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#61777c]">
                      <span>{event.cameraName || event.cameraId}</span>
                      <span>&bull;</span>
                      <span>{(event.confidence * 100).toFixed(0)}% conf</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-[#8a9b9f] shrink-0 pt-0.5">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
