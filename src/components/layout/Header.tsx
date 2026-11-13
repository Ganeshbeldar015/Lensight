import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  Clock,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SeverityBadge } from '@/components/common/SeverityBadge';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { alerts, unreadAlertsCount, criticalAlertCount, markAlertAsRead, markAllAlertsAsRead, globalSearch, setGlobalSearch } = useApp();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const alertsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Live Clock (ticking every second)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setIsAlertsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive title from pathname
  const routeTitles: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Overview Dashboard', subtitle: 'Platform Operations & Intelligence' },
    '/overview': { title: 'Overview Dashboard', subtitle: 'Platform Operations & Intelligence' },
    '/monitoring': { title: 'Live Video Wall', subtitle: 'Real-time CCTV Feeds & Telemetry' },
    '/events': { title: 'AI Detection Events', subtitle: 'Computer Vision Event Log & Audit' },
    '/analytics': { title: 'Intelligence Analytics', subtitle: 'Temporal Trends & Pattern Analysis' },
    '/cameras': { title: 'Camera Management', subtitle: 'Hardware Inventory & Connectivity' },
    '/alerts': { title: 'Alert Command Center', subtitle: 'Critical Incident Dispatch & Acknowledgment' },
    '/settings': { title: 'System Settings', subtitle: 'Operational Preferences & Engine Config' },
  };

  const currentRoute = routeTitles[location.pathname] || {
    title: 'Lensight Platform',
    subtitle: 'AI Video Intelligence',
  };

  // Recent unread alerts for quick dropdown
  const recentAlerts = alerts.slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/events?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-[#151E2D] border-b border-[#374151] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937]"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#F9FAFB] tracking-tight uppercase font-mono">
              {currentRoute.title}
            </h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
              LIVE
            </span>
          </div>
          <p className="text-[11px] text-[#9CA3AF] truncate">{currentRoute.subtitle}</p>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-2 sm:mx-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search cameras, events, alerts (e.g. CAM-001, EVT-1002)..."
            className="w-full bg-[#111827] border border-[#374151] rounded-xl pl-9 pr-8 py-1.5 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#F9FAFB]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Right Controls: Clock, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#374151]/70 text-xs font-mono text-[#9CA3AF]">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {currentTime.toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </span>
          <span className="text-[#6B7280]">•</span>
          <span className="text-[#F9FAFB] font-semibold">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={alertsRef}>
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="relative p-2 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937] transition-colors"
            title="Incident Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span
                className={`absolute top-1 right-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ring-2 ring-[#151E2D] ${
                  criticalAlertCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-black'
                }`}
              >
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#374151] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#F9FAFB] tracking-wider uppercase font-mono">
                    Security Alerts
                  </h4>
                  <span className="text-[11px] text-[#9CA3AF]">
                    {unreadAlertsCount} unread • {criticalAlertCount} critical
                  </span>
                </div>
                {unreadAlertsCount > 0 && (
                  <button
                    onClick={() => markAllAlertsAsRead()}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#374151]/50">
                {recentAlerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#9CA3AF]">
                    No active alerts in queue
                  </div>
                ) : (
                  recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 hover:bg-[#263244]/60 transition-colors cursor-pointer ${
                        !alert.read ? 'bg-[#263244]/30' : ''
                      }`}
                      onClick={() => {
                        markAlertAsRead(alert.id);
                        navigate('/alerts');
                        setIsAlertsOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <SeverityBadge severity={alert.severity} size="sm" />
                        <span className="text-[10px] font-mono text-[#9CA3AF]">
                          {new Date(alert.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-[#F9FAFB] line-clamp-1">
                        {alert.title}
                      </h5>
                      <p className="text-[11px] text-[#9CA3AF] line-clamp-1 mt-0.5">
                        {alert.description}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-[#374151] bg-[#151E2D]/50 text-center">
                <Link
                  to="/alerts"
                  onClick={() => setIsAlertsOpen(false)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                >
                  Open Alert Command Center <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#1F2937] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              SO
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#F9FAFB] leading-none">
                Chief Watch Officer
              </span>
              <span className="text-[10px] text-emerald-400 font-mono leading-none mt-1">
                Security Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1F2937] border border-[#374151] rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#374151]">
                <p className="text-xs font-semibold text-[#F9FAFB]">Operations Lead</p>
                <p className="text-[11px] text-[#9CA3AF] font-mono">ops-lead@lensight.corp</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400">SESSION AUTHORIZED</span>
                </div>
              </div>
              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#263244]"
                >
                  Preferences & Thresholds
                </Link>
                <Link
                  to="/cameras"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#263244]"
                >
                  Device Fleet Management
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
