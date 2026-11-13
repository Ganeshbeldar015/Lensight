import React, { useState } from 'react';
import { useCameras } from '@/context/CameraContext';
import { Button } from '@/components/ui/Button';
import { X, Plus, AlertCircle, Video } from 'lucide-react';

export const AddCameraModal = ({ isOpen, onClose }) => {
  const { addCamera } = useCameras();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('Perimeter');
  const [streamUrl, setStreamUrl] = useState('');
  const [status, setStatus] = useState('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Camera name is required.';
    if (!location.trim()) errs.location = 'Physical location is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await addCamera({
        name: name.trim(),
        location: location.trim(),
        zone: zone.trim(),
        status,
        streamUrl: streamUrl.trim() || '/demo-videos/entrance.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
        fps: 30,
        resolution: '1080p'
      });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#16845B] border border-[#16845B]/20 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#1F2937]">Register New Camera</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1F2937] hover:bg-slate-100 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#64748B] mb-1">
              Camera Name <span className="text-[#DC5656]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. West Loading Bay Gate 3"
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#1F2937] placeholder-[#94A3B8] focus:border-[#16845B] focus:ring-1 focus:ring-[#16845B] focus:outline-none transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-[#DC5656] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-medium text-[#64748B] mb-1">
                Location <span className="text-[#DC5656]">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Warehouse B - Floor 1"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#1F2937] placeholder-[#94A3B8] focus:border-[#16845B] focus:ring-1 focus:ring-[#16845B] focus:outline-none transition-colors"
              />
              {errors.location && (
                <p className="text-xs text-[#DC5656] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase font-medium text-[#64748B] mb-1">
                Security Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#1F2937] focus:border-[#16845B] focus:ring-1 focus:ring-[#16845B] focus:outline-none"
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
            <label className="block text-xs uppercase font-medium text-[#64748B] mb-1">
              Local Demo Video / Stream Source
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="/demo-videos/entrance.mp4"
                className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#1F2937] placeholder-[#94A3B8] focus:border-[#16845B] focus:ring-1 focus:ring-[#16845B] focus:outline-none font-mono"
              />
              <select
                onChange={(e) => { if (e.target.value) setStreamUrl(e.target.value); }}
                className="px-2.5 py-2 rounded-lg bg-slate-50 border border-[#E5E7EB] text-xs text-[#1F2937] cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Presets</option>
                <option value="/demo-videos/entrance.mp4">Entrance</option>
                <option value="/demo-videos/reception.mp4">Reception</option>
                <option value="/demo-videos/corridor.mp4">Corridor</option>
                <option value="/demo-videos/parking.mp4">Parking</option>
                <option value="/demo-videos/outside.mp4">Outside</option>
              </select>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              Simulated CCTV feed mapped to local public MP4 assets.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#64748B] mb-1">
              Initial Status
            </label>
            <div className="flex items-center gap-4">
              {['online', 'warning', 'offline'].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer text-xs capitalize text-[#1F2937]">
                  <input
                    type="radio"
                    name="cameraStatus"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="accent-[#16845B]"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#EAF5EF] border border-[#16845B]/20 text-xs text-[#16845B] flex items-start gap-2">
            <Video className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upon registration, this camera will synchronize with the Live Monitoring wall and Overview metrics.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
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
