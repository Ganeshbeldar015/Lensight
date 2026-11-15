import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlerts } from '@/context/AlertContext';
import { useToast } from '@/context/ToastContext';
import { 
  Bell, 
  Search, 
  Menu, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  User,
  Settings,
  Shield,
  Lock
} from 'lucide-react';

export const Header = ({ onToggleSidebar, onOpenSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { alerts, unreadCount, acknowledgeAlert } = useAlerts();
  const { showToast } = useToast();
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dutyStatus, setDutyStatus] = useState('active');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
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

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs min-w-0">
          <span className="text-[#8a9b9f] font-medium hidden sm:inline">{pageInfo.section}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8a9b9f] hidden sm:inline" />
          <span className="text-sm font-semibold text-[#263b40] tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">{pageInfo.title}</span>
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
        {/* Live Clock Capsule */}
        <div className="hidden sm:inline-flex items-center gap-2 h-8 px-3 rounded-full bg-[#f0f6f6] border border-[#dce5e7] text-xs select-none shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-[#168a91] shrink-0" />
          <span className="text-[#61777c] font-medium">{dateStr}</span>
          <span className="text-[#8a9b9f]">&bull;</span>
          <span className="font-mono font-semibold text-[#263b40] tabular-nums tracking-wide">{timeStr}</span>
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
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
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
              <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full mt-1.5 sm:mt-2 sm:w-96 rounded-xl border border-[#dce5e7] bg-white shadow-xl z-50 p-3 animate-in fade-in duration-150">
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

        {/* Profile Avatar & Interactive Dropdown */}
        <div className="relative pl-3 border-l border-[#dce5e7]">
          <button
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="relative w-8 h-8 rounded-full bg-[#ddf1f1] border border-[#168a91]/30 hover:border-[#168a91] flex items-center justify-center text-[#168a91] hover:bg-[#168a91] hover:text-white transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168a91]"
            title="Operator 01 (SecOps Lead) - Profile & Session"
            aria-label="User Profile and Session Menu"
            aria-expanded={showProfileMenu}
          >
            <User className="w-4 h-4" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                dutyStatus === 'active' ? 'bg-[#299b72]' : 'bg-[#d69a38]'
              }`}
              title={`Status: ${dutyStatus === 'active' ? 'Active Surveillance' : 'Standby / Break'}`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
                aria-hidden="true"
              />
              <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full mt-1.5 sm:mt-2 sm:w-80 rounded-xl border border-[#dce5e7] bg-white shadow-xl z-50 p-3.5 animate-in fade-in duration-150 text-left">
                {/* User Identity Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#dce5e7]">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#ddf1f1] border border-[#168a91]/30 flex items-center justify-center text-[#168a91]">
                      <User className="w-5 h-5" />
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                        dutyStatus === 'active' ? 'bg-[#299b72]' : 'bg-[#d69a38]'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-semibold text-[#263b40] truncate">Operator 01</p>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#ddf1f1] text-[#168a91] border border-[#168a91]/20 shrink-0">
                        SOC TIER 3
                      </span>
                    </div>
                    <p className="text-xs text-[#61777c] font-medium truncate">SecOps Surveillance Lead</p>
                    <p className="text-[11px] font-mono text-[#8a9b9f] truncate">op01@lensight.internal</p>
                  </div>
                </div>

                {/* Duty Status Selector */}
                <div className="py-2.5 border-b border-[#dce5e7]">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#8a9b9f] block mb-1.5">
                    Surveillance Duty Status
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDutyStatus('active');
                        showToast({
                          type: 'success',
                          title: 'Status: Active Surveillance',
                          message: 'Operator status set to Active. Real-time incident telemetry enabled.'
                        });
                      }}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        dutyStatus === 'active'
                          ? 'bg-[#ddf1f1] text-[#168a91] font-semibold border border-[#168a91]/40 shadow-xs'
                          : 'bg-[#f0f6f6] text-[#61777c] hover:bg-[#e7f3f3] border border-transparent'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#299b72] shrink-0" />
                      <span>Active</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDutyStatus('standby');
                        showToast({
                          type: 'info',
                          title: 'Status: Standby',
                          message: 'Operator status set to Standby / Break mode.'
                        });
                      }}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        dutyStatus === 'standby'
                          ? 'bg-[#fdf6ea] text-[#d69a38] font-semibold border border-[#d69a38]/40 shadow-xs'
                          : 'bg-[#f0f6f6] text-[#61777c] hover:bg-[#e7f3f3] border border-transparent'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#d69a38] shrink-0" />
                      <span>Standby</span>
                    </button>
                  </div>
                </div>

                {/* Workstation & Clearance Meta */}
                <div className="py-2.5 border-b border-[#dce5e7] grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-[#f0f6f6] border border-[#dce5e7]">
                    <span className="text-[#8a9b9f] block text-[10px]">Workstation</span>
                    <span className="font-semibold text-[#263b40]">Console Alpha #4</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#f0f6f6] border border-[#dce5e7]">
                    <span className="text-[#8a9b9f] block text-[10px]">Access Level</span>
                    <span className="font-semibold text-[#168a91]">L4 Critical Ops</span>
                  </div>
                </div>

                {/* Quick Navigation Items */}
                <div className="py-2 space-y-0.5 border-b border-[#dce5e7]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#263b40] hover:bg-[#f0f6f6] transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-[#8a9b9f] group-hover:text-[#168a91] transition-colors" />
                      <span>System Settings & Preferences</span>
                    </span>
                    <span className="text-[10px] text-[#8a9b9f] font-mono">/settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/events');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#263b40] hover:bg-[#f0f6f6] transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#8a9b9f] group-hover:text-[#168a91] transition-colors" />
                      <span>Detection Audit Logs</span>
                    </span>
                    <span className="text-[10px] text-[#8a9b9f] font-mono">/events</span>
                  </button>
                </div>

                {/* Lock Console / Sign Out */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      showToast({
                        type: 'warning',
                        title: 'Console Locked',
                        message: 'Terminal session suspended for Operator 01. Surveillance continues in background.'
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#d95757] hover:bg-[#fdf0f0] border border-transparent hover:border-[#d95757]/20 transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Surveillance Console</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
