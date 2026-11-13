import React, { useState, useEffect } from 'react';
import { useCameras } from '@/context/CameraContext';
import { dataProvider } from '@/services/dataProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CameraFocusModal } from '@/components/cameras/CameraFocusModal';
import { CCTVVideoFeed } from '@/components/cameras/CCTVVideoFeed';
import { 
  Maximize2, 
  Play, 
  Pause, 
  Grid, 
  Filter, 
  AlertTriangle,
  Layers,
  Info
} from 'lucide-react';

export const LiveMonitoringPage = () => {
  const { cameras, updateStatus } = useCameras();

  const [layout, setLayout] = useState('auto');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [playingState, setPlayingState] = useState({});
  const [overlayState, setOverlayState] = useState({});
  const [focusCamera, setFocusCamera] = useState(null);
  const [detectionsByCamera, setDetectionsByCamera] = useState({});

  // Connect live camera tiles to centralized detection events mock data
  useEffect(() => {
    async function loadDetectionEvents() {
      try {
        const res = await dataProvider.getEvents({ limit: 100 });
        const map = {};
        (res.events || []).forEach((e) => {
          if (!map[e.cameraId] && e.boundingBoxes && e.boundingBoxes.length > 0) {
            map[e.cameraId] = {
              type: e.type,
              confidence: e.confidence,
              boundingBox: e.boundingBoxes[0],
              label: e.boundingBoxes[0].label || `${e.type.toUpperCase()} ${(e.confidence * 100).toFixed(0)}%`
            };
          }
        });
        setDetectionsByCamera(map);
      } catch (err) {
        console.warn('Failed to load detection overlays for cameras', err);
      }
    }
    loadDetectionEvents();
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

      {/* Mandatory Demonstration Disclosure Banner */}
      <div className="p-3 rounded-xl border border-amber-200/90 bg-amber-50/70 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-900 font-mono shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span>
            <strong className="font-bold">DEMO SIMULATION DISCLOSURE:</strong> Video streams are simulated CCTV channels mapped to local files in <code className="bg-amber-100/80 px-1.5 py-0.5 rounded text-[11px] font-bold">public/demo-videos/</code>. Bounding boxes and confidence scores are simulated demonstrations, not real-time camera telemetry or live AI model inference.
          </span>
        </div>
        <span className="text-[10px] text-amber-700 uppercase tracking-wider shrink-0 font-bold hidden lg:inline-block">
          Offline & Local Safe
        </span>
      </div>

      {/* Multi-Tile Camera Grid */}
      <div className={`grid ${gridClass} gap-4`}>
        {filteredCameras.map((camera) => {
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

              {/* CCTV Video Feed with Autoplay, Muted, Loop, PlaysInline, Error Fallback & AI Bounding Overlay */}
              <CCTVVideoFeed
                camera={camera}
                latestDetection={detectionsByCamera[camera.id]}
                isPlaying={isPlaying}
                showOverlay={showOverlay}
                onTogglePlay={() => togglePlay(camera.id)}
                onToggleOverlay={() => toggleOverlay(camera.id)}
                onFocus={() => setFocusCamera(camera)}
              />

              <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="truncate max-w-[60%]">{camera.zone || 'General Zone'}</span>
                <button
                  onClick={() => setFocusCamera(camera)}
                  className="text-[#fa5d19] hover:underline flex items-center gap-1 font-semibold cursor-pointer shrink-0"
                >
                  Inspect Feed →
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
