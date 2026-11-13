import React, { useEffect } from 'react';
import type { DetectionEvent } from '@/types';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { Button } from '@/components/ui/Button';
import { X, Camera, Clock, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventDetailModalProps {
  event: DetectionEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-[#333] bg-[#141414] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-[#fa5d19]">{event.id}</span>
            <SeverityBadge severity={event.severity} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-white hover:bg-[#222]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Simulated Snapshot Frame with Bounding Box */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#2f2f2f] bg-black">
            <img
              src={event.thumbnailUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'}
              alt={event.description}
              className="w-full h-full object-cover opacity-80"
            />

            {/* Bounding Box Overlay */}
            {event.boundingBoxes && event.boundingBoxes.length > 0 && (
              <div
                className="absolute border-2 border-[#fa5d19] bg-[rgba(250,93,25,0.18)] flex flex-col justify-start"
                style={{
                  left: `${(event.boundingBoxes[0].x / 640) * 100}%`,
                  top: `${(event.boundingBoxes[0].y / 480) * 100}%`,
                  width: `${(event.boundingBoxes[0].width / 640) * 100}%`,
                  height: `${(event.boundingBoxes[0].height / 480) * 100}%`
                }}
              >
                <span className="bg-[#fa5d19] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-wider self-start flex items-center gap-1 shadow">
                  <span>{event.boundingBoxes[0].label}</span>
                  <span className="opacity-80 text-[8px]">[SIMULATED]</span>
                </span>
              </div>
            )}

            {/* Camera Tag Overlay */}
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 font-mono text-xs text-white flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[#fa5d19]" />
              <span>{event.cameraName || event.cameraId}</span>
            </div>

            {/* Simulated Badge */}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#fa5d19]/20 border border-[#fa5d19]/40 text-[#fa5d19] font-mono text-[10px] font-semibold">
              SIMULATED FRAME
            </div>
          </div>

          {/* Description & Metadata */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Detection Description</h4>
              <p className="text-sm text-[#b0b0b0] leading-relaxed bg-[#1b1b1b] p-3 rounded-lg border border-[#2a2a2a]">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#181818] border border-[#262626]">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#777] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#fa5d19]" />
                  CONFIDENCE
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {(event.confidence * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${
                      event.confidence >= 0.8
                        ? 'bg-[#22c55e]'
                        : event.confidence >= 0.65
                        ? 'bg-[#fa5d19]'
                        : 'bg-[#666]'
                    }`}
                    style={{ width: `${event.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#181818] border border-[#262626]">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#777] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#fa5d19]" />
                  TIMESTAMP
                </div>
                <div className="text-xs font-mono text-white leading-tight">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[10px] text-[#777] font-mono mt-0.5">
                  {new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#181818] border border-[#262626] col-span-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#777] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#fa5d19]" />
                  CAMERA SOURCE
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {event.cameraName || event.cameraId}
                </div>
                <div className="text-[10px] text-[#777] truncate font-mono mt-0.5">
                  ID: {event.cameraId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#262626] bg-[#111]">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => {
              onClose();
              navigate('/live');
            }}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Jump to Live Monitoring
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
