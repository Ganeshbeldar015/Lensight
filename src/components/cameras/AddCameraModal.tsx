import React, { useState } from 'react';
import { useCameras } from '@/context/CameraContext';
import { Button } from '@/components/ui/Button';
import type { CameraStatus } from '@/types';
import { X, Plus, AlertCircle, Video } from 'lucide-react';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCameraModal: React.FC<AddCameraModalProps> = ({ isOpen, onClose }) => {
  const { addCamera } = useCameras();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('Perimeter');
  const [streamUrl, setStreamUrl] = useState('');
  const [status, setStatus] = useState<CameraStatus>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Camera name is required.';
    if (!location.trim()) errs.location = 'Physical location is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await addCamera({
        name: name.trim(),
        location: location.trim(),
        zone: zone.trim(),
        status,
        streamUrl: streamUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
        fps: 30,
        resolution: '1080p'
      });
      // Reset form
      setName('');
      setLocation('');
      setStreamUrl('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl border border-[#333] bg-[#141414] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#fa5d19]/20 text-[#fa5d19] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Register New Camera Node</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-white hover:bg-[#222]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">
              Camera Name <span className="text-[#fa5d19]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. West Loading Bay Gate 3"
              className="w-full px-3.5 py-2 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-sm text-white placeholder-[#555] focus:border-[#fa5d19] focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs text-[#eb3424] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">
                Location <span className="text-[#fa5d19]">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Warehouse B - Floor 1"
                className="w-full px-3.5 py-2 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-sm text-white placeholder-[#555] focus:border-[#fa5d19] focus:outline-none"
              />
              {errors.location && (
                <p className="text-xs text-[#eb3424] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">
                Security Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-sm text-white focus:border-[#fa5d19] focus:outline-none font-mono"
              >
                <option value="Perimeter">Perimeter Entry</option>
                <option value="Restricted">Restricted Tier 4</option>
                <option value="Logistics">Logistics & Docks</option>
                <option value="Executive">Executive Wing</option>
                <option value="Common">Common Public Areas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">
              RTSP / Stream URL <span className="text-[10px] text-[#666]">(Optional mock feed)</span>
            </label>
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="rtsp://192.168.1.120:554/live/ch0 or .mp4 link"
              className="w-full px-3.5 py-2 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-sm text-white placeholder-[#555] focus:border-[#fa5d19] focus:outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#aaa] uppercase mb-1">
              Initial Connectivity Status
            </label>
            <div className="flex items-center gap-3">
              {(['online', 'warning', 'offline'] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer text-xs font-mono capitalize text-[#ccc]">
                  <input
                    type="radio"
                    name="cameraStatus"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="accent-[#fa5d19]"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] text-xs text-[#888] flex items-start gap-2">
            <Video className="w-4 h-4 text-[#fa5d19] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upon registration, this camera will immediately synchronize with the Live Monitoring wall, Overview KPI counters, and telemetry database.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Register Camera
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
