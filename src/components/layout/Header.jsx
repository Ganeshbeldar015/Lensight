import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlerts } from '@/context/AlertContext';
import { 
  Bell, 
  Search, 
  Menu, 
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

export const Header = ({ onToggleSidebar, onOpenSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/live':
        return { section: 'Monitoring', title: 'Live Feeds' };
      case '/events':
        return { section: 'Audit', title: 'Events' };
      case '/analytics':
        return { section: 'Insights', title: 'Analytics' };
      case '/cameras':
        return { section: 'Infrastructure', title: 'Cameras' };
      case '/alerts':
        return { section: 'Security', title: 'Alerts' };
      case '/settings':
        return { section: 'Preferences', title: 'Settings' };
      default:
        return { section: 'Dashboard', title: 'Overview' };
    }
  };

  const pageInfo = getPageInfo();
  const unreadAlerts = alerts.filter(a => !a.acknowledged).slice(0, 5);

  return (
    <header className="h-16 border-b border-[#dce5e7] bg-white sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left side: Hamburger (mobile/tablet) + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#61777c] hover:text-[#263b40] hover:bg-[#f0f6f6] transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <span className="text-[#8a9b9f] font-medium hidden sm:inline">{pageInfo.section}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8a9b9f] hidden sm:inline" />
          <span className="text-sm font-semibold text-[#263b40] tracking-tight">{pageInfo.title}</span>
        </nav>
      </div>

      {/* Middle: Global Search bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#f0f6f6] hover:bg-[#e7f3f3] border border-[#dce5e7] text-[#61777c] hover:text-[#263b40] transition-all text-xs group cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#8a9b9f] group-hover:text-[#168a91] transition-colors" />
            <span>Search cameras, events, alerts...</span>
          </span>
          <kbd className="hidden lg:inline-flex items-center gap-1 font-sans text-[11px] bg-white border border-[#dce5e7] px-1.5 py-0.5 rounded text-[#61777c] font-medium shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right side: Live Clock, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock */}
        <div className="hidden xl:inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] text-xs text-[#61777c] font-medium select-none">
          <Clock className="w-3.5 h-3.5 text-[#168a91]" />
          <span>{currentTime}</span>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[#61777c] hover:text-[#263b40] hover:bg-[#f0f6f6] transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[#61777c] hover:text-[#263b40] hover:bg-[#f0f6f6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168a91] cursor-pointer"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#d95757] text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs pointer-events-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Menu */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#dce5e7] bg-white shadow-lg z-50 p-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#dce5e7]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#263b40]">Alert Notifications</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#fdf0f0] text-[#d95757] border border-[#d95757]/20 font-semibold">
                    {unreadCount} unread
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                  className="text-xs text-[#168a91] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  View All <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {unreadAlerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#61777c]">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-[#299b72]" />
                  All security alerts acknowledged.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {unreadAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-lg bg-[#f0f6f6] hover:bg-[#e7f3f3] border border-[#dce5e7] transition-colors flex flex-col gap-1 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                          a.severity === 'critical' 
                            ? 'bg-[#fdf0f0] text-[#d95757] border border-[#d95757]/20' 
                            : 'bg-[#fdf6ea] text-[#d69a38] border border-[#d69a38]/20'
                        }`}>
                          {a.severity}
                        </span>
                        <span className="text-[10px] text-[#8a9b9f]">
                          {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#263b40] font-medium leading-tight">{a.title}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#61777c] truncate">{a.cameraName || a.cameraId}</span>
                        <button
                          onClick={() => acknowledgeAlert(a.id)}
                          className="text-xs font-semibold text-[#168a91] hover:text-[#11747a] transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#dce5e7] cursor-pointer group select-none">
          <div className="w-8 h-8 rounded-full bg-[#ddf1f1] border border-[#168a91]/25 flex items-center justify-center text-xs font-bold text-[#168a91] group-hover:border-[#168a91] transition-colors shadow-2xs">
            OP
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-[#263b40] leading-tight group-hover:text-[#168a91] transition-colors">Operator 01</p>
            <p className="text-[10px] text-[#61777c] font-medium">SecOps Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
