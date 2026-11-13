import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '@/context/AlertContext';
import { 
  Bell, 
  Search, 
  Menu, 
  Database, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const Header = ({ onToggleSidebar, onOpenSearch }) => {
  const navigate = useNavigate();
  const { alerts, unreadCount, acknowledgeAlert } = useAlerts();
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setCurrentTime(`${dateStr} • ${timeStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.acknowledged).slice(0, 5);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left side: Hamburger (mobile/tablet) + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fa5d19] to-[#ea580c] flex items-center justify-center text-white shadow-heat-glow group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-white/20" />
          </div>
          <div className="hidden sm:block">
            <div className="text-base font-bold tracking-wider text-slate-900 flex items-center gap-1.5">
              <span>LENSIGHT</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-50 border border-orange-200 text-[#fa5d19] font-semibold">
                AI-OPS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5 font-medium">
              INTELLIGENCE PLATFORM
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Global Search bar trigger */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all text-xs group cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-[#fa5d19] transition-colors" />
            <span>Search cameras, detections, alerts...</span>
          </span>
          <kbd className="hidden lg:inline-flex items-center gap-1 font-mono text-[10px] bg-white border border-slate-300 px-1.5 py-0.5 rounded text-slate-600 shadow-2xs font-medium">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right side: Live Clock, Demo Data Pill, Notifications & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Live Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs text-slate-700">
          <Clock className="w-3.5 h-3.5 text-[#fa5d19]" />
          <span>{currentTime}</span>
        </div>

        {/* Permanent Honesty Rule: Demo Data Pill */}
        <div 
          title="Demo Data: Running in frontend-simulated mode. No actual video telemetry is streamed to external AI models."
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#fa5d19] font-mono text-[11px] font-bold"
        >
          <Database className="w-3 h-3 animate-pulse" />
          <span>DEMO DATA</span>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fa5d19] cursor-pointer"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">Alert Notifications</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-50 text-red-700 border border-red-200 font-bold">
                    {unreadCount} unread
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                  className="text-[11px] text-[#fa5d19] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  View All <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {unreadAlerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                  All security alerts acknowledged.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {unreadAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/90 border border-slate-200 transition-all flex flex-col gap-1 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          a.severity === 'critical' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}>
                          {a.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-900 font-medium leading-tight">{a.title}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500 truncate">{a.cameraName || a.cameraId}</span>
                        <button
                          onClick={() => acknowledgeAlert(a.id)}
                          className="text-[10px] font-semibold text-[#fa5d19] hover:text-[#ea580c] transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 select-none">
            OP
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Operator 01</p>
            <p className="text-[10px] text-slate-500 font-mono">SecOps Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
