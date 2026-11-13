import * as mockApi from './mockApi';
import { supabase, isSupabaseConfigured } from './supabase';
import type { 
  Camera, 
  DetectionEvent, 
  Alert, 
  OverviewKpis, 
  EventFilterState,
  CameraStatus 
} from '@/types';

const useMock = import.meta.env.VITE_USE_MOCK !== 'false' || !isSupabaseConfigured;

export const dataProvider = {
  isMock: useMock,

  async getCameras(): Promise<Camera[]> {
    if (useMock || !supabase) {
      return mockApi.getCameras();
    }
    const { data, error } = await supabase.from('cameras').select('*').order('id');
    if (error) {
      console.warn('Supabase getCameras error, falling back to mock:', error.message);
      return mockApi.getCameras();
    }
    return data as Camera[];
  },

  async addCamera(camera: Omit<Camera, 'id' | 'lastSeen' | 'status'> & { status?: CameraStatus }): Promise<Camera> {
    if (useMock || !supabase) {
      return mockApi.addCamera(camera);
    }
    const nextNum = Math.floor(Math.random() * 899) + 100;
    const newId = `CAM-${nextNum}`;
    const newCamera: Camera = {
      id: newId,
      name: camera.name,
      location: camera.location,
      status: camera.status || 'online',
      lastSeen: new Date().toISOString(),
      streamUrl: camera.streamUrl,
      thumbnail: camera.thumbnail,
      zone: camera.zone,
      fps: camera.fps || 30,
      resolution: camera.resolution || '1080p'
    };
    const { data, error } = await supabase.from('cameras').insert([newCamera]).select().single();
    if (error) {
      console.warn('Supabase addCamera error, falling back to mock:', error.message);
      return mockApi.addCamera(camera);
    }
    return data as Camera;
  },

  async updateCameraStatus(id: string, status: CameraStatus): Promise<Camera> {
    if (useMock || !supabase) {
      return mockApi.updateCameraStatus(id, status);
    }
    const { data, error } = await supabase
      .from('cameras')
      .update({ status, last_seen: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return mockApi.updateCameraStatus(id, status);
    }
    return data as Camera;
  },

  async deleteCamera(id: string): Promise<boolean> {
    if (useMock || !supabase) {
      return mockApi.deleteCamera(id);
    }
    const { error } = await supabase.from('cameras').delete().eq('id', id);
    if (error) {
      return mockApi.deleteCamera(id);
    }
    return true;
  },

  async getEvents(params: mockApi.GetEventsParams = {}): Promise<mockApi.EventsResponse> {
    if (useMock || !supabase) {
      return mockApi.getEvents(params);
    }
    // Simple Supabase fallback query or mock
    return mockApi.getEvents(params);
  },

  async getAlerts(): Promise<Alert[]> {
    if (useMock || !supabase) {
      return mockApi.getAlerts();
    }
    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
    if (error) {
      return mockApi.getAlerts();
    }
    return data as Alert[];
  },

  async acknowledgeAlert(id: string): Promise<Alert> {
    if (useMock || !supabase) {
      return mockApi.acknowledgeAlert(id);
    }
    const { data, error } = await supabase
      .from('alerts')
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return mockApi.acknowledgeAlert(id);
    }
    return data as Alert;
  },

  async acknowledgeAllAlerts(): Promise<Alert[]> {
    if (useMock || !supabase) {
      return mockApi.acknowledgeAllAlerts();
    }
    const { data, error } = await supabase
      .from('alerts')
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq('acknowledged', false)
      .select();
    if (error) {
      return mockApi.acknowledgeAllAlerts();
    }
    return data as Alert[];
  },

  async getOverviewKpis(): Promise<OverviewKpis> {
    return mockApi.getOverviewKpis();
  },

  async getAnalyticsData(range: 'today' | '24h' | '7d' | '30d'): Promise<mockApi.AnalyticsSummary> {
    return mockApi.getAnalyticsData(range);
  }
};
