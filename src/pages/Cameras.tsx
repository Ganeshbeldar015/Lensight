import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CameraFormModal } from '@/components/cameras/CameraFormModal';
import { CameraDetailsModal } from '@/components/cameras/CameraDetailsModal';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { EmptyState } from '@/components/common/EmptyState';
import type { Camera, CameraStatus } from '@/types';
import {
  Camera as CameraIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  WifiOff,
} from 'lucide-react';

export const Cameras: React.FC = () => {
  const { cameras, deleteCamera, kpis } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CameraStatus>('all');
  const [zoneFilter, setZoneFilter] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [inspectingCamera, setInspectingCamera] = useState<Camera | null>(null);
  const [deletingCamera, setDeletingCamera] = useState<Camera | null>(null);

  // Extract zones
  const zones = useMemo(() => {
    const set = new Set<string>();
    cameras.forEach((c) => {
      if (c.zone) set.add(c.zone);
    });
    return Array.from(set);
  }, [cameras]);

  // Filtered cameras
  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      if (statusFilter !== 'all' && cam.status !== statusFilter) return false;
      if (zoneFilter !== 'all' && cam.zone !== zoneFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = cam.id.toLowerCase().includes(q);
        const matchName = cam.name.toLowerCase().includes(q);
        const matchLoc = cam.location.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchLoc) return false;
      }
      return true;
    });
  }, [cameras, statusFilter, zoneFilter, searchQuery]);

  const handleDeleteConfirm = () => {
    if (deletingCamera) {
      deleteCamera(deletingCamera.id);
      setDeletingCamera(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Camera Fleet Management"
        subtitle="Manage distributed IP surveillance hardware, configure stream endpoints, and monitor node connectivity"
        breadcrumbs={[{ label: 'Lensight' }, { label: 'Cameras' }]}
        actions={
          <button
            onClick={() => {
              setEditingCamera(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Camera</span>
          </button>
        }
      />

      {/* Fleet Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#1F2937] border border-[#374151] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase">Fleet Size</span>
            <span className="text-xl font-bold font-mono text-[#F9FAFB] block mt-1">
              {kpis.totalCameras} Nodes
            </span>
          </div>
          <CameraIcon className="w-5 h-5 text-blue-400" />
        </div>

        <div className="p-4 rounded-xl bg-[#1F2937] border border-[#374151] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase">Active Streams</span>
            <span className="text-xl font-bold font-mono text-emerald-400 block mt-1">
              {kpis.onlineCount} Online
            </span>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-[#1F2937] border border-[#374151] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase">Degraded Links</span>
            <span className="text-xl font-bold font-mono text-amber-400 block mt-1">
              {kpis.warningCount} Warning
            </span>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>

        <div className="p-4 rounded-xl bg-[#1F2937] border border-[#374151] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase">Disconnected</span>
            <span className="text-xl font-bold font-mono text-red-400 block mt-1">
              {kpis.offlineCount} Offline
            </span>
          </div>
          <WifiOff className="w-5 h-5 text-red-400" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, location..."
            className="w-full bg-[#111827] border border-[#374151] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex rounded-xl bg-[#111827] p-1 border border-[#374151] text-xs">
            {(['all', 'online', 'warning', 'offline'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`py-1 px-3 rounded-lg font-mono text-center text-xs uppercase transition-colors ${
                  statusFilter === st
                    ? 'bg-[#263244] text-emerald-400 font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-[#111827] border border-[#374151] rounded-xl px-3 py-1.5 text-xs text-[#F9FAFB] focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="all">All Zones</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera Inventory Table */}
      {filteredCameras.length === 0 ? (
        <EmptyState
          title="No Cameras Found"
          description="No camera nodes match your search criteria. Try modifying your filters or add a new camera."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setZoneFilter('all');
          }}
        />
      ) : (
        <div className="rounded-2xl border border-[#374151] overflow-hidden bg-[#1F2937]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#374151] bg-[#151E2D] text-[#9CA3AF] uppercase font-mono tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Camera ID</th>
                  <th className="py-3 px-4 font-semibold">Camera Name</th>
                  <th className="py-3 px-4 font-semibold">Physical Location</th>
                  <th className="py-3 px-4 font-semibold">Zone</th>
                  <th className="py-3 px-4 font-semibold">Resolution / FPS</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Last Seen</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]/50 text-[#F9FAFB]">
                {filteredCameras.map((cam) => (
                  <tr
                    key={cam.id}
                    className="hover:bg-[#263244]/60 transition-colors cursor-pointer group"
                    onClick={() => setInspectingCamera(cam)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {cam.id}
                    </td>

                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">{cam.name}</td>

                    <td className="py-3.5 px-4 text-[#9CA3AF] max-w-xs truncate">{cam.location}</td>

                    <td className="py-3.5 px-4 text-[#9CA3AF] whitespace-nowrap font-mono text-[11px]">
                      {cam.zone || 'General'}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#9CA3AF]">
                      <span>{cam.resolution ? cam.resolution.split(' ')[0] : '1080p'}</span>
                      <span className="text-[#6B7280]"> @ </span>
                      <span>{cam.fps || 0}fps</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={cam.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[#9CA3AF] text-[11px]">
                      {new Date(cam.lastSeen).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingCamera(cam)}
                          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-emerald-400 hover:bg-[#263244] transition-colors"
                          title="View Live Stream"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCamera(cam);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#263244] transition-colors"
                          title="Edit Camera Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCamera(cam)}
                          className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Camera"
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
      )}

      {/* Add / Edit Camera Modal */}
      <CameraFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCamera(null);
        }}
        cameraToEdit={editingCamera}
      />

      {/* Details Modal */}
      <CameraDetailsModal
        camera={inspectingCamera}
        isOpen={Boolean(inspectingCamera)}
        onClose={() => setInspectingCamera(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deletingCamera)}
        onClose={() => setDeletingCamera(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Camera Node"
        message={`Are you sure you want to delete ${deletingCamera?.id} (${deletingCamera?.name})? This will disconnect video streaming and archive associated detection telemetry.`}
        confirmLabel="Delete Camera"
        isDestructive={true}
      />
    </div>
  );
};
