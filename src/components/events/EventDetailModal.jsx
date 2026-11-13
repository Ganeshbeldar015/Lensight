import React, { useEffect } from 'react';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { EventTypeBadge } from '@/components/ui/EventTypeBadge';
import { Button } from '@/components/ui/Button';
import { X, Camera, Clock, ShieldCheck, MapPin, ExternalLink, Activity } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-semibold text-[#16845B]">{event.id}</span>
            <EventTypeBadge type={event.type} size="sm" />
            <SeverityBadge severity={event.severity} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1F2937] hover:bg-slate-200/60 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Simulated Snapshot Frame with Bounding Box */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#E5E7EB] bg-slate-950">
            <img
              src={event.thumbnailUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'}
              alt={event.description}
              className="w-full h-full object-cover opacity-90"
            />

            {/* Bounding Box Overlay */}
            {event.boundingBoxes && event.boundingBoxes.length > 0 && (
              <div
                className="absolute border-2 border-[#16845B] bg-[#16845B]/15 flex flex-col justify-start"
                style={{
                  left: `${(event.boundingBoxes[0].x / 640) * 100}%`,
                  top: `${(event.boundingBoxes[0].y / 480) * 100}%`,
                  width: `${(event.boundingBoxes[0].width / 640) * 100}%`,
                  height: `${(event.boundingBoxes[0].height / 480) * 100}%`
                }}
              >
                <span className="bg-[#16845B] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-wider self-start flex items-center gap-1 shadow">
                  <span>{event.boundingBoxes[0].label}</span>
                </span>
              </div>
            )}

            {/* Camera Tag Overlay */}
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-md border border-white/10 font-mono text-xs text-white flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[#16845B]" />
              <span>{event.cameraName || event.cameraId}</span>
            </div>

            {/* Simulated Badge */}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[10px] font-medium shadow border border-white/10">
              Simulated Snapshot
            </div>
          </div>

          {/* Description & Metadata */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[#1F2937] mb-1.5">Event Description</h4>
              <p className="text-sm text-[#1F2937] leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-[#E5E7EB]">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#16845B]" />
                  Event Type
                </div>
                <div className="pt-0.5">
                  <EventTypeBadge type={event.type} size="sm" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                  Confidence
                </div>
                <div className="text-sm font-bold text-[#1F2937]">
                  {(event.confidence * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#16845B]"
                    style={{ width: `${event.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#16845B]" />
                  Timestamp
                </div>
                <div className="text-xs text-[#1F2937] font-semibold leading-tight">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  {new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#16845B]" />
                  Camera Source
                </div>
                <div className="text-xs font-semibold text-[#1F2937] truncate">
                  {event.cameraName || event.cameraId}
                </div>
                <div className="text-[11px] text-[#64748B] truncate font-mono mt-0.5">
                  ID: {event.cameraId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-slate-50">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => {
              onClose();
              navigate('/live');
            }}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Live Monitoring
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
