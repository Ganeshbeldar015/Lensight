import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCameras } from '@/context/CameraContext';
import { useAlerts } from '@/context/AlertContext';
import { dataProvider } from '@/services/dataProvider';
import type { DetectionEvent, OverviewKpis } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { EventDetailModal } from '@/components/events/EventDetailModal';
import { 
  Camera, 
  Activity, 
  ShieldAlert, 
  Flame, 
  ArrowRight, 
  Video, 
  TrendingUp,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { cameras, loading: camerasLoading } = useCameras();
  const { alerts, acknowledgeAlert } = useAlerts();

  const [kpis, setKpis] = useState<OverviewKpis | null>(null);
  const [recentEvents, setRecentEvents] = useState<DetectionEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DetectionEvent | null>(null);
  const [trendData, setTrendData] = useState<{ hour: string; count: number }[]>([]);
  const [playingCamera, setPlayingCamera] = useState<string | null>(null);

  // Compute live KPIs and fetch recent events
  useEffect(() => {
    async function loadData() {
      try {
        const kpiData = await dataProvider.getOverviewKpis();
        setKpis(kpiData);

        const eventsRes = await dataProvider.getEvents({ limit: 8, sortBy: 'timestamp', sortOrder: 'desc' });
        setRecentEvents(eventsRes.events);

        // Quick 12-hour mini trend
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

  // Urgent Critical Alerts (Unacknowledged)
  const urgentAlerts = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged);

  // 4 Preview cameras
  const previewCameras = cameras.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Security Operations Overview"
        description="Unified monitoring dashboard for multi-camera feeds, critical triage alerts, and AI detection telemetry."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[rgba(34,197,94,0.1)] border border-[#22c55e]/30 text-[#22c55e] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            LIVE FEED
          </span>
        }
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

      {/* Urgent Critical Alerts Ribbon (FR-OV-5) */}
      {urgentAlerts.length > 0 && (
        <div className="p-4 rounded-xl border border-[rgba(235,52,36,0.4)] bg-[rgba(235,52,36,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eb3424] flex items-center justify-center text-white shrink-0 shadow-md animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {urgentAlerts.length} Critical Security {urgentAlerts.length === 1 ? 'Alert' : 'Alerts'} Pending
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-[#ffb0a8] mt-0.5">
                {urgentAlerts[0].title} on <span className="font-semibold text-white">{urgentAlerts[0].cameraName || urgentAlerts[0].cameraId}</span>
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
              View Alert Center
            </Button>
          </div>
        </div>
      )}

      {/* KPI Metric Cards (FR-OV-1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cameras */}
        <Card hoverable onClick={() => navigate('/cameras')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#888]">TOTAL CAMERAS</span>
            <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2e2e2e] flex items-center justify-center text-[#ccc] group-hover:text-[#fa5d19] transition-colors">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {camerasLoading ? '...' : kpis?.totalCameras || cameras.length}
            </span>
            <span className="text-xs text-[#888]">devices linked</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222] flex items-center justify-between text-[11px] font-mono text-[#888]">
            <span className="text-[#22c55e]">{kpis?.onlineCount || 0} Online</span>
            <span className="text-[#f59e0b]">{kpis?.warningCount || 0} Warn</span>
            <span className="text-[#ef4444]">{kpis?.offlineCount || 0} Offline</span>
          </div>
        </Card>

        {/* Active Cameras */}
        <Card hoverable onClick={() => navigate('/live')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#888]">ACTIVE STREAMS</span>
            <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2e2e2e] flex items-center justify-center text-[#22c55e] transition-colors">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {camerasLoading ? '...' : kpis?.activeCameras || 0}
            </span>
            <span className="text-xs text-[#22c55e] font-mono">
              {kpis?.totalCameras ? `${Math.round(((kpis.onlineCount) / kpis.totalCameras) * 100)}%` : '0%'} uptime
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222] flex items-center gap-1.5 text-[11px] font-mono text-[#888]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
            <span>Streaming 1080p & 4K feeds</span>
          </div>
        </Card>

        {/* Events Today */}
        <Card hoverable onClick={() => navigate('/events')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#888]">EVENTS TODAY</span>
            <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#2e2e2e] flex items-center justify-center text-[#fa5d19] transition-colors">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {kpis?.eventsToday ?? recentEvents.length}
            </span>
            <span className="text-xs text-[#fa5d19] font-mono">since 00:00</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222] flex items-center justify-between text-[11px] text-[#888]">
            <span>AI detections classified</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#fa5d19]" />
          </div>
        </Card>

        {/* Critical Alerts (Visually Emphasized with Red/Glow) */}
        <Card 
          hoverable 
          onClick={() => navigate('/alerts')} 
          className={`relative overflow-hidden group border ${
            (kpis?.criticalAlerts || 0) > 0 
              ? 'border-[#eb3424]/60 bg-[rgba(235,52,36,0.06)]' 
              : 'border-[#333]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#ff8075] font-semibold">CRITICAL ALERTS</span>
            <div className="w-8 h-8 rounded-lg bg-[rgba(235,52,36,0.2)] border border-[#eb3424]/40 flex items-center justify-center text-[#eb3424]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#ff4d3d] font-mono">
              {kpis?.criticalAlerts || 0}
            </span>
            <span className="text-xs text-[#ff9990] font-mono">unacknowledged</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#eb3424]/20 flex items-center justify-between text-[11px] font-mono text-[#ff857a]">
            <span>Requires SecOps review</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ff4d3d]" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Mini Camera Preview + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Camera Grid Preview (FR-OV-4) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#fa5d19]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
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
              const isPlaying = playingCamera === camera.id;
              const isOffline = camera.status === 'offline';

              return (
                <div
                  key={camera.id}
                  className="group rounded-xl border border-[#262626] bg-[#111] overflow-hidden flex flex-col transition-all hover:border-[#fa5d19]/40"
                >
                  {/* Video Tile Header */}
                  <div className="p-2.5 bg-[#171717] border-b border-[#222] flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">{camera.name}</p>
                      <p className="text-[10px] text-[#888] font-mono truncate">{camera.location}</p>
                    </div>
                    <StatusBadge status={camera.status} size="sm" />
                  </div>

                  {/* Video Display Area */}
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {isOffline ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <AlertTriangle className="w-8 h-8 text-[#ef4444] mb-2 opacity-80" />
                        <span className="font-mono text-xs font-bold text-[#ef4444]">NO SIGNAL</span>
                        <span className="text-[10px] text-[#777] font-mono mt-1">Check cable / power supply</span>
                      </div>
                    ) : isPlaying && camera.streamUrl ? (
                      <video
                        src={camera.streamUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={camera.thumbnail}
                        alt={camera.name}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Camera Control Overlay */}
                    {!isOffline && (
                      <button
                        onClick={() => setPlayingCamera(isPlaying ? null : camera.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={isPlaying ? 'Pause feed' : 'Play feed'}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#fa5d19] text-white flex items-center justify-center shadow-heat-glow">
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </div>
                      </button>
                    )}

                    {/* Live Timestamp & Zone Overlay */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 font-mono text-[10px] text-white">
                      {camera.zone || 'Zone 01'}
                    </div>

                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 font-mono text-[10px] text-[#ccc]">
                      {camera.fps} FPS
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Events-Over-Time Chart (FR-OV-6) */}
          <Card className="p-4 bg-[#111] border-[#222]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#fa5d19]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Detection Activity Trend (Last 12 Hours)
                </span>
              </div>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => navigate('/analytics')}
              >
                Deep Analytics
              </Button>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fa5d19" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#fa5d19" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    stroke="#555" 
                    fontSize={10} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#555" 
                    fontSize={10} 
                    tickLine={false} 
                    width={24} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#171717', 
                      borderColor: '#333', 
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#fff'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#fa5d19"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#eventGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col): Recent Activity List (FR-OV-2) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#fa5d19]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Detections
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

          <Card className="p-3 bg-[#111] border-[#222] divide-y divide-[#1e1e1e]">
            {recentEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#888]">
                Scanning for incoming detections...
              </div>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="py-3 px-2 rounded-lg hover:bg-[#181818] transition-colors cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#fa5d19] font-bold">
                        {event.id}
                      </span>
                      <SeverityBadge severity={event.severity} size="sm" />
                    </div>
                    <p className="text-xs text-[#f0f0f0] font-medium leading-snug line-clamp-2 group-hover:text-[#fa5d19] transition-colors">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#777]">
                      <span>{event.cameraName || event.cameraId}</span>
                      <span>•</span>
                      <span>{(event.confidence * 100).toFixed(0)}% conf</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#888] shrink-0 pt-0.5">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* Event Detail Modal when clicked from recent activity */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
