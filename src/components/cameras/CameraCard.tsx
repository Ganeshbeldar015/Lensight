import React, { useState, useRef, useEffect } from 'react';
import type { Camera } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Play,
  Pause,
  Maximize2,
  Camera as CameraIcon,
  WifiOff,
  Radio,
  Eye,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface CameraCardProps {
  camera: Camera;
  onOpenDetails?: (camera: Camera) => void;
  onFullscreen?: (camera: Camera) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  onOpenDetails,
  onFullscreen,
}) => {
  const { showToast } = useApp();
  const [isPlaying, setIsPlaying] = useState(camera.status === 'online');
  const [timestamp, setTimestamp] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Live ticking CCTV clock overlay
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
          now.getDate()
        ).padStart(2, '0')} ${now.toTimeString().split(' ')[0]}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (camera.status === 'offline') {
      showToast(`Cannot play ${camera.id}: Camera signal is offline`, 'warning');
      return;
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleCaptureSnapshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Snapshot captured from ${camera.id} (${camera.name})`, 'success', 'Frame Saved');
  };

  const isOffline = camera.status === 'offline';
  const isWarning = camera.status === 'warning';

  return (
    <div
      className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 ${
        isOffline
          ? 'bg-[#151E2D]/80 border-red-500/30'
          : isWarning
          ? 'bg-[#1F2937] border-amber-500/30 hover:border-amber-500/60'
          : 'bg-[#1F2937] border-[#374151] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="px-3.5 py-2.5 bg-[#151E2D] border-b border-[#374151] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {camera.id}
          </span>
          <div className="truncate">
            <h4 className="text-xs font-semibold text-[#F9FAFB] truncate">{camera.name}</h4>
            <p className="text-[10px] text-[#9CA3AF] truncate">{camera.location}</p>
          </div>
        </div>

        <StatusBadge status={camera.status} size="sm" />
      </div>

      {/* Video Viewport / CCTV Canvas */}
      <div
        className="relative aspect-video w-full bg-[#0B0F17] overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails?.(camera)}
      >
        {isOffline ? (
          /* Offline Test Pattern */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d131f] text-center p-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-2 animate-pulse">
              <WifiOff className="w-6 h-6" />
            </div>
            <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-widest">
              NO SIGNAL INPUT
            </span>
            <span className="text-[11px] text-[#9CA3AF] mt-1 font-mono">
              LOST CARRIER • RECONNECTING
            </span>
            <span className="text-[10px] text-[#6B7280] mt-3 font-mono">
              Last Telemetry: {new Date(camera.lastSeen).toLocaleTimeString()}
            </span>
          </div>
        ) : (
          /* Live Feed (Video Stream or Realistic AI Feed Canvas) */
          <>
            {camera.streamUrl ? (
              <video
                ref={videoRef}
                src={camera.streamUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter brightness-95 contrast-105"
              />
            ) : (
              /* Simulated CCTV Feed with Dynamic Environment */
              <div className="w-full h-full bg-gradient-to-br from-[#16202e] via-[#0f1723] to-[#0a0f18] flex items-center justify-center relative">
                {/* Visual grid texture */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                <div className="text-center z-10">
                  <div className="font-mono text-xs text-[#9CA3AF] flex items-center justify-center gap-1.5 mb-1">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                      AI MODEL ACTIVE
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B7280] font-mono">
                    {camera.resolution || '1080p'} • {camera.fps || 30} FPS • H.265
                  </span>
                </div>
              </div>
            )}

            {/* CCTV Scanline Overlay */}
            <div className="absolute inset-0 cctv-scanlines pointer-events-none opacity-40" />

            {/* AI Bounding Box Simulation on live cameras */}
            {isPlaying && !isOffline && (
              <div
                className="absolute border border-emerald-400/80 bg-emerald-500/10 rounded-sm pointer-events-none transition-all duration-700"
                style={{
                  top: camera.id === 'CAM-001' ? '28%' : camera.id === 'CAM-002' ? '38%' : '32%',
                  left: camera.id === 'CAM-001' ? '35%' : camera.id === 'CAM-002' ? '45%' : '40%',
                  width: camera.id === 'CAM-001' ? '28%' : '24%',
                  height: camera.id === 'CAM-001' ? '54%' : '48%',
                }}
              >
                <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-emerald-500 text-black text-[9px] font-mono font-bold tracking-tight rounded-t-sm uppercase">
                  {camera.id === 'CAM-002' ? 'VEHICLE 94%' : 'PERSON 97%'}
                </div>
              </div>
            )}

            {/* Top Overlay Badges */}
            <div className="absolute top-2 left-2 flex items-center gap-2 pointer-events-none">
              <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-red-500 flex items-center gap-1 border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                REC
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-[#374151]">
                CAM {camera.id.replace('CAM-', '')}
              </span>
            </div>

            {/* Bottom Overlay: Timestamp and Watermark */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-[#F9FAFB]/90 pointer-events-none bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/5">
              <span>{timestamp}</span>
              <span className="text-emerald-400 tracking-wider">LENSIGHT AI • OPTICAL</span>
            </div>

            {/* Hover Control Overlay Bar */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="p-2.5 rounded-full bg-[#1F2937]/90 text-[#F9FAFB] hover:text-emerald-400 hover:scale-110 transition-all border border-[#374151]"
                title={isPlaying ? 'Pause Feed' : 'Resume Feed'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="p-2.5 rounded-full bg-[#1F2937]/90 text-[#F9FAFB] hover:text-emerald-400 hover:scale-110 transition-all border border-[#374151]"
                title="Capture Snapshot"
              >
                <CameraIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onFullscreen) {
                    onFullscreen(camera);
                  } else {
                    onOpenDetails?.(camera);
                  }
                }}
                className="p-2.5 rounded-full bg-[#1F2937]/90 text-[#F9FAFB] hover:text-emerald-400 hover:scale-110 transition-all border border-[#374151]"
                title="Fullscreen / Focus Stream"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Card Footer Telemetry & Quick Action */}
      <div className="px-3.5 py-2.5 bg-[#151E2D] border-t border-[#374151] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#9CA3AF]">
          <span>{camera.fps || 0} FPS</span>
          <span className="text-[#6B7280]">•</span>
          <span>{camera.resolution ? camera.resolution.split(' ')[0] : '1080p'}</span>
        </div>

        <button
          onClick={() => onOpenDetails?.(camera)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
};
