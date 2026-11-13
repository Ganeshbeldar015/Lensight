import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCameras } from '@/context/CameraContext';
import { useAlerts } from '@/context/AlertContext';
import rawEvents from '@/data/events.json';
import { Search, Camera, ShieldAlert, ScanLine, X, ArrowRight } from 'lucide-react';

interface OmniSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OmniSearchModal: React.FC<OmniSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Global keydown handler for Escape & Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Search results
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-[#333] bg-[#141414] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#262626] gap-3">
          <Search className="w-5 h-5 text-[#fa5d19] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all cameras, detection events, alerts..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#666] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#888] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="font-mono text-[10px] bg-[#222] border border-[#333] px-2 py-0.5 rounded text-[#888]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!q ? (
            <div className="py-8 text-center text-xs text-[#777]">
              Type a camera name (e.g. &ldquo;Entrance&rdquo;), event type (e.g. &ldquo;Restricted&rdquo;), or alert ID...
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-[#777]">
              No matches found for &ldquo;<span className="text-white">{query}</span>&rdquo;.
            </div>
          ) : (
            <>
              {/* Cameras */}
              {matchedCameras.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#fa5d19] mb-2 flex items-center gap-1.5">
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
                        className="w-full p-2.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] border border-[#2a2a2a] flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-white flex items-center gap-2">
                            <span>{c.name}</span>
                            <span className="font-mono text-[10px] text-[#888]">{c.id}</span>
                          </div>
                          <p className="text-[11px] text-[#777]">{c.location}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#555]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts */}
              {matchedAlerts.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#eb3424] mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
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
                        className="w-full p-2.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] border border-[#2a2a2a] flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-white flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                              a.severity === 'critical' ? 'bg-red-950 text-red-400' : 'bg-orange-950 text-orange-400'
                            }`}>
                              {a.severity}
                            </span>
                            <span>{a.title}</span>
                          </div>
                          <p className="text-[11px] text-[#777] line-clamp-1">{a.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#555]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Detections */}
              {matchedEvents.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#2a6dfb] mb-2 flex items-center gap-1.5">
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Detection Events ({matchedEvents.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchedEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => {
                          onClose();
                          navigate(`/events?search=${encodeURIComponent(e.id)}`);
                        }}
                        className="w-full p-2.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] border border-[#2a2a2a] flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-white flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#fa5d19]">{e.id}</span>
                            <span className="capitalize">{e.type.replace('_', ' ')}</span>
                            <span className="text-[10px] text-[#888]">({(e.confidence * 100).toFixed(0)}% conf)</span>
                          </div>
                          <p className="text-[11px] text-[#777] line-clamp-1">{e.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#555]" />
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
