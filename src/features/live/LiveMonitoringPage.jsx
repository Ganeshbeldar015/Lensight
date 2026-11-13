import React, { useState, useEffect } from 'react';
import { useCameras } from '@/context/CameraContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CameraFocusModal } from '@/components/cameras/CameraFocusModal';
import { 
  Maximize2, 
  Play, 
  Pause, 
  Grid, 
  Filter, 
  AlertTriangle,
  Layers
} from 'lucide-react';

export const LiveMonitoringPage = () => {
  const { cameras, updateStatus } = useCameras();

  const [layout, setLayout] = useState('auto');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [playingState, setPlayingState] = useState({});
  const [overlayState, setOverlayState] = useState({});
  const [focusCamera, setFocusCamera] = useState(null);
  const [liveClock, setLiveClock] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setLiveClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredCameras = cameras.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesZone = selectedZone === 'all' || c.zone === selectedZone;
    return matchesStatus && matchesZone;
  });

  const zones = Array.from(new Set(cameras.map((c) => c.zone).filter(Boolean)));

  const togglePlay = (id) => {
    setPlayingState((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const toggleOverlay = (id) => {
    setOverlayState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const gridClass = {
    '1x1': 'grid-cols-1 max-w-4xl mx-auto',
    '2x2': 'grid-cols-1 sm:grid-cols-2',
    '3x3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'auto': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[layout] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Live Camera Monitoring Wall"
        description="Real-time multi-tile surveillance feeds with simulated AI detection bounding overlays and telemetry status."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE RTSP/CCTV SIMULATOR
          </span>
        }
      />

      {/* Control Strip */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4 shadow-xs">
        {/* Layout Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span className="text-[11px] font-mono text-slate-500 px-2 flex items-center gap-1 font-semibold">
            <Grid className="w-3.5 h-3.5 text-[#fa5d19]" />
            GRID:
          </span>
          {['auto', '3x3', '2x2', '1x1'].map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
                layout === l
                  ? 'bg-[#fa5d19] text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Status & Zone Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 py-1 px-2 focus:outline-none font-mono cursor-pointer"
            >
              <option value="all">All Statuses ({cameras.length})</option>
              <option value="online">Online Only</option>
              <option value="warning">Warning Only</option>
              <option value="offline">Offline Only</option>
            </select>
          </div>

          {zones.length > 0 && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-transparent text-xs text-slate-700 py-1 px-2 focus:outline-none font-mono cursor-pointer"
              >
                <option value="all">All Zones</option>
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="font-mono text-xs text-slate-500 px-2 py-1 rounded bg-slate-100 border border-slate-200">
            Showing {filteredCameras.length} of {cameras.length}
          </div>
        </div>
      </div>

      {/* Multi-Tile Camera Grid */}
      <div className={`grid ${gridClass} gap-4`}>
        {filteredCameras.map((camera) => {
          const isOffline = camera.status === 'offline';
          const isPlaying = playingState[camera.id] !== false;
          const showOverlay = overlayState[camera.id] ?? true;

          return (
            <div
              key={camera.id}
              className="group rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col transition-all hover:border-orange-300 hover:shadow-md shadow-xs"
            >
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-2">
                    <span>{camera.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 font-medium">{camera.id}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{camera.location}</p>
                </div>
                <StatusBadge status={camera.status} size="sm" />
              </div>

              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                {isOffline ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-rose-500 mb-2 opacity-90" />
                    <span className="font-mono text-xs font-bold text-rose-500">NO SIGNAL</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      Last seen: {new Date(camera.lastSeen).toLocaleTimeString()}
                    </span>
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
                    className="w-full h-full object-cover opacity-85"
                  />
                )}

                {!isOffline && showOverlay && (
                  <div
                    className="absolute border-2 border-[#fa5d19] bg-[rgba(250,93,25,0.18)] pointer-events-none"
                    style={{ left: '30%', top: '25%', width: '35%', height: '55%' }}
                  >
                    <span className="bg-[#fa5d19] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-wider self-start flex items-center gap-1 shadow">
                      <span>SIMULATED [94%]</span>
                    </span>
                  </div>
                )}

                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white shadow">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                  <span>{isOffline ? 'OFFLINE' : 'LIVE'}</span>
                  <span>•</span>
                  <span>{liveClock}</span>
                </div>

                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/80 font-mono text-[9px] text-slate-300">
                  {camera.resolution}
                </div>

                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {!isOffline && (
                    <button
                      onClick={() => togglePlay(camera.id)}
                      className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#fa5d19] text-white flex items-center justify-center transition-all border border-slate-700 cursor-pointer shadow"
                      title={isPlaying ? 'Pause Feed' : 'Resume Feed'}
                      aria-label="Play/Pause"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                  )}

                  {!isOffline && (
                    <button
                      onClick={() => toggleOverlay(camera.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border cursor-pointer shadow ${
                        showOverlay ? 'bg-[#fa5d19] border-transparent text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                      title={showOverlay ? 'Hide AI Bounding' : 'Show AI Bounding'}
                      aria-label="Toggle Overlay"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setFocusCamera(camera)}
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#fa5d19] text-white flex items-center justify-center transition-all border border-slate-700 cursor-pointer shadow"
                    title="Expand View"
                    aria-label="Expand Camera View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{camera.zone || 'General Zone'}</span>
                <button
                  onClick={() => setFocusCamera(camera)}
                  className="text-[#fa5d19] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  Inspect Feed
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CameraFocusModal
        camera={focusCamera}
        onClose={() => setFocusCamera(null)}
        onStatusChange={(newStatus) => {
          if (focusCamera) {
            updateStatus(focusCamera.id, newStatus);
            setFocusCamera({ ...focusCamera, status: newStatus });
          }
        }}
      />
    </div>
  );
};
