import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAlerts } from '@/context/AlertContext';
import { 
  LayoutDashboard, 
  Video, 
  Activity, 
  BarChart3, 
  Camera, 
  Bell, 
  Settings, 
  X, 
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { unreadCount, criticalCount } = useAlerts();

  const mainNavItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/live', label: 'Live Monitoring', icon: Video },
    { to: '/events', label: 'Events', icon: Activity },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/cameras', label: 'Cameras', icon: Camera },
    { 
      to: '/alerts', 
      label: 'Alerts', 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      isCritical: criticalCount > 0
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#263b40]/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#dce5e7] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#dce5e7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ddf1f1] text-[#168a91] flex items-center justify-center border border-[#168a91]/20 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#168a91]" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-[#263b40]">
                Lensight
              </div>
              <p className="text-[11px] text-[#61777c] font-medium leading-none">
                Video Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8a9b9f] hover:text-[#263b40] hover:bg-[#f0f6f6] lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-[#8a9b9f]">
              Main Navigation
            </div>

            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose()}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-colors group ${
                      isActive
                        ? 'bg-[#ddf1f1] text-[#168a91] font-semibold'
                        : 'text-[#61777c] hover:text-[#263b40] hover:bg-[#f0f6f6] font-medium'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#168a91]' : 'text-[#8a9b9f] group-hover:text-[#61777c]'
                        }`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.isCritical
                            ? 'bg-[#d95757] text-white'
                            : 'bg-[#ddf1f1] text-[#168a91] border border-[#168a91]/20'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Separated Settings & System Status Section */}
          <div className="pt-4 border-t border-[#dce5e7] space-y-3">
            <div className="space-y-1">
              <NavLink
                to="/settings"
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-colors group ${
                    isActive
                      ? 'bg-[#ddf1f1] text-[#168a91] font-semibold'
                      : 'text-[#61777c] hover:text-[#263b40] hover:bg-[#f0f6f6] font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3">
                    <Settings className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#168a91]' : 'text-[#8a9b9f] group-hover:text-[#61777c]'
                    }`} />
                    <span>Settings</span>
                  </div>
                )}
              </NavLink>
            </div>

            {/* Health Status Indicator */}
            <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#61777c] font-medium">System Status</span>
                <span className="flex items-center gap-1.5 font-semibold text-[#299b72]">
                  <span className="w-2 h-2 rounded-full bg-[#299b72] animate-pulse" />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
