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

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const toggleSeverity = (sev) => {
    setSelectedSeverities((prev) =>
      prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]
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

  const allTypes = [
    'motion_detected',
    'person_detected',
    'vehicle_detected',
    'face_recognized',
    'crowd_gathering',
    'intrusion_alert',
    'loitering_detected'
  ];

  const allSeverities = ['critical', 'high', 'medium', 'low'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="AI Detection Events"
        description="Comprehensive audit log of classified surveillance detections with confidence metrics and event parameters."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#fa5d19] flex items-center gap-1.5 font-bold">
            <ScanLine className="w-3.5 h-3.5" />
            AI TELEMETRY
          </span>
        }
      />

      {/* Filter and Search Panel */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by description, camera name, or ID..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:border-[#fa5d19] focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
            {['today', '24h', '7d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setDateRange(r);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
                  dateRange === r
                    ? 'bg-[#fa5d19] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 font-semibold mr-1">TYPE:</span>
            {allTypes.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-all border cursor-pointer ${
                    active
                      ? 'bg-orange-50 text-[#fa5d19] border-orange-300 font-semibold shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              );
            })}

            <span className="text-[11px] font-mono text-slate-400 font-semibold ml-2 mr-1">SEVERITY:</span>
            {allSeverities.map((sev) => {
              const active = selectedSeverities.includes(sev);
              return (
                <button
                  key={sev}
                  onClick={() => toggleSeverity(sev)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono uppercase transition-all border cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-500">
              {totalCount} results
            </span>
            {(searchQuery || selectedTypes.length > 0 || selectedSeverities.length > 0) && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={clearFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset
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
          <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Camera Source</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Occurred At</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Confidence</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
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
              <tbody className="divide-y divide-slate-100 text-xs">
                {events.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelectedEvent(e)}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#fa5d19]">{e.id}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-semibold text-slate-900">
                        {e.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-medium">{e.cameraName || e.cameraId}</div>
                      <div className="font-mono text-[10px] text-slate-400">{e.cameraId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} •{' '}
                      {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              e.confidence >= 0.8
                                ? 'bg-emerald-500'
                                : e.confidence >= 0.65
                                ? 'bg-[#fa5d19]'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${e.confidence * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {(e.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={e.severity} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs text-[#fa5d19] group-hover:underline font-semibold">
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
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs active:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#fa5d19]">{e.id}</span>
                  <SeverityBadge severity={e.severity} size="sm" />
                </div>
                <p className="text-xs font-semibold text-slate-900 capitalize">
                  {e.type.replace('_', ' ')}
                </p>
                <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                  {e.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{e.cameraName || e.cameraId}</span>
                  <span>{(e.confidence * 100).toFixed(0)}% confidence</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-mono shadow-xs">
            <span className="text-slate-500">
              Page <span className="font-bold text-slate-900">{page}</span> of {totalPages}
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
