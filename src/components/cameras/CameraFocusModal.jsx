import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EventTypeBadge } from '@/components/ui/EventTypeBadge';
import { Button } from '@/components/ui/Button';
import { CCTVVideoFeed } from '@/components/cameras/CCTVVideoFeed';
import { dataProvider } from '@/services/dataProvider';
import { 
  X, 
  Play, 
  Pause, 
  MapPin, 
  Layers, 
  Activity, 
  Wifi
} from 'lucide-react';

export const CameraFocusModal = ({
  camera,
  onClose,
  onStatusChange
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showOverlays, setShowOverlays] = useState(true);
  const [recentEvents, setRecentEvents] = useState([]);
  const [liveTimestamp, setLiveTimestamp] = useState('');

  useEffect(() => {
    const update = () => {
      setLiveTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (camera) {
      dataProvider.getEvents({ filter: { cameraIds: [camera.id] }, limit: 5 })
        .then(res => setRecentEvents(res.events))
        .catch(console.error);
    }
  }, [camera]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (camera) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, onClose]);

  if (!camera) return null;

  const isOffline = camera.status === 'offline';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#263b40]/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl rounded-2xl border border-[#dce5e7] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#dce5e7] bg-[#f0f6f6]">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#263b40] truncate">{camera.name}</h3>
                <span className="text-xs font-mono text-[#61777c] shrink-0">{camera.id}</span>
              </div>
              <p className="text-xs text-[#61777c] flex items-center gap-1.5 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#168a91] shrink-0" />
                <span className="truncate">{camera.location}</span> &bull; <span className="font-medium shrink-0">{camera.zone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <StatusBadge status={camera.status} size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8a9b9f] hover:text-[#263b40] hover:bg-[#e7f3f3] cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Video Feed & Sidebar Telemetry */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Main Video Viewport (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-950 flex flex-col justify-between relative min-h-[220px] sm:min-h-[420px] p-2.5 sm:p-4 border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950">
              <CCTVVideoFeed
                camera={camera}
                latestDetection={recentEvents[0]}
                isPlaying={isPlaying}
                showOverlay={showOverlays}
                aspectRatio="aspect-video w-full max-h-[500px]"
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onToggleOverlay={() => setShowOverlays(!showOverlays)}
              />
            </div>

            {/* Controls Bar at bottom of video */}
            {!isOffline && (
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    leftIcon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  >
                    {isPlaying ? 'Pause' : 'Resume'}
                  </Button>

                  <Button
                    variant={showOverlays ? 'outline' : 'secondary'}
                    size="sm"
                    onClick={() => setShowOverlays(!showOverlays)}
                    leftIcon={<Layers className="w-3.5 h-3.5" />}
                  >
                    {showOverlays ? 'Hide Overlay' : 'Show Overlay'}
                  </Button>
                </div>

                <span className="text-[11px] text-slate-300 font-mono hidden xs:inline">
                  Simulated CCTV Stream
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Telemetry & Recent Events for this Camera */}
          <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 bg-[#f0f6f6]/60 border-t lg:border-t-0 lg:border-l border-[#dce5e7] overflow-y-auto">
            {/* Stream Telemetry */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-[#61777c] tracking-wider mb-2 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#168a91]" />
                Stream Telemetry
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-[#dce5e7]">
                  <span className="text-[10px] text-[#61777c] block">Resolution</span>
                  <span className="text-[#263b40] font-semibold">{camera.resolution}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#dce5e7]">
                  <span className="text-[10px] text-[#61777c] block">Frame Rate</span>
                  <span className="text-[#263b40] font-semibold">{camera.fps} FPS</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#dce5e7]">
                  <span className="text-[10px] text-[#61777c] block">Bandwidth</span>
                  <span className="text-[#263b40] font-semibold">{isOffline ? '0 Kbps' : '4.2 Mbps'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#dce5e7]">
                  <span className="text-[10px] text-[#61777c] block">Codec</span>
                  <span className="text-[#263b40] font-semibold">H.265 / HEVC</span>
                </div>
              </div>
            </div>

            {/* Quick Status Simulation */}
            {onStatusChange && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-[#61777c] tracking-wider mb-2">
                  Camera Status
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={camera.status === 'online' ? 'primary' : 'secondary'}
                    onClick={() => onStatusChange('online')}
                  >
                    Online
                  </Button>
                  <Button
                    size="sm"
                    variant={camera.status === 'warning' ? 'primary' : 'secondary'}
                    onClick={() => onStatusChange('warning')}
                  >
                    Warning
                  </Button>
                  <Button
                    size="sm"
                    variant={camera.status === 'offline' ? 'destructive' : 'secondary'}
                    onClick={() => onStatusChange('offline')}
                  >
                    Offline
                  </Button>
                </div>
              </div>
            )}

            {/* Recent Camera Activity */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-[#61777c] tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#168a91]" />
                Recent Events
              </h4>

              {recentEvents.length === 0 ? (
                <p className="text-xs text-[#61777c] p-3 rounded-lg bg-white border border-[#dce5e7]">
                  No recent events logged for this camera.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentEvents.map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-lg bg-white border border-[#dce5e7] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#61777c] font-mono">{e.id}</span>
                          <EventTypeBadge type={e.type} size="sm" />
                        </div>
                        <span className="text-[10px] text-[#8a9b9f]">
                          {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[#263b40] line-clamp-1 text-xs">{e.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 sm:px-6 py-3 border-t border-[#dce5e7] bg-[#f0f6f6]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Focus View
          </Button>
        </div>
      </div>
    </div>
  );
};
