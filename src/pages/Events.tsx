import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { EventFilters } from '@/components/events/EventFilters';
import { EventTable } from '@/components/events/EventTable';
import { EventDetailsModal } from '@/components/events/EventDetailsModal';
import type { DetectionEvent, EventType, Severity } from '@/types';
import { Download } from 'lucide-react';

export const Events: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { events, cameras, showToast } = useApp();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [dateRange, setDateRange] = useState<'today' | '24h' | '7d' | '30d' | 'all'>('today');

  // Modal inspection state
  const [selectedEvent, setSelectedEvent] = useState<DetectionEvent | null>(null);

  // Sync with URL query parameter
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleToggleType = (type: EventType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleToggleSeverity = (sev: Severity) => {
    setSelectedSeverities((prev) =>
      prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedSeverities([]);
    setSelectedCameraId('');
    setDateRange('today');
    setSearchParams({});
  };

  // Filtered dataset calculation
  const filteredEvents = useMemo(() => {
    const now = new Date().getTime();

    return events.filter((evt) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = evt.id.toLowerCase().includes(q);
        const matchType = evt.type.toLowerCase().includes(q);
        const matchCam = (evt.cameraName || '').toLowerCase().includes(q) || evt.cameraId.toLowerCase().includes(q);
        const matchDesc = evt.description.toLowerCase().includes(q);
        if (!matchId && !matchType && !matchCam && !matchDesc) return false;
      }

      // 2. Types
      if (selectedTypes.length > 0 && !selectedTypes.includes(evt.type)) {
        return false;
      }

      // 3. Severities
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(evt.severity)) {
        return false;
      }

      // 4. Camera
      if (selectedCameraId && evt.cameraId !== selectedCameraId) {
        return false;
      }

      // 5. Date Range
      const evtTime = new Date(evt.timestamp).getTime();
      if (dateRange === 'today') {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        if (evtTime < startOfToday.getTime()) return false;
      } else if (dateRange === '24h') {
        if (now - evtTime > 24 * 60 * 60 * 1000) return false;
      } else if (dateRange === '7d') {
        if (now - evtTime > 7 * 24 * 60 * 60 * 1000) return false;
      } else if (dateRange === '30d') {
        if (now - evtTime > 30 * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedTypes, selectedSeverities, selectedCameraId, dateRange]);

  const handleExportCSV = () => {
    const headers = 'ID,Type,Camera,Timestamp,Confidence,Severity,Description\n';
    const rows = filteredEvents
      .map(
        (e) =>
          `"${e.id}","${e.type}","${e.cameraName || e.cameraId}","${e.timestamp}","${Math.round(
            e.confidence * 100
          )}%","${e.severity}","${e.description.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lensight-events-export-${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredEvents.length} events to CSV`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="AI Detection Events"
        subtitle="Searchable audit trail of neural network recognitions, bounding box telemetry, and spatial incursions"
        breadcrumbs={[{ label: 'Lensight' }, { label: 'Events' }]}
        actions={
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#263244] border border-[#374151] hover:border-emerald-500/40 text-[#F9FAFB] hover:text-emerald-400 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Multi-Facet Filter Controls */}
      <EventFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTypes={selectedTypes}
        onToggleType={handleToggleType}
        selectedSeverities={selectedSeverities}
        onToggleSeverity={handleToggleSeverity}
        selectedCameraId={selectedCameraId}
        onCameraChange={setSelectedCameraId}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onClearFilters={handleClearFilters}
        cameras={cameras}
        totalCount={events.length}
        filteredCount={filteredEvents.length}
      />

      {/* Events Table */}
      <EventTable
        events={filteredEvents}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
        onResetFilters={handleClearFilters}
      />

      {/* Event Details Inspection Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
