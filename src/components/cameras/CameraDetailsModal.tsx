import React, { useState, useEffect } from 'react';
import type { Camera } from '@/types';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { EventTypeBadge } from '@/components/common/EventTypeBadge';
import {
  Video,
  Camera as CameraIcon,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface CameraDetailsModalProps {
  camera: Camera | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CameraDetailsModal: React.FC<CameraDetailsModalProps> = ({
  camera,
  isOpen,
  onClose,
}) => {
  const { events, showToast } = useApp();
  const [isPlaying] = useState(true);
  const [timestamp, setTimestamp] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toISOString().replace('T', ' ').substring(0, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!camera) return null;

  // Filter events related to this camera
  const cameraEvents = events.filter((e) => e.cameraId === camera.id).slice(0, 5);

  const handlePtzAction = (action: string) => {
    showToast(`PTZ Command: ${action} dispatched to ${camera.id}`, 'info', 'PTZ Controller');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${camera.id} – ${camera.name}`}
      subtitle={`${camera.location} • Zone: ${camera.zone || 'General'}`}
      maxWidth="5xl"
    >
      <div className="space-y-6">
        {/* Stream Viewport & PTZ Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Feed */}
          <div className="lg:col-span-3 relative aspect-video bg-[#0a0f18] rounded-xl overflow-hidden border border-[#374151]">
            {camera.status === 'offline' ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-3 animate-pulse">
                  <Video className="w-8 h-8" />
                </div>
                <h4 className="font-mono text-sm font-bold text-red-400">FEED OFFLINE</h4>
                <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs">
                  Hardware link down. Inspect PoE switch port or network patch.
                </p>
              </div>
            ) : camera.streamUrl ? (
              <video
                src={camera.streamUrl}
                autoPlay
                loop
                muted={!isPlaying}
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#151E2D] to-[#0A0F1A] flex items-center justify-center relative">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE OPTICAL INFERENCE
                  </div>
                  <p className="text-xs text-[#9CA3AF] font-mono">
                    TensorRT-v9 Object Recognition Stream Active
                  </p>
                </div>
              </div>
            )}

            {/* CCTV Scanlines */}
            <div className="absolute inset-0 cctv-scanlines pointer-events-none opacity-30" />

            {/* Overlays */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <StatusBadge status={camera.status} size="sm" />
              <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-xs font-mono text-white border border-white/10">
                {camera.resolution || '1080p'}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none">
              <span>{timestamp}</span>
              <span className="text-emerald-400 font-bold">LENSIGHT SECURE PROTOCOL</span>
            </div>
          </div>

          {/* PTZ and Quick Control Panel */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-[#151E2D] border border-[#374151]">
            <div>
              <h4 className="text-xs font-bold text-[#F9FAFB] uppercase tracking-wider font-mono mb-3">
                PTZ Remote
              </h4>

              {/* PTZ Direction Pad */}
              <div className="flex flex-col items-center gap-1.5 py-2">
                <button
                  onClick={() => handlePtzAction('Tilt Up')}
                  disabled={camera.status === 'offline'}
                  className="p-2 rounded-lg bg-[#1F2937] hover:bg-[#263244] text-[#9CA3AF] hover:text-emerald-400 border border-[#374151] disabled:opacity-40"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePtzAction('Pan Left')}
                    disabled={camera.status === 'offline'}
                    className="p-2 rounded-lg bg-[#1F2937] hover:bg-[#263244] text-[#9CA3AF] hover:text-emerald-400 border border-[#374151] disabled:opacity-40"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-7 h-7 rounded-full bg-[#111827] border border-[#374151] flex items-center justify-center text-[10px] font-mono text-[#9CA3AF]">
                    PTZ
                  </div>
                  <button
                    onClick={() => handlePtzAction('Pan Right')}
                    disabled={camera.status === 'offline'}
                    className="p-2 rounded-lg bg-[#1F2937] hover:bg-[#263244] text-[#9CA3AF] hover:text-emerald-400 border border-[#374151] disabled:opacity-40"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handlePtzAction('Tilt Down')}
                  disabled={camera.status === 'offline'}
                  className="p-2 rounded-lg bg-[#1F2937] hover:bg-[#263244] text-[#9CA3AF] hover:text-emerald-400 border border-[#374151] disabled:opacity-40"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="mt-4 pt-3 border-t border-[#374151] flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] font-mono">Optical Zoom</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                    className="p-1 rounded bg-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB] border border-[#374151]"
                    title="Zoom Out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-mono text-emerald-400 font-semibold text-xs">
                    {zoomLevel.toFixed(2)}x
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                    className="p-1 rounded bg-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB] border border-[#374151]"
                    title="Zoom In"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-[#374151] space-y-2">
              <button
                onClick={() =>
                  showToast(`Snapshot saved for ${camera.id}`, 'success', 'Evidence Captured')
                }
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#1F2937] hover:bg-[#263244] border border-[#374151] text-xs font-medium text-[#F9FAFB] transition-colors"
              >
                <CameraIcon className="w-3.5 h-3.5 text-emerald-400" />
                Capture High-Res Frame
              </button>

              <button
                onClick={() => handlePtzAction('Home Calibration')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#1F2937] hover:bg-[#263244] border border-[#374151] text-xs font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Pan/Tilt Home
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry and Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[11px] text-[#9CA3AF] block font-mono">Frame Rate</span>
            <span className="text-base font-bold font-mono text-[#F9FAFB] mt-0.5 block">
              {camera.fps || 0} FPS
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[11px] text-[#9CA3AF] block font-mono">Stream Bitrate</span>
            <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
              {camera.status === 'offline' ? '0.0 Mbps' : '4.6 Mbps'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[11px] text-[#9CA3AF] block font-mono">Video Compression</span>
            <span className="text-base font-bold font-mono text-[#F9FAFB] mt-0.5 block">
              H.265 (HEVC)
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[11px] text-[#9CA3AF] block font-mono">Last Seen</span>
            <span className="text-base font-bold font-mono text-[#F9FAFB] mt-0.5 block truncate">
              {new Date(camera.lastSeen).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Recent Detections on This Camera */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Recent AI Detections on this Feed
            </h4>
            <span className="text-xs text-[#9CA3AF] font-mono">{cameraEvents.length} records</span>
          </div>

          <div className="rounded-xl border border-[#374151] overflow-hidden bg-[#151E2D]">
            {cameraEvents.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#9CA3AF]">
                No recent detection events logged for this camera.
              </div>
            ) : (
              <div className="divide-y divide-[#374151]">
                {cameraEvents.map((evt) => (
                  <div key={evt.id} className="p-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-emerald-400 font-semibold">{evt.id}</span>
                      <EventTypeBadge type={evt.type} size="sm" />
                      <span className="text-[#9CA3AF] hidden sm:inline">{evt.description}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <SeverityBadge severity={evt.severity} size="sm" />
                      <span className="font-mono text-[11px] text-[#6B7280]">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
