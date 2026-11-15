import React, { useState, useEffect } from 'react';
import { useCameras } from '@/context/CameraContext';
import { dataProvider } from '@/services/dataProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CameraFocusModal } from '@/components/cameras/CameraFocusModal';
import { CCTVVideoFeed } from '@/components/cameras/CCTVVideoFeed';
import { 
  Grid, 
  Filter, 
  ArrowRight
} from 'lucide-react';

export const LiveMonitoringPage = () => {
  const { cameras, updateStatus } = useCameras();

  const [layout, setLayout] = useState('3x3');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [playingState, setPlayingState] = useState({});
  const [overlayState, setOverlayState] = useState({});
  const [focusCamera, setFocusCamera] = useState(null);
  const [detectionsByCamera, setDetectionsByCamera] = useState({});

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
    '3x3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }[layout] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Monitoring"
        description="Real-time multi-tile surveillance feeds with simulated detection overlays and stream telemetry."
      />

      {/* Control Strip */}
      <div className="p-3.5 rounded-xl border border-[#dce5e7] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        {/* Layout Buttons */}
        <div className="flex items-center gap-1 bg-[#f0f6f6] p-1 rounded-lg border border-[#dce5e7] self-start sm:self-auto">
          <span className="text-xs text-[#61777c] px-2 flex items-center gap-1 font-semibold">
            <Grid className="w-3.5 h-3.5 text-[#168a91]" />
            Grid:
          </span>
          {['3x3', '1x1'].map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2.5 py-1 rounded text-xs font-medium uppercase transition-colors cursor-pointer ${
                layout === l
                  ? 'bg-[#168a91] text-white font-semibold shadow-xs'
                  : 'text-[#61777c] hover:text-[#263b40]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Status & Zone Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#f0f6f6] p-1 rounded-lg border border-[#dce5e7]">
            <Filter className="w-3.5 h-3.5 text-[#8a9b9f] ml-1.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-[#263b40] py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses ({cameras.length})</option>
              <option value="online">Online</option>
              <option value="warning">Warning</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {zones.length > 0 && (
            <div className="flex items-center gap-1 bg-[#f0f6f6] p-1 rounded-lg border border-[#dce5e7]">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-transparent text-xs text-[#263b40] py-1 px-2 focus:outline-none cursor-pointer"
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

          <div className="text-xs text-[#61777c] px-2.5 py-1.5 rounded-lg bg-[#f0f6f6] border border-[#dce5e7]">
            Showing {filteredCameras.length} of {cameras.length}
          </div>
        </div>
      </div>

      {/* Multi-Tile Camera Grid */}
      <div className={`grid ${gridClass} gap-4`}>
        {filteredCameras.map((camera) => {
          const isPlaying = playingState[camera.id] !== false;
          const showOverlay = overlayState[camera.id] ?? true;

          return (
            <div
              key={camera.id}
              className="group rounded-xl border border-[#dce5e7] bg-white overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-[#168a91]/30"
            >
              <div className="px-4 py-3 bg-white border-b border-[#dce5e7] flex items-center justify-between">
                <div className="truncate pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#263b40] truncate leading-tight">{camera.name}</span>
                    <span className="text-[10px] text-[#8a9b9f] font-mono px-1.5 py-0.2 bg-[#f0f6f6] rounded border border-[#dce5e7] shrink-0">
                      {camera.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#61777c] truncate mt-0.5">{camera.location}</p>
                </div>
                <StatusBadge status={camera.status} size="sm" />
              </div>

              {/* CCTV Video Feed */}
              <CCTVVideoFeed
                camera={camera}
                latestDetection={detectionsByCamera[camera.id]}
                isPlaying={isPlaying}
                showOverlay={showOverlay}
                onTogglePlay={() => togglePlay(camera.id)}
                onToggleOverlay={() => toggleOverlay(camera.id)}
                onFocus={() => setFocusCamera(camera)}
              />

              <div className="px-4 py-2.5 bg-[#f0f6f6] border-t border-[#dce5e7] flex items-center justify-between text-xs text-[#61777c]">
                <span className="truncate max-w-[60%] font-medium">{camera.zone || 'General Zone'}</span>
                <button
                  onClick={() => setFocusCamera(camera)}
                  className="text-xs font-semibold text-[#168a91] hover:text-[#11747a] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  Inspect Feed <ArrowRight className="w-3.5 h-3.5" />
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
