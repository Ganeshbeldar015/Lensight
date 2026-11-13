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
  Moon, 
  Sun 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const { refreshCameras } = useCameras();
  const { refreshAlerts } = useAlerts();

  const [latency, setLatency] = useState<number>(getSimulatedLatency());
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const handleLatencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[rgba(250,93,25,0.1)] border border-[#fa5d19]/30 text-[#fa5d19] flex items-center gap-1.5 font-bold">
            <SettingsIcon className="w-3.5 h-3.5" />
            V1.0.0 STABLE
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Parameters */}
        <Card className="p-6 bg-[#121212] border-[#262626] space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#222]">
            <Sliders className="w-5 h-5 text-[#fa5d19]" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                API Latency Simulator
              </h3>
              <p className="text-xs text-[#777]">
                Artificially delay mock asynchronous requests to evaluate loading skeletons.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#aaa]">Simulated Delay:</span>
              <span className="text-[#fa5d19] font-bold">{latency} ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={latency}
              onChange={handleLatencyChange}
              className="w-full accent-[#fa5d19] bg-[#222] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#666]">
              <span>0ms (Instant)</span>
              <span>450ms (Recommended)</span>
              <span>2000ms (High Latency)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#222] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">Reset Database Seed</h4>
              <p className="text-[11px] text-[#777]">Restore default cameras, alerts, and telemetry.</p>
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
        <Card className="p-6 bg-[#121212] border-[#262626] space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#222]">
            <Database className="w-5 h-5 text-[#2a6dfb]" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Data Storage & Cloud Provider
              </h3>
              <p className="text-xs text-[#777]">
                Supabase Managed PostgreSQL / Local Mock Provider state.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-between">
              <span className="text-[#aaa]">Active Data Source:</span>
              <span className="text-white font-bold">
                {isSupabaseConfigured ? 'Supabase Managed Cloud' : 'In-Memory Mock JSON Engine'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-between">
              <span className="text-[#aaa]">Supabase Configuration:</span>
              <span className={`flex items-center gap-1.5 font-bold ${isSupabaseConfigured ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>
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

            <div className="p-3 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-between">
              <span className="text-[#aaa]">Realtime Engine:</span>
              <span className="text-[#22c55e]">WebSocket CDC Enabled</span>
            </div>
          </div>
        </Card>

        {/* Appearance & Design System */}
        <Card className="p-6 bg-[#121212] border-[#262626] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#222]">
            <Flame className="w-5 h-5 text-[#fa5d19]" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Design System & Theme
              </h3>
              <p className="text-xs text-[#777]">Firecrawl Developer Aesthetic with Heat Orange.</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#ccc]">Theme Selection</span>
            <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg border border-[#2d2d2d]">
              <button
                onClick={() => setThemeMode('dark')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 ${
                  themeMode === 'dark' ? 'bg-[#fa5d19] text-white font-bold' : 'text-[#888]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark (Default)
              </button>
              <button
                onClick={() => {
                  setThemeMode('light');
                  showToast({
                    type: 'info',
                    message: 'Light theme tokens are defined in design.md; SecOps dark mode is optimized for 24/7 monitoring.'
                  });
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 ${
                  themeMode === 'light' ? 'bg-[#fa5d19] text-white font-bold' : 'text-[#888]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
            </div>
          </div>
        </Card>

        {/* Honesty Rule Disclaimer Card */}
        <Card className="p-6 bg-[#121212] border-[#262626] space-y-3">
          <div className="flex items-center gap-2 text-white text-sm font-bold">
            <Info className="w-4 h-4 text-[#fa5d19]" />
            <span>Honesty Rule & Transparency Notice</span>
          </div>
          <p className="text-xs text-[#aaa] leading-relaxed">
            This dashboard operates entirely on structured mock JSON data and sample video feeds. No active external neural networks or live physical RTSP cameras are running inference in this build. Bounding box detections and classification percentages are simulations designed for evaluating interface ergonomics.
          </p>
          <div className="pt-2 font-mono text-[10px] text-[#666]">
            Lensight Platform • Built for SecOps Video Intelligence
          </div>
        </Card>
      </div>
    </div>
  );
};
