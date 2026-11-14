import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCameras } from '@/context/CameraContext';
import { useAlerts } from '@/context/AlertContext';
import rawEvents from '@/data/events.json';
import { Search, Camera, Bell, Activity, X, ArrowRight } from 'lucide-react';

export const OmniSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { cameras } = useCameras();
  const { alerts } = useAlerts();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedCameras = q
    ? cameras.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchedAlerts = q
    ? alerts.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchedEvents = q
    ? rawEvents.filter(e => e.description.toLowerCase().includes(q) || e.type.toLowerCase().includes(q) || e.cameraId.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const hasResults = matchedCameras.length > 0 || matchedAlerts.length > 0 || matchedEvents.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-3 sm:px-4 bg-[#263b40]/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-[#dce5e7] bg-white shadow-xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#dce5e7] gap-3">
          <Search className="w-5 h-5 text-[#168a91] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all cameras, events, alerts..."
            className="flex-1 bg-transparent text-sm text-[#263b40] placeholder-[#8a9b9f] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#8a9b9f] hover:text-[#263b40] cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[11px] bg-[#f0f6f6] border border-[#dce5e7] px-2 py-0.5 rounded text-[#61777c] font-medium">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!q ? (
            <div className="py-8 text-center text-xs text-[#61777c]">
              Type a camera name (e.g. &ldquo;Entrance&rdquo;), event type (e.g. &ldquo;Restricted&rdquo;), or alert ID...
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-[#61777c]">
              No matches found for &ldquo;<span className="text-[#263b40] font-semibold">{query}</span>&rdquo;.
            </div>
          ) : (
            <>
              {/* Cameras */}
              {matchedCameras.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-[#168a91] mb-2 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Cameras ({matchedCameras.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedCameras.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onClose();
                          navigate('/cameras');
                        }}
                        className="w-full p-2.5 rounded-lg bg-[#f0f6f6] hover:bg-[#e7f3f3] border border-[#dce5e7] flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[#263b40] flex items-center gap-2">
                            <span>{c.name}</span>
                            <span className="text-[11px] text-[#61777c] font-mono">{c.id}</span>
                          </div>
                          <p className="text-[11px] text-[#61777c]">{c.location}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8a9b9f]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts */}
              {matchedAlerts.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-[#d95757] mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Alerts ({matchedAlerts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedAlerts.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          onClose();
                          navigate('/alerts');
                        }}
                        className="w-full p-2.5 rounded-lg bg-[#f0f6f6] hover:bg-[#e7f3f3] border border-[#dce5e7] flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[#263b40] flex items-center gap-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                              a.severity === 'critical' ? 'bg-[#fdf0f0] text-[#d95757] border border-[#d95757]/20' : 'bg-[#fdf6ea] text-[#d69a38] border border-[#d69a38]/20'
                            }`}>
                              {a.severity}
                            </span>
                            <span>{a.title}</span>
                          </div>
                          <p className="text-[11px] text-[#61777c] line-clamp-1">{a.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8a9b9f]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {matchedEvents.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-[#168a91] mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Events ({matchedEvents.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => {
                          onClose();
                          navigate(`/events?search=${encodeURIComponent(e.id)}`);
                        }}
                        className="w-full p-2.5 rounded-lg bg-[#f0f6f6] hover:bg-[#e7f3f3] border border-[#dce5e7] flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[#263b40] flex items-center gap-2">
                            <span className="text-[11px] text-[#168a91] font-mono font-medium">{e.id}</span>
                            <span className="capitalize">{e.type.replace('_', ' ')}</span>
                            <span className="text-[11px] text-[#61777c]">({(e.confidence * 100).toFixed(0)}% conf)</span>
                          </div>
                          <p className="text-[11px] text-[#61777c] line-clamp-1">{e.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8a9b9f]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
