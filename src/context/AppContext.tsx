import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Camera, DetectionEvent, Alert, OverviewKpis, ToastMessage } from '@/types';
import { INITIAL_CAMERAS } from '@/data/cameras';
import { ALL_INITIAL_EVENTS, INITIAL_TODAY_EVENTS } from '@/data/events';
import { INITIAL_ALERTS } from '@/data/alerts';
import { isSupabaseConfigured, subscribeToCameraUpdates, subscribeToLiveAlerts, subscribeToLiveEvents } from '@/services/supabase';

interface AppContextType {
  cameras: Camera[];
  events: DetectionEvent[];
  alerts: Alert[];
  kpis: OverviewKpis;
  unreadAlertsCount: number;
  criticalAlertCount: number;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  dismissToast: (id: string) => void;
  // Camera CRUD
  addCamera: (camera: Omit<Camera, 'lastSeen'>) => void;
  updateCamera: (id: string, updates: Partial<Camera>) => void;
  deleteCamera: (id: string) => void;
  // Alert actions
  markAlertAsRead: (id: string) => void;
  markAlertAsUnread: (id: string) => void;
  markAllAlertsAsRead: () => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAllAlerts: () => void;
  // Simulation & reset
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  resetToDefaults: () => void;
  // Quick navigation / filter helpers
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CAMERAS: 'lensight_cameras_v1',
  ALERTS: 'lensight_alerts_v1',
  SIMULATION: 'lensight_simulation_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Cameras state with localStorage persistence
  const [cameras, setCameras] = useState<Camera[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMERAS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CAMERAS;
  });

  // 2. Events state
  const [events, setEvents] = useState<DetectionEvent[]>(ALL_INITIAL_EVENTS);

  // 3. Alerts state with localStorage persistence
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_ALERTS;
  });

  // 4. Global search query for quick header search
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // 5. Toast system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 6. Simulation toggle
  const [isSimulating, setIsSimulating] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIMULATION);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Persist cameras
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMERAS, JSON.stringify(cameras));
    } catch (e) {
      console.warn('Failed to save cameras to localStorage', e);
    }
  }, [cameras]);

  // Persist alerts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.warn('Failed to save alerts to localStorage', e);
    }
  }, [alerts]);

  // Persist simulation
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIMULATION, JSON.stringify(isSimulating));
    } catch (e) {
      console.warn('Failed to save simulation preference', e);
    }
  }, [isSimulating]);

  // Toast dispatchers
  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type, title, durationMs: 4000 }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Supabase Realtime Setup (only if configured and not mock)
  useEffect(() => {
    const useMock = import.meta.env.VITE_USE_MOCK !== 'false';
    if (!useMock && isSupabaseConfigured) {
      const subAlerts = subscribeToLiveAlerts((newAlert) => {
        setAlerts((prev) => [newAlert, ...prev]);
        showToast(newAlert.title, newAlert.severity === 'critical' ? 'error' : 'warning', 'New Security Alert');
      });

      const subCameras = subscribeToCameraUpdates((updatedCam) => {
        setCameras((prev) => prev.map((c) => (c.id === updatedCam.id ? updatedCam : c)));
      });

      const subEvents = subscribeToLiveEvents((newEvent) => {
        setEvents((prev) => [newEvent, ...prev]);
      });

      return () => {
        subAlerts?.unsubscribe();
        subCameras?.unsubscribe();
        subEvents?.unsubscribe();
      };
    }
  }, [showToast]);

  // Periodic AI simulation: Generates a realistic detection event every 60s
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const onlineCams = cameras.filter((c) => c.status === 'online');
      if (onlineCams.length === 0) return;

      const randomCam = onlineCams[Math.floor(Math.random() * onlineCams.length)];
      const types: DetectionEvent['type'][] = ['person', 'vehicle', 'motion'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const conf = parseFloat((0.82 + Math.random() * 0.16).toFixed(2));
      const evtId = `EVT-${Date.now().toString().slice(-4)}`;

      const newEvt: DetectionEvent = {
        id: evtId,
        type: randomType,
        cameraId: randomCam.id,
        cameraName: randomCam.name,
        timestamp: new Date().toISOString(),
        confidence: conf,
        severity: 'low',
        description: `Live simulated telemetry: ${randomType} detected with ${(conf * 100).toFixed(0)}% confidence at ${randomCam.name}.`,
        boundingBoxes: [
          {
            x: 25 + Math.floor(Math.random() * 40),
            y: 30 + Math.floor(Math.random() * 30),
            width: 20 + Math.floor(Math.random() * 15),
            height: 35 + Math.floor(Math.random() * 20),
            label: `${randomType.toUpperCase()} ${(conf * 100).toFixed(0)}%`,
          },
        ],
      };

      setEvents((prev) => [newEvt, ...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, [isSimulating, cameras]);

  // Camera Actions
  const addCamera = useCallback((camData: Omit<Camera, 'lastSeen'>) => {
    const newCamera: Camera = {
      ...camData,
      lastSeen: new Date().toISOString(),
    };
    setCameras((prev) => [newCamera, ...prev]);
    showToast(`Camera ${newCamera.id} (${newCamera.name}) added successfully`, 'success', 'Camera Registered');
  }, [showToast]);

  const updateCamera = useCallback((id: string, updates: Partial<Camera>) => {
    setCameras((prev) =>
      prev.map((cam) => (cam.id === id ? { ...cam, ...updates, lastSeen: new Date().toISOString() } : cam))
    );
    showToast(`Camera ${id} updated`, 'info', 'Configuration Saved');
  }, [showToast]);

  const deleteCamera = useCallback((id: string) => {
    setCameras((prev) => prev.filter((cam) => cam.id !== id));
    showToast(`Camera ${id} removed from system inventory`, 'warning', 'Camera Deleted');
  }, [showToast]);

  // Alert Actions
  const markAlertAsRead = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true, readAt: new Date().toISOString() } : a))
    );
  }, []);

  const markAlertAsUnread = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: false, readAt: undefined } : a))
    );
  }, []);

  const markAllAlertsAsRead = useCallback(() => {
    const now = new Date().toISOString();
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true, readAt: a.readAt || now })));
    showToast('All security alerts marked as read', 'info', 'Alerts Updated');
  }, [showToast]);

  const acknowledgeAlert = useCallback((id: string) => {
    const now = new Date().toISOString();
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true, acknowledgedAt: now, read: true } : a))
    );
    showToast(`Alert ${id} acknowledged by operator`, 'success', 'Security Action Logged');
  }, [showToast]);

  const acknowledgeAllAlerts = useCallback(() => {
    const now = new Date().toISOString();
    setAlerts((prev) =>
      prev.map((a) => ({ ...a, acknowledged: true, acknowledgedAt: a.acknowledgedAt || now, read: true }))
    );
    showToast('All active alerts acknowledged', 'success', 'Incident Queue Cleared');
  }, [showToast]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CAMERAS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    setCameras(INITIAL_CAMERAS);
    setEvents(ALL_INITIAL_EVENTS);
    setAlerts(INITIAL_ALERTS);
    showToast('Application state reset to enterprise baseline defaults', 'info', 'System Reset');
  }, [showToast]);

  // Computed KPIs
  const kpis: OverviewKpis = useMemo(() => {
    const totalCameras = cameras.length;
    const activeCameras = cameras.filter((c) => c.status === 'online').length;
    const warningCount = cameras.filter((c) => c.status === 'warning').length;
    const offlineCount = cameras.filter((c) => c.status === 'offline').length;
    
    // Count events created in today's date
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayEventsCount = events.filter((e) => new Date(e.timestamp) >= startOfToday).length;

    // Critical alerts count (exactly matching 5 in baseline)
    const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;

    return {
      totalCameras,
      activeCameras,
      eventsToday: todayEventsCount || INITIAL_TODAY_EVENTS.length,
      criticalAlerts,
      onlineCount: activeCameras,
      offlineCount,
      warningCount,
    };
  }, [cameras, events, alerts]);

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter((a) => !a.read).length;
  }, [alerts]);

  const criticalAlertCount = useMemo(() => {
    return alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length;
  }, [alerts]);

  const value = useMemo(
    () => ({
      cameras,
      events,
      alerts,
      kpis,
      unreadAlertsCount,
      criticalAlertCount,
      toasts,
      showToast,
      dismissToast,
      addCamera,
      updateCamera,
      deleteCamera,
      markAlertAsRead,
      markAlertAsUnread,
      markAllAlertsAsRead,
      acknowledgeAlert,
      acknowledgeAllAlerts,
      isSimulating,
      setIsSimulating,
      resetToDefaults,
      globalSearch,
      setGlobalSearch,
    }),
    [
      cameras,
      events,
      alerts,
      kpis,
      unreadAlertsCount,
      criticalAlertCount,
      toasts,
      showToast,
      dismissToast,
      addCamera,
      updateCamera,
      deleteCamera,
      markAlertAsRead,
      markAlertAsUnread,
      markAllAlertsAsRead,
      acknowledgeAlert,
      acknowledgeAllAlerts,
      isSimulating,
      setIsSimulating,
      resetToDefaults,
      globalSearch,
      setGlobalSearch,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

