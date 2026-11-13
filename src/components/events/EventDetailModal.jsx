import React, { useEffect } from 'react';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { EventTypeBadge } from '@/components/ui/EventTypeBadge';
import { Button } from '@/components/ui/Button';
import { X, Camera, Clock, ShieldCheck, MapPin, ExternalLink, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EventDetailModal = ({ event, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-[#fa5d19]">{event.id}</span>
            <EventTypeBadge type={event.type} size="sm" />
            <SeverityBadge severity={event.severity} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Simulated Snapshot Frame with Bounding Box */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 bg-slate-950">
            <img
              src={event.thumbnailUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'}
              alt={event.description}
              className="w-full h-full object-cover opacity-85"
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
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-md border border-white/10 font-mono text-xs text-white flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[#fa5d19]" />
              <span>{event.cameraName || event.cameraId}</span>
            </div>

            {/* Simulated Badge */}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-orange-500/90 text-white font-mono text-[10px] font-bold shadow">
              SIMULATED FRAME
            </div>
          </div>

          {/* Description & Metadata */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Detection Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1.5">
                  <ScanLine className="w-3.5 h-3.5 text-[#fa5d19]" />
                  EVENT TYPE
                </div>
                <div className="pt-0.5">
                  <EventTypeBadge type={event.type} size="sm" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#fa5d19]" />
                  CONFIDENCE
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {(event.confidence * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${
                      event.confidence >= 0.8
                        ? 'bg-emerald-500'
                        : event.confidence >= 0.65
                        ? 'bg-[#fa5d19]'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${event.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#fa5d19]" />
                  TIMESTAMP
                </div>
                <div className="text-xs font-mono text-slate-900 font-bold leading-tight">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#fa5d19]" />
                  CAMERA SOURCE
                </div>
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {event.cameraName || event.cameraId}
                </div>
                <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                  ID: {event.cameraId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
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
