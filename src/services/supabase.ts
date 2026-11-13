import { createClient } from '@supabase/supabase-js';
import type { Camera, DetectionEvent, Alert } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Realtime subscription helper for new alerts
 */
export function subscribeToLiveAlerts(onNewAlert: (alert: Alert) => void) {
  if (!supabase) return null;

  return supabase
    .channel('public:alerts')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'alerts' },
      (payload) => {
        onNewAlert(payload.new as Alert);
      }
    )
    .subscribe();
}

/**
 * Realtime subscription helper for camera connectivity changes
 */
export function subscribeToCameraUpdates(onUpdate: (camera: Camera) => void) {
  if (!supabase) return null;

  return supabase
    .channel('public:cameras')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'cameras' },
      (payload) => {
        onUpdate(payload.new as Camera);
      }
    )
    .subscribe();
}

/**
 * Realtime subscription helper for AI detection events
 */
export function subscribeToLiveEvents(onNewEvent: (event: DetectionEvent) => void) {
  if (!supabase) return null;

  return supabase
    .channel('public:events')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'events' },
      (payload) => {
        onNewEvent(payload.new as DetectionEvent);
      }
    )
    .subscribe();
}
