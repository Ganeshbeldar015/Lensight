import React from 'react';
import type { DetectionEvent } from '@/types';
import { Modal } from '@/components/common/Modal';
import { EventTypeBadge } from '@/components/common/EventTypeBadge';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import {
  ShieldAlert,
  Download,
  Share2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface EventDetailsModalProps {
  event: DetectionEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();

  if (!event) return null;

  const confPercent = Math.round(event.confidence * 100);
  const formattedDate = new Date(event.timestamp).toLocaleString();

  const handleCreateAlert = () => {
    showToast(
      `Escalation incident created for ${event.id} on ${event.cameraName || event.cameraId}`,
      'success',
      'Alert Created'
    );
  };

  const handleDownloadSnapshot = () => {
    showToast(`High-resolution evidence frame exported for ${event.id}`, 'info', 'Export Finished');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Event Inspection – ${event.id}`}
      subtitle={`Triggered on ${event.cameraName || event.cameraId} • Confidence ${confPercent}%`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Visual Detection Frame Simulation */}
        <div className="relative aspect-video rounded-xl bg-[#0a0f18] overflow-hidden border border-[#374151]">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />

          {/* CCTV scanline */}
          <div className="absolute inset-0 cctv-scanlines pointer-events-none opacity-40" />

          {/* Simulated AI Object Bounding Boxes */}
          {event.boundingBoxes && event.boundingBoxes.length > 0 ? (
            event.boundingBoxes.map((box, idx) => (
              <div
                key={idx}
                className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded pointer-events-none transition-all"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-emerald-500 text-black text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                  {box.label || `${event.type.toUpperCase()} ${confPercent}%`}
                </div>
              </div>
            ))
          ) : (
            <div
              className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded pointer-events-none"
              style={{ left: '35%', top: '25%', width: '30%', height: '50%' }}
            >
              <div className="absolute -top-6 left-0 bg-emerald-500 text-black text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                {event.type.toUpperCase()} {confPercent}%
              </div>
            </div>
          )}

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/20">
              {event.cameraId}
            </span>
            <SeverityBadge severity={event.severity} size="sm" />
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-[#F9FAFB]/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none">
            <span>{formattedDate}</span>
            <span className="text-emerald-400 font-bold uppercase">
              Model: Lensight YOLO-v10-Security
            </span>
          </div>
        </div>

        {/* Event Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[11px] font-mono text-[#9CA3AF] block">Classification</span>
            <div className="mt-1">
              <EventTypeBadge type={event.type} size="sm" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[11px] font-mono text-[#9CA3AF] block">AI Confidence</span>
            <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
              {confPercent}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[11px] font-mono text-[#9CA3AF] block">Severity Tier</span>
            <div className="mt-1">
              <SeverityBadge severity={event.severity} size="sm" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[11px] font-mono text-[#9CA3AF] block">Latency</span>
            <span className="text-base font-bold font-mono text-[#F9FAFB] mt-1 block">
              34ms Edge
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="p-4 rounded-xl bg-[#151E2D] border border-[#374151]">
          <h4 className="text-xs font-bold text-[#F9FAFB] uppercase tracking-wider font-mono mb-1">
            Event Narrative & Telemetry
          </h4>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">{event.description}</p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#374151]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSnapshot}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-[#263244] border border-[#374151] text-[#F9FAFB] hover:border-emerald-500/40 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Snapshot</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(event, null, 2));
                showToast('Event metadata copied to clipboard', 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-[#263244] border border-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateAlert}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Escalate Alert</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
