import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { CameraCard } from '@/components/cameras/CameraCard';
import { CameraDetailsModal } from '@/components/cameras/CameraDetailsModal';
import { EmptyState } from '@/components/common/EmptyState';
import type { Camera, CameraStatus } from '@/types';
import {
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  Search,
  Info,
} from 'lucide-react';

export const LiveMonitoring: React.FC = () => {
  const { cameras } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CameraStatus>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3); // 2x2, 3x2, 4x4
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  // Extract unique zones
  const zones = useMemo(() => {
    const set = new Set<string>();
    cameras.forEach((c) => {
      if (c.zone) set.add(c.zone);
    });
    return Array.from(set);
  }, [cameras]);

  // Filter cameras
  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      if (statusFilter !== 'all' && cam.status !== statusFilter) return false;
      if (selectedZone !== 'all' && cam.zone !== selectedZone) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = cam.id.toLowerCase().includes(q);
        const matchName = cam.name.toLowerCase().includes(q);
        const matchLoc = cam.location.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchLoc) return false;
      }
      return true;
    });
  }, [cameras, statusFilter, selectedZone, searchQuery]);

  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[gridCols];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Live Video Wall"
        subtitle="Multi-channel CCTV surveillance grid with synchronized optical inference"
        breadcrumbs={[{ label: 'Lensight' }, { label: 'Live Monitoring' }]}
        actions={
          <div className="flex items-center gap-2 bg-[#1F2937] p-1 rounded-xl border border-[#374151]">
            <button
              onClick={() => setGridCols(2)}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                gridCols === 2
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
              title="2x2 Grid View"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                gridCols === 3
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
              title="3x2 Grid View (Standard Wall)"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                gridCols === 4
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
              title="4x4 Multi-Matrix View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Simulated Footage Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-[#151E2D] border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[#9CA3AF]">
            <strong className="text-emerald-400 font-mono">DEMO CONTENT NOTICE:</strong> Camera streams, RTSP feeds, and AI bounding box telemetry are simulated for this enterprise demonstration.
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 hidden sm:inline px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          60 FPS INFERENCE ENGINE
        </span>
      </div>

      {/* Controls Bar: Search, Status Filter, Zone Filter */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or camera name..."
            className="w-full bg-[#111827] border border-[#374151] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status buttons */}
          <div className="flex rounded-xl bg-[#111827] p-1 border border-[#374151] text-xs">
            {(['all', 'online', 'warning', 'offline'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`py-1 px-3 rounded-lg font-mono text-center text-xs uppercase transition-colors ${
                  statusFilter === st
                    ? 'bg-[#263244] text-emerald-400 font-semibold shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Zone Selector */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-[#111827] border border-[#374151] rounded-xl px-3 py-1.5 text-xs text-[#F9FAFB] focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="all">All Operational Zones</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera Video Grid */}
      {filteredCameras.length === 0 ? (
        <EmptyState
          title="No Camera Feeds Match Criteria"
          description="Try clearing the search query or status filters to view active video feeds."
          actionLabel="Reset View Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setSelectedZone('all');
          }}
        />
      ) : (
        <div className={`grid ${gridClass} gap-4`}>
          {filteredCameras.map((camera) => (
            <CameraCard
              key={camera.id}
              camera={camera}
              onOpenDetails={(cam) => setSelectedCamera(cam)}
              onFullscreen={(cam) => setSelectedCamera(cam)}
            />
          ))}
        </div>
      )}

      {/* Details / Fullscreen Modal */}
      <CameraDetailsModal
        camera={selectedCamera}
        isOpen={Boolean(selectedCamera)}
        onClose={() => setSelectedCamera(null)}
      />
    </div>
  );
};
