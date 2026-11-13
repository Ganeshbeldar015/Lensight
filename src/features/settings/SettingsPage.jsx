import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useCameras } from '@/context/CameraContext';
import { useAlerts } from '@/context/AlertContext';
import { 
  getSimulatedLatency, 
  setSimulatedLatency, 
  resetToSeedData 
} from '@/services/mockApi';
import { isSupabaseConfigured } from '@/services/supabase';
import { 
  Settings as SettingsIcon, 
  Database, 
  Sliders, 
  RotateCcw, 
  Info, 
  CheckCircle2, 
  Flame, 
  Sun 
} from 'lucide-react';

export const SettingsPage = () => {
  const { showToast } = useToast();
  const { refreshCameras } = useCameras();
  const { refreshAlerts } = useAlerts();

  const [latency, setLatency] = useState(getSimulatedLatency());

  const handleLatencyChange = (e) => {
    const val = Number(e.target.value);
    setLatency(val);
    setSimulatedLatency(val);
  };

  const handleResetData = async () => {
    resetToSeedData();
    await refreshCameras();
    await refreshAlerts();
    showToast({
      type: 'success',
      title: 'Demo Data Reset',
      message: 'All cameras, events, and alerts have been restored to their default seeded states.'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="System Settings & Simulator Controls"
        description="Configure client parameters, inspect database connections, and control telemetry simulation."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#fa5d19] flex items-center gap-1.5 font-bold">
            <SettingsIcon className="w-3.5 h-3.5" />
            V1.0.0 STABLE
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Parameters */}
        <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-[#fa5d19]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                API Latency Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Artificially delay mock asynchronous requests to evaluate loading skeletons.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 font-medium">Simulated Delay:</span>
              <span className="text-[#fa5d19] font-bold">{latency} ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={latency}
              onChange={handleLatencyChange}
              className="w-full accent-[#fa5d19] bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0ms (Instant)</span>
              <span>450ms (Recommended)</span>
              <span>2000ms (High Latency)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-900">Reset Database Seed</h4>
              <p className="text-[11px] text-slate-500">Restore default cameras, alerts, and telemetry.</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetData}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Seed Data
            </Button>
          </div>
        </Card>

        {/* Database & Cloud Telemetry */}
        <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Data Storage & Cloud Provider
              </h3>
              <p className="text-xs text-slate-500">
                Supabase Managed PostgreSQL / Local Mock Provider state.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Active Data Source:</span>
              <span className="text-slate-900 font-bold">
                {isSupabaseConfigured ? 'Supabase Managed Cloud' : 'In-Memory Mock JSON Engine'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Supabase Configuration:</span>
              <span className={`flex items-center gap-1.5 font-bold ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isSupabaseConfigured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready (.env configured)
                  </>
                ) : (
                  <>
                    <Info className="w-3.5 h-3.5" /> Fallback (Mock Mode)
                  </>
                )}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Realtime Engine:</span>
              <span className="text-emerald-600 font-bold">WebSocket CDC Enabled</span>
            </div>
          </div>
        </Card>

        {/* Appearance & Design System */}
        <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Flame className="w-5 h-5 text-[#fa5d19]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Design System & Theme
              </h3>
              <p className="text-xs text-slate-500">Modern Enterprise Light Theme with Heat Orange accents.</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 font-medium">Active Theme</span>
            <div className="flex items-center gap-1 bg-orange-50 p-1.5 rounded-lg border border-orange-200 text-orange-700 font-semibold text-xs font-mono">
              <Sun className="w-4 h-4 text-[#fa5d19]" />
              <span>Modern Light (Active)</span>
            </div>
          </div>
        </Card>

        {/* Honesty Rule Disclaimer Card */}
        <Card className="p-6 bg-orange-50/60 border-orange-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 text-sm font-bold">
            <Info className="w-4 h-4 text-[#fa5d19]" />
            <span>Honesty Rule & Transparency Notice</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            This dashboard operates entirely on structured mock JSON data and sample video feeds. No active external neural networks or live physical RTSP cameras are running inference in this build. Bounding box detections and classification percentages are simulations designed for evaluating interface ergonomics.
          </p>
          <div className="pt-2 font-mono text-[10px] text-slate-500">
            Lensight Platform • Built for SecOps Video Intelligence
          </div>
        </Card>
      </div>
    </div>
  );
};
