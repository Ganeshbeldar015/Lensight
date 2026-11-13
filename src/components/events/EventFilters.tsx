import React from 'react';
import type { EventType, Severity, Camera } from '@/types';
import { Search, Filter, X, RotateCcw } from 'lucide-react';

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTypes: EventType[];
  onToggleType: (t: EventType) => void;
  selectedSeverities: Severity[];
  onToggleSeverity: (s: Severity) => void;
  selectedCameraId: string;
  onCameraChange: (camId: string) => void;
  dateRange: 'today' | '24h' | '7d' | '30d' | 'all';
  onDateRangeChange: (r: 'today' | '24h' | '7d' | '30d' | 'all') => void;
  onClearFilters: () => void;
  cameras: Camera[];
  totalCount: number;
  filteredCount: number;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onToggleType,
  selectedSeverities,
  onToggleSeverity,
  selectedCameraId,
  onCameraChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  cameras,
  totalCount,
  filteredCount,
}) => {
  const eventTypes: { id: EventType; label: string }[] = [
    { id: 'person', label: 'Person' },
    { id: 'vehicle', label: 'Vehicle' },
    { id: 'motion', label: 'Motion' },
    { id: 'restricted_area', label: 'Restricted Area' },
  ];

  const severities: { id: Severity; label: string; color: string }[] = [
    { id: 'critical', label: 'Critical', color: 'text-red-400 border-red-500/30' },
    { id: 'high', label: 'High', color: 'text-orange-400 border-orange-500/30' },
    { id: 'medium', label: 'Medium', color: 'text-amber-400 border-amber-500/30' },
    { id: 'low', label: 'Low', color: 'text-emerald-400 border-emerald-500/30' },
  ];

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedTypes.length > 0 ||
    selectedSeverities.length > 0 ||
    Boolean(selectedCameraId) ||
    dateRange !== 'today';

  return (
    <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Top Search & Camera / Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Event ID, camera name, type, description..."
            className="w-full bg-[#111827] border border-[#374151] rounded-xl pl-9 pr-8 py-2 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#F9FAFB]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Camera Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedCameraId}
            onChange={(e) => onCameraChange(e.target.value)}
            className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs font-mono text-[#F9FAFB] focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Cameras ({cameras.length})</option>
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} – {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Presets */}
        <div className="md:col-span-3">
          <div className="flex rounded-xl bg-[#111827] p-1 border border-[#374151] text-xs">
            {(['today', '24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => onDateRangeChange(range)}
                className={`flex-1 py-1 px-1.5 rounded-lg font-mono text-center text-[11px] transition-colors ${
                  dateRange === range
                    ? 'bg-[#263244] text-emerald-400 font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                }`}
              >
                {range === 'today'
                  ? 'Today'
                  : range === '24h'
                  ? '24h'
                  : range === '7d'
                  ? '7d'
                  : '30d'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Chips: Event Type & Severity */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#374151]/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-[#9CA3AF] uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-400" /> Types:
          </span>
          {eventTypes.map((t) => {
            const isSelected = selectedTypes.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onToggleType(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-[#151E2D] text-[#9CA3AF] border-[#374151] hover:text-[#F9FAFB] hover:border-[#4B5563]'
                }`}
              >
                {t.label}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-[#374151] mx-1 hidden sm:block" />

          <span className="text-[11px] font-mono text-[#9CA3AF] uppercase mr-1">Severity:</span>
          {severities.map((s) => {
            const isSelected = selectedSeverities.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onToggleSeverity(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                  isSelected
                    ? `bg-[#263244] ${s.color} font-bold ring-1 ring-current`
                    : 'bg-[#151E2D] text-[#9CA3AF] border-[#374151] hover:text-[#F9FAFB]'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Result Counter & Clear */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#9CA3AF]">
            Showing <strong className="text-emerald-400">{filteredCount}</strong> of {totalCount} events
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
