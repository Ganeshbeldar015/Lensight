import React, { useState, useEffect } from 'react';
import type { Camera, DetectionEvent } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { dataProvider } from '@/services/dataProvider';
import { 
  X, 
  Play, 
  Pause, 
  MapPin, 
  Layers, 
  ScanLine, 
  Activity, 
  Wifi, 
  AlertTriangle 
} from 'lucide-react';

interface CameraFocusModalProps {
  camera: Camera | null;
  onClose: () => void;
  onStatusChange?: (status: Camera['status']) => void;
}

export const CameraFocusModal: React.FC<CameraFocusModalProps> = ({
  camera,
  onClose,
  onStatusChange
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showOverlays, setShowOverlays] = useState(true);
  const [recentEvents, setRecentEvents] = useState<DetectionEvent[]>([]);
  const [liveTimestamp, setLiveTimestamp] = useState<string>('');

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (camera) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, onClose]);

  if (!camera) return null;

  const isOffline = camera.status === 'offline';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl rounded-2xl border border-[#333] bg-[#121212] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#171717]">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{camera.name}</h3>
                <span className="font-mono text-xs text-[#fa5d19]">{camera.id}</span>
              </div>
              <p className="text-xs text-[#888] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#fa5d19]" />
                {camera.location} • <span className="font-mono">{camera.zone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={camera.status} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#222]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Video Feed & Sidebar Telemetry */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Main Video Viewport (2 Cols) */}
          <div className="lg:col-span-2 bg-black flex flex-col justify-between relative min-h-[300px] sm:min-h-[420px] p-4 border-b lg:border-b-0 lg:border-r border-[#262626]">
            {isOffline ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <AlertTriangle className="w-16 h-16 text-[#ef4444] mb-3 opacity-90 animate-pulse" />
                <h4 className="font-mono text-lg font-bold text-white tracking-widest">CAMERA OFFLINE</h4>
                <p className="text-xs text-[#ff8080] font-mono mt-1">NO SIGNAL DETECTED FROM SENSOR</p>
                <p className="text-xs text-[#777] font-mono mt-2">
                  Last heartbeat: {new Date(camera.lastSeen).toLocaleString()}
                </p>
              </div>
            ) : isPlaying && camera.streamUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  src={camera.streamUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain max-h-[500px]"
                />

                {/* Simulated AI Bounding Box Overlay (FR-LM-7) */}
                {showOverlays && (
                  <div
                    className="absolute border-2 border-[#fa5d19] bg-[rgba(250,93,25,0.15)] flex flex-col justify-start"
                    style={{ left: '25%', top: '22%', width: '22%', height: '48%' }}
                  >
                    <span className="bg-[#fa5d19] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-wider self-start flex items-center gap-1 shadow">
                      <span>PERSON 96%</span>
                      <span className="opacity-80 text-[8px]">[SIMULATED]</span>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={camera.thumbnail}
                  alt={camera.name}
                  className="w-full h-full object-contain opacity-75 max-h-[500px]"
                />
              </div>
            )}

            {/* Over-Video HUD Elements */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 font-mono text-xs text-white flex items-center gap-2 shadow">
                <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                {isOffline ? 'OFFLINE' : 'LIVE'} • {liveTimestamp}
              </span>
            </div>

            <div className="absolute top-6 right-6 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 font-mono text-xs text-[#ccc] shadow">
                {camera.resolution} @ {camera.fps}fps
              </span>
            </div>

            {/* Controls Bar at bottom of video */}
            {!isOffline && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 z-10 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg">
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

                <span className="font-mono text-[10px] text-[#fa5d19] uppercase tracking-wider font-semibold">
                  [Simulated Stream]
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Telemetry & Recent Events for this Camera */}
          <div className="p-5 space-y-5 bg-[#141414] overflow-y-auto">
            {/* Stream Telemetry */}
            <div>
              <h4 className="text-xs font-mono uppercase text-[#888] tracking-wider mb-2 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#fa5d19]" />
                TELEMETRY DATA
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#1c1c1c] border border-[#282828]">
                  <span className="text-[10px] text-[#777] block">RESOLUTION</span>
                  <span className="text-white font-bold">{camera.resolution}</span>
                </div>
                <div className="p-2.5 rounded bg-[#1c1c1c] border border-[#282828]">
                  <span className="text-[10px] text-[#777] block">FRAME RATE</span>
                  <span className="text-white font-bold">{camera.fps} FPS</span>
                </div>
                <div className="p-2.5 rounded bg-[#1c1c1c] border border-[#282828]">
                  <span className="text-[10px] text-[#777] block">BANDWIDTH</span>
                  <span className="text-white font-bold">{isOffline ? '0 Kbps' : '4.2 Mbps'}</span>
                </div>
                <div className="p-2.5 rounded bg-[#1c1c1c] border border-[#282828]">
                  <span className="text-[10px] text-[#777] block">CODEC</span>
                  <span className="text-white font-bold">H.265 / HEVC</span>
                </div>
              </div>
            </div>

            {/* Quick Status Simulation */}
            {onStatusChange && (
              <div>
                <h4 className="text-xs font-mono uppercase text-[#888] tracking-wider mb-2">
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
              <h4 className="text-xs font-mono uppercase text-[#888] tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#fa5d19]" />
                RECENT DETECTIONS
              </h4>

              {recentEvents.length === 0 ? (
                <p className="text-xs text-[#777] p-3 rounded bg-[#1c1c1c] border border-[#262626]">
                  No recent detection events logged for this camera.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentEvents.map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-lg bg-[#1c1c1c] border border-[#282828] text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-[#fa5d19] font-bold">{e.id}</span>
                        <span className="text-[10px] text-[#777] font-mono">
                          {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[#e0e0e0] line-clamp-1">{e.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-[#262626] bg-[#171717]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Focus View
          </Button>
        </div>
      </div>
    </div>
  );
};
