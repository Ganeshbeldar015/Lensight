import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Overview } from '@/pages/Overview';
import { LiveMonitoring } from '@/pages/LiveMonitoring';
import { Events } from '@/pages/Events';
import { Analytics } from '@/pages/Analytics';
import { Cameras } from '@/pages/Cameras';
import { Alerts } from '@/pages/Alerts';
import { Settings } from '@/pages/Settings';
import './App.css';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="monitoring" element={<LiveMonitoring />} />
            <Route path="events" element={<Events />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="cameras" element={<Cameras />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="settings" element={<Settings />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
