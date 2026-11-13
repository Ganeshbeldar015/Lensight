import * as mockApi from './mockApi';
import { supabase, isSupabaseConfigured } from './supabase';

const useMock = import.meta.env.VITE_USE_MOCK !== 'false' || !isSupabaseConfigured;

export const dataProvider = {
  isMock: useMock,

  async getCameras() {
    if (useMock || !supabase) {
      return mockApi.getCameras();
    }
    const { data, error } = await supabase.from('cameras').select('*').order('id');
    if (error) {
      console.warn('Supabase getCameras error, falling back to mock:', error.message);
      return mockApi.getCameras();
    }
    return data;
  },

  async addCamera(camera) {
    if (useMock || !supabase) {
      return mockApi.addCamera(camera);
    }
    const nextNum = Math.floor(Math.random() * 899) + 100;
    const newId = `CAM-${nextNum}`;
    const newCamera = {
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
    return data;
  },

  async updateCameraStatus(id, status) {
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
    return data;
  },

  async deleteCamera(id) {
    if (useMock || !supabase) {
      return mockApi.deleteCamera(id);
    }
    const { error } = await supabase.from('cameras').delete().eq('id', id);
    if (error) {
      return mockApi.deleteCamera(id);
    }
    return true;
  },

  async getEvents(params = {}) {
    if (useMock || !supabase) {
      return mockApi.getEvents(params);
    }
    return mockApi.getEvents(params);
  },

  async getAlerts() {
    if (useMock || !supabase) {
      return mockApi.getAlerts();
    }
    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
    if (error) {
      return mockApi.getAlerts();
    }
    return data;
  },

  async acknowledgeAlert(id) {
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
    return data;
  },

  async acknowledgeAllAlerts() {
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
    return data;
  },

  async getOverviewKpis() {
    return mockApi.getOverviewKpis();
  },

  async getAnalyticsData(range) {
    return mockApi.getAnalyticsData(range);
  }
};
