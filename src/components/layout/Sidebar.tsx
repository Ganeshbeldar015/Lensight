import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Activity,
  BarChart3,
  Camera as CameraIcon,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { unreadAlertsCount, criticalAlertCount, kpis } = useApp();

  const navItems = [
    { name: 'Overview', path: '/overview', icon: LayoutDashboard },
    { name: 'Live Monitoring', path: '/monitoring', icon: Video, badge: `${kpis.activeCameras} LIVE` },
    { name: 'Events', path: '/events', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Cameras', path: '/cameras', icon: CameraIcon, badge: `${kpis.totalCameras}` },
    {
      name: 'Alerts',
      path: '/alerts',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : undefined,
      badgeColor: criticalAlertCount > 0 ? 'bg-red-500 text-white' : 'bg-amber-500/20 text-amber-300',
    },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#151E2D] border-r border-[#374151]">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#374151]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="font-bold text-lg tracking-wider text-[#F9FAFB] uppercase font-mono">
                LENSIGHT
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold -mt-1">
                Video Intelligence
              </span>
            </div>
          )}
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937]/70 border border-transparent'
                } ${isCollapsed ? 'justify-center px-2' : ''}`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
              {!isCollapsed && (
                <span className="truncate flex-1 tracking-tight">{item.name}</span>
              )}

              {/* Badge */}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-[#263244] text-[#9CA3AF] border border-[#374151]'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1F2937] text-[#F9FAFB] text-xs rounded-md shadow-xl border border-[#374151] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.name}
                  {item.badge && <span className="ml-1.5 text-emerald-400">({item.badge})</span>}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Connectivity Status Indicator at Bottom */}
      <div className="p-3 border-t border-[#374151] bg-[#111827]/40">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-[#1F2937]/80 border border-[#374151]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-emerald-400 font-semibold tracking-wider text-[11px]">
                  SYSTEM ACTIVE
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#9CA3AF]">v2.4.0</span>
            </div>

            <div className="mt-2 pt-2 border-t border-[#374151]/50 grid grid-cols-2 gap-2 text-[10px] text-[#9CA3AF]">
              <div>
                <span className="text-[#6B7280] block">Telemetry</span>
                <span className="font-mono text-[#F9FAFB]">12ms / 60 FPS</span>
              </div>
              <div>
                <span className="text-[#6B7280] block">Mode</span>
                <span className="font-mono text-emerald-400">Local Engine</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="System Active - 12ms latency">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
