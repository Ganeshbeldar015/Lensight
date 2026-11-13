import React, { useState } from 'react';
import type { DetectionEvent } from '@/types';
import { EventTypeBadge } from '@/components/common/EventTypeBadge';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface EventTableProps {
  events: DetectionEvent[];
  onSelectEvent: (event: DetectionEvent) => void;
  onResetFilters?: () => void;
}

export const EventTable: React.FC<EventTableProps> = ({
  events,
  onSelectEvent,
  onResetFilters,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  if (events.length === 0) {
    return (
      <EmptyState
        title="No Detection Events Found"
        description="No events match your current filter criteria. Try adjusting the search query, camera selection, or date range."
        actionLabel="Reset Filters"
        onAction={onResetFilters}
      />
    );
  }

  const totalPages = Math.ceil(events.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEvents = events.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="rounded-2xl border border-[#374151] overflow-hidden bg-[#1F2937]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#374151] bg-[#151E2D] text-[#9CA3AF] uppercase font-mono tracking-wider text-[11px]">
              <th className="py-3 px-4 font-semibold">Event ID</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold">Camera Source</th>
              <th className="py-3 px-4 font-semibold">Date & Time</th>
              <th className="py-3 px-4 font-semibold">Confidence</th>
              <th className="py-3 px-4 font-semibold">Severity</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#374151]/50 text-[#F9FAFB]">
            {paginatedEvents.map((evt) => {
              const confPercent = Math.round(evt.confidence * 100);
              const eventDate = new Date(evt.timestamp);

              return (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="hover:bg-[#263244]/60 transition-colors cursor-pointer group"
                >
                  {/* Event ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {evt.id}
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <EventTypeBadge type={evt.type} size="sm" />
                  </td>

                  {/* Camera */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-[#F9FAFB]">{evt.cameraName || evt.cameraId}</div>
                    <div className="text-[10px] font-mono text-[#9CA3AF]">{evt.cameraId}</div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[#9CA3AF]">
                    <div className="text-[#F9FAFB]">
                      {eventDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                      })}
                    </div>
                    <div className="text-[10px] text-[#6B7280]">
                      {eventDate.toLocaleTimeString('en-US', { hour12: false })}
                    </div>
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-1.5 overflow-hidden border border-[#374151]">
                        <div
                          className={`h-full rounded-full ${
                            confPercent >= 90
                              ? 'bg-emerald-400'
                              : confPercent >= 80
                              ? 'bg-amber-400'
                              : 'bg-blue-400'
                          }`}
                          style={{ width: `${confPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-[#F9FAFB]">
                        {confPercent}%
                      </span>
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <SeverityBadge severity={evt.severity} size="sm" />
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 max-w-xs truncate text-[#9CA3AF]">
                    {evt.description}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#263244] border border-[#374151] text-[#9CA3AF] group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-[#151E2D] border-t border-[#374151] flex items-center justify-between text-xs text-[#9CA3AF]">
          <span className="font-mono">
            Showing <strong className="text-[#F9FAFB]">{startIndex + 1}</strong> to{' '}
            <strong className="text-[#F9FAFB]">
              {Math.min(startIndex + pageSize, events.length)}
            </strong>{' '}
            of <strong className="text-[#F9FAFB]">{events.length}</strong> events
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#1F2937] border border-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono text-[11px] text-[#F9FAFB] bg-[#111827] rounded-lg border border-[#374151]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#1F2937] border border-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
