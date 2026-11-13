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
  Wifi, 
  AlertTriangle 
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

  // Live timestamp ticking every second
  useEffect(() => {
    const update = () => {
      setLiveTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recent events for this camera
  useEffect(() => {
    if (camera) {
      dataProvider.getEvents({ filter: { cameraIds: [camera.id] }, limit: 5 })
        .then(res => setRecentEvents(res.events))
        .catch(console.error);
    }
  }, [camera]);

  // Handle escape key
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{camera.name}</h3>
                <span className="font-mono text-xs text-[#fa5d19] font-bold">{camera.id}</span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#fa5d19]" />
                {camera.location} • <span className="font-mono font-medium">{camera.zone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={camera.status} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Video Feed & Sidebar Telemetry */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Main Video Viewport (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-950 flex flex-col justify-between relative min-h-[300px] sm:min-h-[420px] p-4 border-b lg:border-b-0 lg:border-r border-slate-800">
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
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg">
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
                    {showOverlays ? 'Hide AI Bounding' : 'Show AI Bounding'}
                  </Button>
                </div>

                <span className="font-mono text-[10px] text-amber-400/90 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  [Simulated Local CCTV Feed]
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Telemetry & Recent Events for this Camera */}
          <div className="p-5 space-y-5 bg-slate-50/70 border-l border-slate-200 overflow-y-auto">
            {/* Stream Telemetry */}
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mb-2 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#fa5d19]" />
                TELEMETRY DATA
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">RESOLUTION</span>
                  <span className="text-slate-900 font-bold">{camera.resolution}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">FRAME RATE</span>
                  <span className="text-slate-900 font-bold">{camera.fps} FPS</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">BANDWIDTH</span>
                  <span className="text-slate-900 font-bold">{isOffline ? '0 Kbps' : '4.2 Mbps'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">CODEC</span>
                  <span className="text-slate-900 font-bold">H.265 / HEVC</span>
                </div>
              </div>
            </div>

            {/* Quick Status Simulation */}
            {onStatusChange && (
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mb-2">
                  SIMULATE CAMERA STATUS
                </h4>
                <div className="flex items-center gap-2">
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
              <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#fa5d19]" />
                RECENT DETECTIONS
              </h4>

              {recentEvents.length === 0 ? (
                <p className="text-xs text-slate-500 p-3 rounded-lg bg-white border border-slate-200">
                  No recent detection events logged for this camera.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentEvents.map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-[#fa5d19] font-bold">{e.id}</span>
                          <EventTypeBadge type={e.type} size="sm" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-800 line-clamp-1 text-[11px]">{e.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200 bg-slate-50">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Focus View
          </Button>
        </div>
      </div>
    </div>
  );
};
