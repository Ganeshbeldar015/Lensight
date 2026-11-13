import React, { useState } from 'react';
import { useCameras } from '@/context/CameraContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AddCameraModal } from '@/components/cameras/AddCameraModal';
import { CameraFocusModal } from '@/components/cameras/CameraFocusModal';
import { 
  Camera as CameraIcon, 
  Plus, 
  Search, 
  Trash2, 
  Maximize2, 
  MapPin, 
  Clock 
} from 'lucide-react';

export const CamerasPage = () => {
  const { cameras, loading, deleteCamera, updateStatus } = useCameras();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [focusCamera, setFocusCamera] = useState(null);
  const [cameraToDelete, setCameraToDelete] = useState(null);

  const filteredCameras = cameras.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      (c.zone && c.zone.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = async () => {
    if (cameraToDelete) {
      await deleteCamera(cameraToDelete.id);
      setCameraToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cameras"
        description="Configure, inspect status, and manage surveillance cameras across all facilities."
        badge={
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5EF] border border-[#16845B]/20 text-[#16845B] flex items-center gap-1.5 font-semibold">
            <CameraIcon className="w-3.5 h-3.5" />
            {cameras.length} Cameras Configured
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Camera
          </Button>
        }
      />

      {/* Search & Filter Strip */}
      <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-[#E5E7EB] text-xs text-[#1F2937] placeholder-[#94A3B8] focus:border-[#16845B] focus:ring-1 focus:ring-[#16845B] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-[#E5E7EB]">
            {['all', 'online', 'warning', 'offline'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded text-xs capitalize font-medium transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-[#16845B] text-white font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2937]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#64748B] ml-2 hidden sm:inline-block">
            {filteredCameras.length} of {cameras.length} Cameras
          </span>
        </div>
      </div>

      {/* Camera Inventory Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-slate-50 text-xs uppercase tracking-wider text-[#64748B] font-semibold">
              <th className="py-3 px-4">Camera ID</th>
              <th className="py-3 px-4">Camera Name</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Zone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Specs</th>
              <th className="py-3 px-4">Last Seen</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs">
            {filteredCameras.map((camera) => (
              <tr
                key={camera.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-medium text-[#16845B]">
                  {camera.id}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-[#1F2937] group-hover:text-[#16845B] transition-colors">
                    {camera.name}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate max-w-xs">
                    {camera.streamUrl || 'Local Stream'}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{camera.location}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#64748B]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-[#E5E7EB] text-[#1F2937] font-medium text-[11px]">
                    {camera.zone || 'Zone 01'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={camera.status} size="sm" />
                </td>
                <td className="py-3 px-4 text-[#64748B]">
                  <span>{camera.resolution}</span> &bull; <span>{camera.fps} fps</span>
                </td>
                <td 
                  className="py-3 px-4 text-[#64748B]"
                  title={new Date(camera.lastSeen).toUTCString()}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#94A3B8]" />
                    {new Date(camera.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setFocusCamera(camera)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1F2937] hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Inspect Feed"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCameraToDelete(camera)}
                      className="p-1.5 rounded-lg text-[#DC5656] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove Camera"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Camera Modal Dialog */}
      <AddCameraModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Camera Focus Modal */}
      <CameraFocusModal
        camera={focusCamera}
        onClose={() => setFocusCamera(null)}
        onStatusChange={(newStatus) => {
          if (focusCamera) {
            updateStatus(focusCamera.id, newStatus);
            setFocusCamera({ ...focusCamera, status: newStatus });
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      {cameraToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-semibold text-[#1F2937]">Remove Camera</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-[#1F2937]">{cameraToDelete.name}</span> ({cameraToDelete.id})? This will disconnect its stream from the live monitoring wall.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setCameraToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteConfirm}>
                Remove Camera
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
