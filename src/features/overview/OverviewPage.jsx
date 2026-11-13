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
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Security Operations Overview"
        description="Unified monitoring dashboard for multi-camera feeds, critical triage alerts, and AI detection telemetry."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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

      {/* Urgent Critical Alerts Ribbon */}
      {urgentAlerts.length > 0 && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-red-950">
                  {urgentAlerts.length} Critical Security {urgentAlerts.length === 1 ? 'Alert' : 'Alerts'} Pending
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 font-bold">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-red-800 mt-0.5">
                {urgentAlerts[0].title} on <span className="font-semibold text-red-950">{urgentAlerts[0].cameraName || urgentAlerts[0].cameraId}</span>
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

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cameras */}
        <Card hoverable onClick={() => navigate('/cameras')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">TOTAL CAMERAS</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-[#fa5d19] group-hover:border-orange-300 transition-colors">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {camerasLoading ? '...' : kpis?.totalCameras || cameras.length}
            </span>
            <span className="text-xs text-slate-500">devices linked</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500 font-medium">
            <span className="text-emerald-600 font-semibold">{kpis?.onlineCount || 0} Online</span>
            <span className="text-amber-600 font-semibold">{kpis?.warningCount || 0} Warn</span>
            <span className="text-rose-600 font-semibold">{kpis?.offlineCount || 0} Offline</span>
          </div>
        </Card>

        {/* Active Cameras */}
        <Card hoverable onClick={() => navigate('/live')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">ACTIVE STREAMS</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 transition-colors">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {camerasLoading ? '...' : kpis?.activeCameras || 0}
            </span>
            <span className="text-xs text-emerald-600 font-mono font-semibold">
              {kpis?.totalCameras ? `${Math.round(((kpis.onlineCount) / kpis.totalCameras) * 100)}%` : '0%'} uptime
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Streaming 1080p & 4K feeds</span>
          </div>
        </Card>

        {/* Events Today */}
        <Card hoverable onClick={() => navigate('/events')} className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">EVENTS TODAY</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#fa5d19] transition-colors">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {kpis?.eventsToday ?? recentEvents.length}
            </span>
            <span className="text-xs text-[#fa5d19] font-mono font-semibold">since 00:00</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>AI detections classified</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#fa5d19]" />
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card 
          hoverable 
          onClick={() => navigate('/alerts')} 
          className={`relative overflow-hidden group ${
            (kpis?.criticalAlerts || 0) > 0 
              ? 'border-red-200 bg-red-50/50 hover:border-red-400' 
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-red-700 font-bold">CRITICAL ALERTS</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-600 font-mono">
              {kpis?.criticalAlerts || 0}
            </span>
            <span className="text-xs text-red-600 font-mono font-medium">unacknowledged</span>
          </div>
          <div className="mt-3 pt-3 border-t border-red-200/60 flex items-center justify-between text-[11px] font-mono text-red-700">
            <span>Requires SecOps review</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Mini Camera Preview + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Camera Grid Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#fa5d19]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
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
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col transition-all hover:border-orange-300 hover:shadow-md shadow-xs"
                >
                  <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 truncate">{camera.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{camera.location}</p>
                    </div>
                    <StatusBadge status={camera.status} size="sm" />
                  </div>

                  <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                    {isOffline ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <AlertTriangle className="w-8 h-8 text-rose-500 mb-2 opacity-90" />
                        <span className="font-mono text-xs font-bold text-rose-500">NO SIGNAL</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-1">Check cable / power supply</span>
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
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {!isOffline && (
                      <button
                        onClick={() => setPlayingCamera(isPlaying ? null : camera.id)}
                        className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        aria-label={isPlaying ? 'Pause feed' : 'Play feed'}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#fa5d19] text-white flex items-center justify-center shadow-heat-glow">
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </div>
                      </button>
                    )}

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white">
                      {camera.zone || 'Zone 01'}
                    </div>

                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 font-mono text-[10px] text-slate-300">
                      {camera.fps} FPS
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Events-Over-Time Chart */}
          <Card className="p-4 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#fa5d19]" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
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
                      <stop offset="5%" stopColor="#fa5d19" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fa5d19" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    width={24} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#e2e8f0', 
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#0f172a',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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

        {/* Right Column (1 Col): Recent Activity List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#fa5d19]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
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

          <Card className="p-3 bg-white border-slate-200 divide-y divide-slate-100 shadow-xs">
            {recentEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Scanning for incoming detections...
              </div>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="py-3 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#fa5d19] font-bold">
                        {event.id}
                      </span>
                      <SeverityBadge severity={event.severity} size="sm" />
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-snug line-clamp-2 group-hover:text-[#fa5d19] transition-colors">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>{event.cameraName || event.cameraId}</span>
                      <span>•</span>
                      <span>{(event.confidence * 100).toFixed(0)}% conf</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 shrink-0 pt-0.5">
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
