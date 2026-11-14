import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dataProvider } from '@/services/dataProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { EventTypeBadge } from '@/components/ui/EventTypeBadge';
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
  User,
  Car,
  Activity,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const parseUrlTypes = (params) => {
    return params.getAll('type')
      .flatMap(t => t.split(','))
      .map(t => {
        const lower = t.toLowerCase().trim();
        if (lower === 'person_detected' || lower === 'face_recognized' || lower === 'crowd_gathering' || lower === 'loitering_detected') return 'person';
        if (lower === 'vehicle_detected') return 'vehicle';
        if (lower === 'motion_detected') return 'motion';
        if (lower === 'intrusion_alert') return 'restricted_area';
        return lower;
      })
      .filter(t => ['person', 'vehicle', 'motion', 'restricted_area'].includes(t));
  };

  const parseUrlSeverities = (params) => {
    return params.getAll('severity')
      .flatMap(s => s.split(','))
      .map(s => s.toLowerCase().trim())
      .filter(s => ['critical', 'high', 'medium', 'low'].includes(s));
  };

  const initialSearch = searchParams.get('search') || '';
  const initialTypes = parseUrlTypes(searchParams);
  const initialSeverities = parseUrlSeverities(searchParams);
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
    if (dateRange && dateRange !== '30d') params.set('range', dateRange);
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
        setEvents(res.events || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch events', err);
        setEvents([]);
        setTotalCount(0);
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

  const toggleType = (typeId) => {
    if (typeId === 'all') {
      setSelectedTypes([]);
    } else {
      setSelectedTypes((prev) =>
        prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
      );
    }
    setPage(1);
  };

  const toggleSeverity = (sevId) => {
    if (sevId === 'all') {
      setSelectedSeverities([]);
    } else {
      setSelectedSeverities((prev) =>
        prev.includes(sevId) ? prev.filter((s) => s !== sevId) : [...prev, sevId]
      );
    }
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
    { id: 'person', label: 'Person', icon: User },
    { id: 'vehicle', label: 'Vehicle', icon: Car },
    { id: 'motion', label: 'Motion', icon: Activity },
    { id: 'restricted_area', label: 'Restricted Area', icon: ShieldAlert }
  ];

  const allSeverities = [
    { id: 'critical', label: 'Critical' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detection Events"
        description="Comprehensive audit log of classified surveillance detections with confidence metrics and event parameters."
      />

      {/* Filter and Search Panel */}
      <div className="p-4 rounded-xl border border-[#dce5e7] bg-white space-y-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8a9b9f] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, type (Person, Vehicle, Motion, Restricted Area), camera..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] text-xs text-[#263b40] placeholder-[#8a9b9f] focus:border-[#168a91] focus:ring-1 focus:ring-[#168a91] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a9b9f] hover:text-[#263b40] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#f0f6f6] p-1 rounded-lg border border-[#dce5e7] self-start md:self-auto">
            <Calendar className="w-3.5 h-3.5 text-[#61777c] ml-2 mr-1" />
            {['today', '24h', '7d', '30d', 'all'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setDateRange(r);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded text-xs uppercase font-medium transition-colors cursor-pointer ${
                  dateRange === r
                    ? 'bg-[#168a91] text-white font-semibold shadow-xs'
                    : 'text-[#61777c] hover:text-[#263b40]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#dce5e7]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase text-[#61777c] font-semibold mr-1">Event Type:</span>
            <button
              onClick={() => toggleType('all')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors border cursor-pointer ${
                selectedTypes.length === 0
                  ? 'bg-[#ddf1f1] text-[#168a91] border-[#168a91]/30 font-semibold'
                  : 'bg-[#f0f6f6] text-[#61777c] border-[#dce5e7] hover:text-[#263b40] hover:bg-[#e7f3f3] font-medium'
              }`}
            >
              All Types
            </button>
            {allTypes.map(({ id, label, icon: Icon }) => {
              const active = selectedTypes.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleType(id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors border cursor-pointer ${
                    active
                      ? 'bg-[#ddf1f1] text-[#168a91] border-[#168a91]/30 font-semibold'
                      : 'bg-[#f0f6f6] text-[#61777c] border-[#dce5e7] hover:text-[#263b40] hover:bg-[#e7f3f3] font-medium'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}

            <span className="text-xs uppercase text-[#61777c] font-semibold ml-2 mr-1">Severity:</span>
            <button
              onClick={() => toggleSeverity('all')}
              className={`px-2.5 py-1 rounded-md text-xs uppercase transition-colors border cursor-pointer ${
                selectedSeverities.length === 0
                  ? 'bg-[#263b40] text-white border-[#263b40] font-semibold'
                  : 'bg-[#f0f6f6] text-[#61777c] border-[#dce5e7] hover:text-[#263b40] hover:bg-[#e7f3f3] font-medium'
              }`}
            >
              All
            </button>
            {allSeverities.map(({ id, label }) => {
              const active = selectedSeverities.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleSeverity(id)}
                  className={`px-2.5 py-1 rounded-md text-xs uppercase transition-colors border cursor-pointer ${
                    active
                      ? 'bg-[#263b40] text-white border-[#263b40] font-semibold'
                      : 'bg-[#f0f6f6] text-[#61777c] border-[#dce5e7] hover:text-[#263b40] hover:bg-[#e7f3f3] font-medium'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#61777c]">
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
          <div className="hidden md:block rounded-xl border border-[#dce5e7] bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#dce5e7] bg-[#f0f6f6] text-xs uppercase tracking-wider text-[#61777c] font-semibold">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Camera Source</th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-[#263b40] transition-colors"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Occurred At</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-[#263b40] transition-colors"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Confidence</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-[#263b40] transition-colors"
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
              <tbody className="divide-y divide-[#dce5e7] text-xs">
                {events.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelectedEvent(e)}
                    className="hover:bg-[#f0f6f6] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-[#168a91]">{e.id}</td>
                    <td className="py-3 px-4">
                      <EventTypeBadge type={e.type} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#263b40] font-medium">{e.cameraName || e.cameraId}</div>
                      <div className="font-mono text-[11px] text-[#61777c]">{e.cameraId}</div>
                    </td>
                    <td className="py-3 px-4 text-[#61777c]">
                      <div className="text-[#263b40] font-medium">
                        {new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[11px] text-[#61777c] font-mono tabular-nums">
                        {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#dce5e7] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              e.confidence >= 0.8
                                ? 'bg-[#299b72]'
                                : e.confidence >= 0.65
                                ? 'bg-[#d69a38]'
                                : 'bg-[#8a9b9f]'
                            }`}
                            style={{ width: `${e.confidence * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#263b40]">
                          {(e.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={e.severity} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs text-[#168a91] group-hover:underline font-semibold flex items-center justify-end gap-1">
                        Inspect <ArrowRight className="w-3 h-3" />
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
                className="p-4 rounded-xl border border-[#dce5e7] bg-white space-y-2.5 shadow-xs active:bg-[#f0f6f6] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#168a91]">{e.id}</span>
                  <SeverityBadge severity={e.severity} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <EventTypeBadge type={e.type} size="sm" />
                  <span className="text-xs font-medium text-[#263b40] truncate">
                    {e.cameraName || e.cameraId}
                  </span>
                </div>
                <p className="text-xs text-[#61777c] leading-snug line-clamp-2">
                  {e.description}
                </p>
                <div className="pt-2 border-t border-[#dce5e7] flex items-center justify-between text-[11px] text-[#61777c]">
                  <span>
                    {new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} &bull; {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="font-semibold text-[#263b40]">
                    {(e.confidence * 100).toFixed(0)}% conf
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#dce5e7] bg-white text-xs shadow-xs">
            <span className="text-[#61777c]">
              Page <span className="font-semibold text-[#263b40]">{page}</span> of {totalPages}
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
