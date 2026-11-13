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
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#fa5d19] flex items-center gap-1.5 font-bold">
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
      <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, or CAM-ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:border-[#fa5d19] focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['all', 'online', 'warning', 'offline'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded text-xs font-mono capitalize transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-[#fa5d19] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <span className="font-mono text-xs text-slate-500 ml-2 hidden sm:inline-block">
            {filteredCameras.length} of {cameras.length} Nodes
          </span>
        </div>
      </div>

      {/* Camera Inventory Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
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
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredCameras.map((camera) => (
              <tr
                key={camera.id}
                className="hover:bg-slate-50/90 transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-bold text-[#fa5d19]">
                  {camera.id}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900 group-hover:text-[#fa5d19] transition-colors">
                    {camera.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">
                    {camera.streamUrl || 'Sample Stream Simulation'}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{camera.location}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    {camera.zone || 'Zone 01'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={camera.status} size="sm" />
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">
                  <span>{camera.resolution}</span> • <span>{camera.fps}fps</span>
                </td>
                <td 
                  className="py-3 px-4 font-mono text-slate-500"
                  title={new Date(camera.lastSeen).toUTCString()}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(camera.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setFocusCamera(camera)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Inspect Live Feed"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCameraToDelete(camera)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Decommission Camera Node</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-slate-900">{cameraToDelete.name}</span> ({cameraToDelete.id})? This will immediately disconnect its live feed from the monitoring wall.
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
