import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/context/ToastContext';
import { CameraProvider } from '@/context/CameraContext';
import { AlertProvider } from '@/context/AlertContext';
import { Layout } from '@/components/layout/Layout';
import { Flame } from 'lucide-react';

const OverviewPage = lazy(() => import('@/features/overview/OverviewPage').then(m => ({ default: m.OverviewPage })));
const LiveMonitoringPage = lazy(() => import('@/features/live/LiveMonitoringPage').then(m => ({ default: m.LiveMonitoringPage })));
const EventsPage = lazy(() => import('@/features/events/EventsPage').then(m => ({ default: m.EventsPage })));
const AnalyticsPage = lazy(() => import('@/features/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const CamerasPage = lazy(() => import('@/features/cameras/CamerasPage').then(m => ({ default: m.CamerasPage })));
const AlertsPage = lazy(() => import('@/features/alerts/AlertsPage').then(m => ({ default: m.AlertsPage })));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('@/features/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const RouteLoadingFallback = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-10 h-10 rounded-xl bg-[#fa5d19]/20 border border-[#fa5d19]/40 flex items-center justify-center text-[#fa5d19] animate-pulse">
      <Flame className="w-5 h-5" />
    </div>
    <span className="font-mono text-xs text-[#888] tracking-widest uppercase">
      Loading Telemetry Stream...
    </span>
  </div>
);

export const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CameraProvider>
          <AlertProvider>
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<OverviewPage />} />
                  <Route path="live" element={<LiveMonitoringPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="cameras" element={<CamerasPage />} />
                  <Route path="alerts" element={<AlertsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </AlertProvider>
        </CameraProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
