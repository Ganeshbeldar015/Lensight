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
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Camera Inventory & Node Management"
        description="Configure, inspect telemetry, and manage active surveillance nodes across facilities."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[rgba(250,93,25,0.1)] border border-[#fa5d19]/30 text-[#fa5d19] flex items-center gap-1.5 font-bold">
            <CameraIcon className="w-3.5 h-3.5" />
            {cameras.length} NODES LINKED
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Camera Node
          </Button>
        }
      />

      {/* Search & Filter Strip */}
      <div className="p-4 rounded-xl border border-[#262626] bg-[#121212] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, or CAM-ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#181818] border border-[#2d2d2d] text-xs text-white placeholder-[#666] focus:border-[#fa5d19] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-[#2d2d2d]">
            {['all', 'online', 'warning', 'offline'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded text-xs font-mono capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-[#fa5d19] text-white font-bold shadow'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <span className="font-mono text-xs text-[#777] ml-2 hidden sm:inline-block">
            {filteredCameras.length} of {cameras.length} Nodes
          </span>
        </div>
      </div>

      {/* Camera Inventory Table */}
      <div className="rounded-xl border border-[#262626] bg-[#121212] overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#242424] bg-[#171717] font-mono text-[11px] uppercase tracking-wider text-[#888]">
              <th className="py-3 px-4">Node ID</th>
              <th className="py-3 px-4">Camera Name</th>
              <th className="py-3 px-4">Physical Location</th>
              <th className="py-3 px-4">Security Zone</th>
              <th className="py-3 px-4">Connectivity</th>
              <th className="py-3 px-4">Telemetry Specs</th>
              <th className="py-3 px-4">Last Heartbeat</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e] text-xs">
            {filteredCameras.map((camera) => (
              <tr
                key={camera.id}
                className="hover:bg-[#181818] transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-bold text-[#fa5d19]">
                  {camera.id}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-white group-hover:text-[#fa5d19] transition-colors">
                    {camera.name}
                  </div>
                  <div className="text-[10px] text-[#777] font-mono truncate max-w-xs">
                    {camera.streamUrl || 'Sample Stream Simulation'}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#aaa] flex items-center gap-1.5 pt-4">
                  <MapPin className="w-3.5 h-3.5 text-[#666]" />
                  <span>{camera.location}</span>
                </td>
                <td className="py-3 px-4 font-mono text-[#888]">
                  <span className="px-2 py-0.5 rounded bg-[#1c1c1c] border border-[#2a2a2a]">
                    {camera.zone || 'Zone 01'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={camera.status} size="sm" />
                </td>
                <td className="py-3 px-4 font-mono text-[#888]">
                  <span>{camera.resolution}</span> • <span>{camera.fps}fps</span>
                </td>
                <td 
                  className="py-3 px-4 font-mono text-[#888]"
                  title={new Date(camera.lastSeen).toUTCString()}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#666]" />
                    {new Date(camera.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setFocusCamera(camera)}
                      className="p-1.5 rounded-lg text-[#aaa] hover:text-white hover:bg-[#252525] transition-colors"
                      title="Inspect Live Feed"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCameraToDelete(camera)}
                      className="p-1.5 rounded-lg text-[#eb3424]/70 hover:text-[#eb3424] hover:bg-red-950/30 transition-colors"
                      title="Remove Node"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[#333] bg-[#141414] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Decommission Camera Node</h3>
            <p className="text-xs text-[#aaa] leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-white">{cameraToDelete.name}</span> ({cameraToDelete.id})? This will immediately disconnect its live feed from the monitoring wall.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setCameraToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteConfirm}>
                Confirm Decommission
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
