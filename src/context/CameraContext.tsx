import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Camera, CameraStatus } from '@/types';
import { dataProvider } from '@/services/dataProvider';
import { useToast } from './ToastContext';
import { subscribeToCameraUpdates } from '@/services/supabase';

interface CameraContextType {
  cameras: Camera[];
  loading: boolean;
  error: string | null;
  addCamera: (data: Omit<Camera, 'id' | 'lastSeen' | 'status'> & { status?: CameraStatus }) => Promise<Camera>;
  updateStatus: (id: string, status: CameraStatus) => Promise<Camera>;
  deleteCamera: (id: string) => Promise<boolean>;
  refreshCameras: () => Promise<void>;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadCameras = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataProvider.getCameras();
      setCameras(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load cameras';
      setError(msg);
      showToast({ type: 'error', title: 'Camera Sync Error', message: msg });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCameras();

    // Supabase Realtime subscription if available
    const subscription = subscribeToCameraUpdates((updatedCam) => {
      setCameras((prev) => 
        prev.map((c) => (c.id === updatedCam.id ? { ...c, ...updatedCam } : c))
      );
      showToast({
        type: 'info',
        title: 'Camera Status Changed',
        message: `${updatedCam.name} is now ${updatedCam.status.toUpperCase()}`
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadCameras, showToast]);

  const addCamera = async (data: Omit<Camera, 'id' | 'lastSeen' | 'status'> & { status?: CameraStatus }) => {
    try {
      const created = await dataProvider.addCamera(data);
      setCameras((prev) => [created, ...prev]);
      showToast({
        type: 'success',
        title: 'Camera Registered',
        message: `Successfully connected ${created.name} (${created.id})`
      });
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add camera';
      showToast({ type: 'error', title: 'Add Failed', message: msg });
      throw err;
    }
  };

  const updateStatus = async (id: string, status: CameraStatus) => {
    try {
      const updated = await dataProvider.updateCameraStatus(id, status);
      setCameras((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast({
        type: 'info',
        title: 'Status Updated',
        message: `${updated.name} set to ${status.toUpperCase()}`
      });
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      showToast({ type: 'error', title: 'Update Failed', message: msg });
      throw err;
    }
  };

  const deleteCamera = async (id: string) => {
    try {
      const cam = cameras.find((c) => c.id === id);
      await dataProvider.deleteCamera(id);
      setCameras((prev) => prev.filter((c) => c.id !== id));
      showToast({
        type: 'warning',
        title: 'Camera Removed',
        message: `Camera ${cam ? cam.name : id} decommissioned.`
      });
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Removal failed';
      showToast({ type: 'error', title: 'Delete Failed', message: msg });
      throw err;
    }
  };

  return (
    <CameraContext.Provider
      value={{
        cameras,
        loading,
        error,
        addCamera,
        updateStatus,
        deleteCamera,
        refreshCameras: loadCameras
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export function useCameras() {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameras must be used within a CameraProvider');
  }
  return context;
}
