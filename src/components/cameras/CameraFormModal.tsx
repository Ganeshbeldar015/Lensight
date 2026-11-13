import React, { useState, useEffect } from 'react';
import type { Camera, CameraStatus } from '@/types';
import { Modal } from '@/components/common/Modal';
import { useApp } from '@/context/AppContext';

interface CameraFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameraToEdit?: Camera | null;
}

export const CameraFormModal: React.FC<CameraFormModalProps> = ({
  isOpen,
  onClose,
  cameraToEdit,
}) => {
  const { cameras, addCamera, updateCamera } = useApp();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('Perimeter & Access');
  const [status, setStatus] = useState<CameraStatus>('online');
  const [resolution, setResolution] = useState('1920x1080 (1080p)');
  const [fps, setFps] = useState(30);
  const [streamUrl, setStreamUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cameraToEdit) {
      setId(cameraToEdit.id);
      setName(cameraToEdit.name);
      setLocation(cameraToEdit.location);
      setZone(cameraToEdit.zone || 'Perimeter & Access');
      setStatus(cameraToEdit.status);
      setResolution(cameraToEdit.resolution || '1920x1080 (1080p)');
      setFps(cameraToEdit.fps || 30);
      setStreamUrl(cameraToEdit.streamUrl || '');
    } else {
      // Auto-suggest next ID
      const nextNum = cameras.length + 1;
      setId(`CAM-${String(nextNum).padStart(3, '0')}`);
      setName('');
      setLocation('');
      setZone('Perimeter & Access');
      setStatus('online');
      setResolution('1920x1080 (1080p)');
      setFps(30);
      setStreamUrl('');
    }
    setErrors({});
  }, [cameraToEdit, cameras.length, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!id.trim()) {
      errs.id = 'Camera ID is required';
    } else if (!cameraToEdit && cameras.some((c) => c.id.toLowerCase() === id.trim().toLowerCase())) {
      errs.id = 'Camera ID already exists';
    }
    if (!name.trim()) errs.name = 'Camera name is required';
    if (!location.trim()) errs.location = 'Location description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (cameraToEdit) {
      updateCamera(cameraToEdit.id, {
        name: name.trim(),
        location: location.trim(),
        zone: zone.trim(),
        status,
        resolution,
        fps: Number(fps),
        streamUrl: streamUrl.trim() || undefined,
      });
    } else {
      addCamera({
        id: id.trim().toUpperCase(),
        name: name.trim(),
        location: location.trim(),
        zone: zone.trim(),
        status,
        resolution,
        fps: Number(fps),
        streamUrl: streamUrl.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cameraToEdit ? `Edit Camera ${cameraToEdit.id}` : 'Add Security Camera'}
      subtitle="Register an IP camera node into the Lensight Video Intelligence network"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Camera ID and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
              Camera ID *
            </label>
            <input
              type="text"
              disabled={Boolean(cameraToEdit)}
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. CAM-021"
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs font-mono text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            {errors.id && <p className="mt-1 text-[11px] text-red-400">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CameraStatus)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs font-mono text-[#F9FAFB] focus:outline-none focus:border-emerald-500"
            >
              <option value="online">ONLINE (Normal Stream)</option>
              <option value="warning">WARNING (Degraded / Latency)</option>
              <option value="offline">OFFLINE (Disconnected)</option>
            </select>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
            Camera Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Logistics Dock B Entry"
            className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500"
          />
          {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
        </div>

        {/* Location & Zone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
              Location / Physical Site *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Building C - Level 1"
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500"
            />
            {errors.location && <p className="mt-1 text-[11px] text-red-400">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
              Operational Zone
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs text-[#F9FAFB] focus:outline-none focus:border-emerald-500"
            >
              <option value="Perimeter & Access">Perimeter & Access</option>
              <option value="Interior Access">Interior Access</option>
              <option value="Exterior Perimeter">Exterior Perimeter</option>
              <option value="Storage & Supply">Storage & Supply</option>
              <option value="Industrial Dock">Industrial Dock</option>
              <option value="High Security Data">High Security Data</option>
              <option value="Executive Suite">Executive Suite</option>
              <option value="Facilities & Utilities">Facilities & Utilities</option>
            </select>
          </div>
        </div>

        {/* Stream URL & Video specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
              Resolution
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs font-mono text-[#F9FAFB] focus:outline-none focus:border-emerald-500"
            >
              <option value="3840x2160 (4K)">3840x2160 (4K UHD)</option>
              <option value="1920x1080 (1080p)">1920x1080 (1080p FHD)</option>
              <option value="1280x720 (720p)">1280x720 (720p HD)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
              Target Frame Rate (FPS)
            </label>
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs font-mono text-[#F9FAFB] focus:outline-none focus:border-emerald-500"
            >
              <option value={15}>15 FPS (Storage Saving)</option>
              <option value={25}>25 FPS (Standard PAL)</option>
              <option value={30}>30 FPS (Fluid Surveillance)</option>
              <option value={60}>60 FPS (High-Speed Gate)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
            RTSP / Sample Video URL (Optional)
          </label>
          <input
            type="url"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="https://... or rtsp://..."
            className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs font-mono text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500"
          />
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Leave blank to use the simulated high-fidelity AI optical feed canvas.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#374151]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-[#263244] border border-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-colors"
          >
            {cameraToEdit ? 'Save Changes' : 'Register Camera'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

