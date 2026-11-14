import React, { useState, useEffect } from 'react';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { EventTypeBadge } from '@/components/ui/EventTypeBadge';
import { Button } from '@/components/ui/Button';
import { X, Camera, Clock, ShieldCheck, MapPin, ExternalLink, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EventDetailModal = ({ event, onClose }) => {
  const navigate = useNavigate();

  const getSnapshot = (evt) => {
    if (!evt) return '/snapshots/outside.jpg';
    if (evt.thumbnailUrl && !evt.thumbnailUrl.startsWith('http')) {
      return evt.thumbnailUrl;
    }
    const text = (evt.cameraName || evt.cameraId || evt.description || evt.type || '').toLowerCase();
    if (text.includes('corridor') || text.includes('vault') || text.includes('server')) {
      return '/snapshots/corridor.jpg';
    }
    if (text.includes('parking') || text.includes('dock') || text.includes('loading') || text.includes('yard')) {
      return '/snapshots/parking.jpg';
    }
    if (text.includes('reception') || text.includes('lobby') || text.includes('office') || text.includes('safe')) {
      return '/snapshots/reception.jpg';
    }
    if (text.includes('entrance') || text.includes('gate') || text.includes('turnstile')) {
      return '/snapshots/entrance.jpg';
    }
    return '/snapshots/outside.jpg';
  };

  const [imgSrc, setImgSrc] = useState(getSnapshot(event));

  useEffect(() => {
    setImgSrc(getSnapshot(event));
  }, [event]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#263b40]/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-[#dce5e7] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#dce5e7] bg-[#f0f6f6]">
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <span className="font-mono text-sm font-semibold text-[#168a91] shrink-0 whitespace-nowrap">{event.id}</span>
            <EventTypeBadge type={event.type} size="sm" />
            <SeverityBadge severity={event.severity} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8a9b9f] hover:text-[#263b40] hover:bg-[#e7f3f3] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Simulated Snapshot Frame with Bounding Box */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#dce5e7] bg-slate-950">
            <img
              src={imgSrc}
              alt={event.description}
              onError={() => setImgSrc('/snapshots/outside.jpg')}
              className="w-full h-full object-cover opacity-90 transition-opacity duration-200"
            />

            {/* Bounding Box Overlay */}
            {event.boundingBoxes && event.boundingBoxes.length > 0 && (
              <div
                className="absolute border-2 border-[#168a91] bg-[#168a91]/15 flex flex-col justify-start"
                style={{
                  left: `${(event.boundingBoxes[0].x / 640) * 100}%`,
                  top: `${(event.boundingBoxes[0].y / 480) * 100}%`,
                  width: `${(event.boundingBoxes[0].width / 640) * 100}%`,
                  height: `${(event.boundingBoxes[0].height / 480) * 100}%`
                }}
              >
                <span className="bg-[#168a91] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-wider self-start flex items-center gap-1 shadow">
                  <span>{event.boundingBoxes[0].label}</span>
                </span>
              </div>
            )}

            {/* Camera Tag Overlay */}
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-md border border-white/10 font-mono text-xs text-white flex items-center gap-2 max-w-[70%] truncate">
              <Camera className="w-3.5 h-3.5 text-[#168a91] shrink-0" />
              <span className="truncate">{event.cameraName || event.cameraId}</span>
            </div>

            {/* Simulated Badge */}
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[10px] font-medium shadow border border-white/10">
              Simulated Snapshot
            </div>
          </div>

          {/* Description & Metadata */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[#263b40] mb-1.5">Event Description</h4>
              <p className="text-xs sm:text-sm text-[#263b40] leading-relaxed bg-[#f0f6f6] p-3 sm:p-3.5 rounded-lg border border-[#dce5e7]">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7]">
                <div className="flex items-center gap-1.5 text-xs text-[#61777c] mb-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#168a91]" />
                  Event Type
                </div>
                <div className="pt-0.5">
                  <EventTypeBadge type={event.type} size="sm" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7]">
                <div className="flex items-center gap-1.5 text-xs text-[#61777c] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#168a91]" />
                  Confidence
                </div>
                <div className="text-sm font-bold text-[#263b40]">
                  {(event.confidence * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-[#dce5e7] h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#168a91]"
                    style={{ width: `${event.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7]">
                <div className="flex items-center gap-1.5 text-xs text-[#61777c] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#168a91]" />
                  Timestamp
                </div>
                <div className="text-xs text-[#263b40] font-semibold leading-tight font-mono tabular-nums">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[11px] text-[#61777c] mt-0.5">
                  {new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7]">
                <div className="flex items-center gap-1.5 text-xs text-[#61777c] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#168a91]" />
                  Camera Source
                </div>
                <div className="text-xs font-semibold text-[#263b40] truncate">
                  {event.cameraName || event.cameraId}
                </div>
                <div className="text-[11px] text-[#61777c] truncate font-mono mt-0.5">
                  ID: {event.cameraId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#dce5e7] bg-[#f0f6f6]">
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
