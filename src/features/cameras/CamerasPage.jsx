import React, { useState } from 'react';
import { useCameras } from '@/context/CameraContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
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
      <div className="p-4 rounded-xl border border-[#dce5e7] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8a9b9f] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] text-xs text-[#263b40] placeholder-[#8a9b9f] focus:border-[#168a91] focus:ring-1 focus:ring-[#168a91] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1 bg-[#f0f6f6] p-1 rounded-lg border border-[#dce5e7] overflow-x-auto no-scrollbar">
            {['all', 'online', 'warning', 'offline'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded text-xs capitalize font-medium transition-colors cursor-pointer shrink-0 ${
                  statusFilter === s
                    ? 'bg-[#168a91] text-white font-semibold shadow-xs'
                    : 'text-[#61777c] hover:text-[#263b40]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#61777c] ml-2 hidden sm:inline-block shrink-0">
            {filteredCameras.length} of {cameras.length} Cameras
          </span>
        </div>
      </div>

      {/* Camera Inventory Content */}
      {filteredCameras.length === 0 ? (
        <EmptyState
          icon={CameraIcon}
          title="No Cameras Found"
          description="No surveillance nodes match your search query or filter selection."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <>
          {/* Desktop/Tablet Table View with Horizontal Scroll Protection */}
          <div className="hidden md:block rounded-xl border border-[#dce5e7] bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#dce5e7] bg-[#f0f6f6] text-xs uppercase tracking-wider text-[#61777c] font-semibold">
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
                <tbody className="divide-y divide-[#dce5e7] text-xs">
                  {filteredCameras.map((camera) => (
                    <tr
                      key={camera.id}
                      className="hover:bg-[#f0f6f6] transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-[#168a91] whitespace-nowrap">
                        {camera.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#263b40] group-hover:text-[#168a91] transition-colors">
                          {camera.name}
                        </div>
                        <div className="text-[11px] text-[#61777c] truncate max-w-xs">
                          {camera.streamUrl || 'Local Stream'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#61777c]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8a9b9f]" />
                          <span>{camera.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#61777c]">
                        <span className="px-2 py-0.5 rounded bg-[#f0f6f6] border border-[#dce5e7] text-[#263b40] font-medium text-[11px]">
                          {camera.zone || 'Zone 01'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={camera.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-[#61777c] whitespace-nowrap">
                        <span>{camera.resolution}</span> &bull; <span>{camera.fps} fps</span>
                      </td>
                      <td 
                        className="py-3 px-4 text-[#61777c] whitespace-nowrap"
                        title={new Date(camera.lastSeen).toUTCString()}
                      >
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8a9b9f]" />
                          {new Date(camera.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setFocusCamera(camera)}
                            className="p-1.5 rounded-lg text-[#61777c] hover:text-[#263b40] hover:bg-[#e7f3f3] transition-colors cursor-pointer"
                            title="Inspect Feed"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCameraToDelete(camera)}
                            className="p-1.5 rounded-lg text-[#d95757] hover:text-red-700 hover:bg-[#fdf0f0] transition-colors cursor-pointer"
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
          </div>

          {/* Mobile Card List View (< md) */}
          <div className="md:hidden space-y-3">
            {filteredCameras.map((camera) => (
              <div
                key={camera.id}
                className="p-4 rounded-xl border border-[#dce5e7] bg-white space-y-3 shadow-xs hover:border-[#168a91]/30 transition-all"
              >
                {/* Card Top: Name, ID and Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#263b40] truncate leading-tight">
                        {camera.name}
                      </h4>
                      <span className="font-mono text-[10px] text-[#168a91] font-semibold px-1.5 py-0.5 rounded bg-[#ddf1f1] border border-[#168a91]/20 shrink-0">
                        {camera.id}
                      </span>
                    </div>
                    <p className="text-xs text-[#61777c] flex items-center gap-1.5 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#8a9b9f] shrink-0" />
                      <span className="truncate">{camera.location}</span>
                    </p>
                  </div>
                  <StatusBadge status={camera.status} size="sm" />
                </div>

                {/* Card Middle: Zone, Specs, Last Seen */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#dce5e7] text-xs text-[#61777c]">
                  <div className="flex items-center gap-1 truncate">
                    <span className="text-[#8a9b9f]">Zone:</span>
                    <span className="font-medium text-[#263b40] truncate">{camera.zone || 'Zone 01'}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end truncate">
                    <span className="text-[#8a9b9f]">Specs:</span>
                    <span className="font-medium text-[#263b40]">{camera.resolution} &bull; {camera.fps} fps</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-[11px] text-[#8a9b9f]">
                    <Clock className="w-3 h-3 text-[#8a9b9f]" />
                    <span>Last Seen: {new Date(camera.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-2 border-t border-[#dce5e7] flex items-center justify-between gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setFocusCamera(camera)}
                    leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
                  >
                    Inspect Feed
                  </Button>
                  <button
                    onClick={() => setCameraToDelete(camera)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#d95757] hover:text-red-700 hover:bg-[#fdf0f0] border border-[#dce5e7] transition-colors cursor-pointer flex items-center gap-1"
                    title="Remove Camera"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263b40]/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[#dce5e7] bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-semibold text-[#263b40]">Remove Camera</h3>
            <p className="text-xs text-[#61777c] leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-[#263b40]">{cameraToDelete.name}</span> ({cameraToDelete.id})? This will disconnect its stream from the live monitoring wall.
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
