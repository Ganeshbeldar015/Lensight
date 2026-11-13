import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAlerts } from '@/context/AlertContext';
import { 
  LayoutDashboard, 
  Video, 
  ScanLine, 
  BarChart3, 
  Camera, 
  ShieldAlert, 
  Settings, 
  X, 
  ChevronRight, 
  Flame 
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { unreadCount, criticalCount } = useAlerts();

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/live', label: 'Live Monitoring', icon: Video },
    { to: '/events', label: 'Detection Events', icon: ScanLine },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/cameras', label: 'Cameras', icon: Camera },
    { 
      to: '/alerts', 
      label: 'Alert Center', 
      icon: ShieldAlert,
      badge: unreadCount > 0 ? unreadCount : undefined,
      isCritical: criticalCount > 0
    },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with Close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#fa5d19] flex items-center justify-center text-white shadow-heat-glow">
              <Flame className="w-4 h-4 fill-white/20" />
            </div>
            <span className="font-bold text-sm tracking-wider text-slate-900">LENSIGHT</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold">
            WORKSPACE
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/80 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#fa5d19]' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          item.isCritical
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#fa5d19]" />}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono text-slate-500 font-medium">SYSTEM HEALTH</span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                OPTIMAL
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[96%]" />
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-1.5">
              Telemetry Stream: Synced
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
