import React, { useState, useEffect } from 'react';
import { useCameras } from '@/context/CameraContext';
import type { Camera, CameraStatus } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CameraFocusModal } from '@/components/cameras/CameraFocusModal';
import { 
  Maximize2, 
  Play, 
  Pause, 
  Grid, 
  LayoutGrid, 
  Filter, 
  AlertTriangle,
  Layers,
  Video
} from 'lucide-react';

export const LiveMonitoringPage: React.FC = () => {
  const { cameras, updateStatus } = useCameras();

  const [layout, setLayout] = useState<'1x1' | '2x2' | '3x3' | 'auto'>('auto');
  const [statusFilter, setStatusFilter] = useState<'all' | CameraStatus>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [playingState, setPlayingState] = useState<Record<string, boolean>>({});
  const [overlayState, setOverlayState] = useState<Record<string, boolean>>({});
  const [focusCamera, setFocusCamera] = useState<Camera | null>(null);
  const [liveClock, setLiveClock] = useState<string>('');

  // Running live timestamp updating every second (FR-LM-2)
  useEffect(() => {
    const updateTime = () => {
      setLiveClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter cameras
  const filteredCameras = cameras.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesZone = selectedZone === 'all' || c.zone === selectedZone;
    return matchesStatus && matchesZone;
  });

  // Unique zones
  const zones = Array.from(new Set(cameras.map((c) => c.zone).filter(Boolean)));

  const togglePlay = (id: string) => {
    setPlayingState((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const toggleOverlay = (id: string) => {
    setOverlayState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Determine grid columns based on selected layout
  const gridClass = {
    '1x1': 'grid-cols-1 max-w-4xl mx-auto',
    '2x2': 'grid-cols-1 sm:grid-cols-2',
    '3x3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'auto': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[layout];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Live Camera Monitoring Wall"
        description="Real-time multi-tile surveillance feeds with simulated AI detection bounding overlays and telemetry status."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[rgba(34,197,94,0.1)] border border-[#22c55e]/30 text-[#22c55e] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
            LIVE RTSP/CCTV SIMULATOR
          </span>
        }
      />

      {/* Control Strip: Grid Selector & Filter Chips */}
      <div className="p-3.5 rounded-xl border border-[#222] bg-[#121212] flex flex-wrap items-center justify-between gap-4">
        {/* Layout Buttons (FR-LM-6) */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg border border-[#2d2d2d]">
          <span className="text-[11px] font-mono text-[#777] px-2 flex items-center gap-1">
            <Grid className="w-3.5 h-3.5 text-[#fa5d19]" />
            GRID:
          </span>
          {(['auto', '3x3', '2x2', '1x1'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                layout === l
                  ? 'bg-[#fa5d19] text-white font-bold shadow'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Status & Zone Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg border border-[#2d2d2d]">
            <Filter className="w-3.5 h-3.5 text-[#777] ml-1.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs text-[#ccc] py-1 px-2 focus:outline-none font-mono"
            >
              <option value="all">All Statuses ({cameras.length})</option>
              <option value="online">Online Only</option>
              <option value="warning">Warning Only</option>
              <option value="offline">Offline Only</option>
            </select>
          </div>

          {zones.length > 0 && (
            <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg border border-[#2d2d2d]">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-transparent text-xs text-[#ccc] py-1 px-2 focus:outline-none font-mono"
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

          <div className="font-mono text-xs text-[#888] px-2 py-1 rounded bg-[#181818] border border-[#262626]">
            Showing {filteredCameras.length} of {cameras.length}
          </div>
        </div>
      </div>

      {/* Multi-Tile Camera Grid (FR-LM-1) */}
      <div className={`grid ${gridClass} gap-4`}>
        {filteredCameras.map((camera) => {
          const isOffline = camera.status === 'offline';
          const isPlaying = playingState[camera.id] !== false; // Default play
          const showOverlay = overlayState[camera.id] ?? true;

          return (
            <div
              key={camera.id}
              className="group rounded-xl border border-[#262626] bg-[#111] overflow-hidden flex flex-col transition-all hover:border-[#fa5d19]/40 shadow-lg"
            >
              {/* Tile Header */}
              <div className="p-3 bg-[#171717] border-b border-[#222] flex items-center justify-between">
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate flex items-center gap-2">
                    <span>{camera.name}</span>
                    <span className="font-mono text-[10px] text-[#888]">{camera.id}</span>
                  </p>
                  <p className="text-[10px] text-[#777] font-mono truncate">{camera.location}</p>
                </div>
                <StatusBadge status={camera.status} size="sm" />
              </div>

              {/* Video Tile Display */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {isOffline ? (
                  // Offline Tile Placeholder (FR-LM-4)
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-[#ef4444] mb-2 opacity-80" />
                    <span className="font-mono text-xs font-bold text-[#ef4444]">NO SIGNAL</span>
                    <span className="text-[10px] text-[#777] font-mono mt-1">
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
                    className="w-full h-full object-cover opacity-80"
                  />
                )}

                {/* Simulated Bounding Box Overlay (FR-LM-7) */}
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

                {/* Live Running Timestamp Overlay (FR-LM-2) */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white shadow">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                  <span>{isOffline ? 'OFFLINE' : 'LIVE'}</span>
                  <span>•</span>
                  <span>{liveClock}</span>
                </div>

                {/* Resolution & FPS */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 font-mono text-[9px] text-[#aaa]">
                  {camera.resolution}
                </div>

                {/* Action Hover HUD */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {!isOffline && (
                    <button
                      onClick={() => togglePlay(camera.id)}
                      className="w-9 h-9 rounded-full bg-[#1e1e1e] hover:bg-[#fa5d19] text-white flex items-center justify-center transition-all border border-[#333]"
                      title={isPlaying ? 'Pause Feed' : 'Resume Feed'}
                      aria-label="Play/Pause"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                  )}

                  {!isOffline && (
                    <button
                      onClick={() => toggleOverlay(camera.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border border-[#333] ${
                        showOverlay ? 'bg-[#fa5d19] text-white' : 'bg-[#1e1e1e] text-[#888]'
                      }`}
                      title={showOverlay ? 'Hide AI Bounding' : 'Show AI Bounding'}
                      aria-label="Toggle Overlay"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setFocusCamera(camera)}
                    className="w-9 h-9 rounded-full bg-[#1e1e1e] hover:bg-[#fa5d19] text-white flex items-center justify-center transition-all border border-[#333]"
                    title="Expand View"
                    aria-label="Expand Camera View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tile Footer */}
              <div className="px-3 py-2 bg-[#141414] border-t border-[#1f1f1f] flex items-center justify-between text-[11px] font-mono text-[#888]">
                <span>{camera.zone || 'General Zone'}</span>
                <button
                  onClick={() => setFocusCamera(camera)}
                  className="text-[#fa5d19] hover:underline flex items-center gap-1 font-semibold"
                >
                  Inspect Feed
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus / Expand Modal (FR-LM-5) */}
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
