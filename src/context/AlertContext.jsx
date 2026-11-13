import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dataProvider } from '@/services/dataProvider';
import { useToast } from './ToastContext';
import { subscribeToLiveAlerts } from '@/services/supabase';

const AlertContext = createContext(undefined);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dataProvider.getAlerts();
      setAlerts(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch alerts';
      showToast({ type: 'error', title: 'Alerts Error', message: msg });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAlerts();

    // Supabase Realtime subscription for incoming alerts
    const subscription = subscribeToLiveAlerts((newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
      showToast({
        type: newAlert.severity === 'critical' ? 'error' : 'warning',
        title: `🚨 ${newAlert.title}`,
        message: `${newAlert.cameraName || newAlert.cameraId}: ${newAlert.description}`
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadAlerts, showToast]);

  const acknowledgeAlert = async (id) => {
    try {
      const updated = await dataProvider.acknowledgeAlert(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast({
        type: 'success',
        title: 'Alert Acknowledged',
        message: `Alert ${id} triaged successfully.`
      });
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Acknowledge failed';
      showToast({ type: 'error', title: 'Action Failed', message: msg });
      throw err;
    }
  };

  const acknowledgeAll = async () => {
    try {
      const updatedList = await dataProvider.acknowledgeAllAlerts();
      setAlerts(updatedList);
      showToast({
        type: 'success',
        title: 'All Alerts Acknowledged',
        message: 'All unread security notifications have been resolved.'
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Bulk acknowledge failed';
      showToast({ type: 'error', title: 'Action Failed', message: msg });
      throw err;
    }
  };

  const unreadCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length;

  return (
    <AlertContext.Provider
      value={{
        alerts,
        loading,
        unreadCount,
        criticalCount,
        acknowledgeAlert,
        acknowledgeAll,
        refreshAlerts: loadAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}
