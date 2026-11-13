import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dataProvider } from '@/services/dataProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { EventDetailModal } from '@/components/events/EventDetailModal';
import { 
  Search, 
  RotateCcw, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  X,
  ScanLine
} from 'lucide-react';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialTypes = searchParams.getAll('type');
  const initialSeverities = searchParams.getAll('severity');
  const initialRange = searchParams.get('range') || '30d';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);
  const [selectedTypes, setSelectedTypes] = useState(initialTypes);
  const [selectedSeverities, setSelectedSeverities] = useState(initialSeverities);
  const [dateRange, setDateRange] = useState(initialRange);

  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('search', debouncedQuery);
    selectedTypes.forEach((t) => params.append('type', t));
    selectedSeverities.forEach((s) => params.append('severity', s));
    if (dateRange !== '30d') params.set('range', dateRange);
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, selectedTypes, selectedSeverities, dateRange, setSearchParams]);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await dataProvider.getEvents({
          filter: {
            searchQuery: debouncedQuery,
            types: selectedTypes,
            severities: selectedSeverities,
            dateRange
          },
          sortBy,
          sortOrder,
          page,
          limit: pageSize
        });
        setEvents(res.events);
        setTotalCount(res.total);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [debouncedQuery, selectedTypes, selectedSeverities, dateRange, sortBy, sortOrder, page]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const toggleType = (t) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
    setPage(1);
  };

  const toggleSeverity = (s) => {
    setSelectedSeverities((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedSeverities([]);
    setDateRange('30d');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedTypes.length > 0 ||
    selectedSeverities.length > 0 ||
    dateRange !== '30d';

  const allTypes = ['person', 'vehicle', 'motion', 'restricted_area'];
  const allSeverities = ['critical', 'high', 'medium', 'low'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="AI Detection Events"
        description="Comprehensive audit log of classified surveillance detections with confidence metrics and event parameters."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[rgba(250,93,25,0.12)] border border-[#fa5d19]/30 text-[#fa5d19] flex items-center gap-1.5 font-bold">
            <ScanLine className="w-3.5 h-3.5" />
            AI TELEMETRY
          </span>
        }
      />

      {/* Filter and Search Panel */}
      <div className="p-4 rounded-xl border border-[#262626] bg-[#121212] space-y-3.5 shadow-md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by description, camera name, or ID..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#181818] border border-[#2d2d2d] text-xs text-white placeholder-[#666] focus:border-[#fa5d19] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-[#2d2d2d] self-start md:self-auto">
            <Calendar className="w-3.5 h-3.5 text-[#777] ml-2 mr-1" />
            {['today', '24h', '7d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setDateRange(r);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                  dateRange === r
                    ? 'bg-[#fa5d19] text-white font-bold'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#222]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[#777] mr-1">TYPE:</span>
            {allTypes.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-all border ${
                    active
                      ? 'bg-[rgba(250,93,25,0.2)] text-[#fa5d19] border-[#fa5d19]/50 font-semibold'
                      : 'bg-[#181818] text-[#888] border-[#2a2a2a] hover:text-white'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              );
            })}

            <span className="text-[11px] font-mono text-[#777] ml-2 mr-1">SEVERITY:</span>
            {allSeverities.map((sev) => {
              const active = selectedSeverities.includes(sev);
              return (
                <button
                  key={sev}
                  onClick={() => toggleSeverity(sev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono uppercase transition-all border ${
                    active
                      ? 'bg-[#222] text-white border-white/40 font-bold'
                      : 'bg-[#181818] text-[#777] border-[#2a2a2a] hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#888]">
              Showing <span className="font-bold text-white">{events.length}</span> of {totalCount} events
            </span>

            {hasActiveFilters && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={clearFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Events Presentation */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No Detection Events Found"
          description="No events match your current filter criteria or date range. Try broadening your search or resetting filters."
          actionLabel="Reset All Filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-[#262626] bg-[#121212] overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#242424] bg-[#171717] font-mono text-[11px] uppercase tracking-wider text-[#888]">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Camera Source</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Occurred At</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Confidence</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('severity')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Severity</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e] text-xs">
                {events.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelectedEvent(e)}
                    className="hover:bg-[#181818] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#fa5d19]">{e.id}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-white">
                        {e.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{e.cameraName || e.cameraId}</div>
                      <div className="font-mono text-[10px] text-[#777]">{e.cameraId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#aaa]">
                      {new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} •{' '}
                      {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#262626] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              e.confidence >= 0.8
                                ? 'bg-[#22c55e]'
                                : e.confidence >= 0.65
                                ? 'bg-[#fa5d19]'
                                : 'bg-[#666]'
                            }`}
                            style={{ width: `${e.confidence * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-white">
                          {(e.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={e.severity} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs text-[#fa5d19] group-hover:underline font-medium">
                        Inspect →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {events.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                className="p-4 rounded-xl border border-[#262626] bg-[#121212] space-y-2 active:bg-[#181818]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#fa5d19]">{e.id}</span>
                  <SeverityBadge severity={e.severity} size="sm" />
                </div>
                <p className="text-xs font-semibold text-white capitalize">
                  {e.type.replace('_', ' ')}
                </p>
                <p className="text-xs text-[#a0a0a0] leading-snug line-clamp-2">
                  {e.description}
                </p>
                <div className="pt-2 border-t border-[#1f1f1f] flex items-center justify-between text-[11px] font-mono text-[#777]">
                  <span>{e.cameraName || e.cameraId}</span>
                  <span>{(e.confidence * 100).toFixed(0)}% confidence</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-[#262626] bg-[#121212] text-xs font-mono">
            <span className="text-[#888]">
              Page <span className="font-bold text-white">{page}</span> of {totalPages}
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
