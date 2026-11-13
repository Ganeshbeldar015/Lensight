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
  ShieldCheck, 
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
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure client parameters, inspect database connections, and control simulation latency."
        badge={
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ddf1f1] border border-[#168a91]/20 text-[#168a91] flex items-center gap-1.5 font-semibold">
            <SettingsIcon className="w-3.5 h-3.5" />
            v1.0.0 Stable
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Parameters */}
        <Card className="p-6 bg-white border-[#dce5e7] shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#dce5e7]">
            <Sliders className="w-5 h-5 text-[#168a91]" />
            <div>
              <h3 className="text-sm font-semibold text-[#263b40]">
                API Latency Simulator
              </h3>
              <p className="text-xs text-[#61777c]">
                Simulate network delay to test loading skeletons and user feedback.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#61777c] font-medium">Simulated Delay:</span>
              <span className="text-[#168a91] font-bold font-mono">{latency} ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={latency}
              onChange={handleLatencyChange}
              className="w-full accent-[#168a91] bg-[#dce5e7] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#8a9b9f]">
              <span>0ms (Instant)</span>
              <span>450ms (Default)</span>
              <span>2000ms (High Latency)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#dce5e7] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#263b40]">Reset Seed Data</h4>
              <p className="text-[11px] text-[#61777c]">Restore default cameras, alerts, and events.</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetData}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Data
            </Button>
          </div>
        </Card>

        {/* Database & Cloud Telemetry */}
        <Card className="p-6 bg-white border-[#dce5e7] shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#dce5e7]">
            <Database className="w-5 h-5 text-[#168a91]" />
            <div>
              <h3 className="text-sm font-semibold text-[#263b40]">
                Data Storage & Cloud Provider
              </h3>
              <p className="text-xs text-[#61777c]">
                Supabase PostgreSQL / Local Mock Provider state.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-center justify-between">
              <span className="text-[#61777c] font-medium">Active Data Source:</span>
              <span className="text-[#263b40] font-semibold">
                {isSupabaseConfigured ? 'Supabase Cloud' : 'In-Memory Mock Provider'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-center justify-between">
              <span className="text-[#61777c] font-medium">Configuration Status:</span>
              <span className={`flex items-center gap-1.5 font-semibold ${isSupabaseConfigured ? 'text-[#299b72]' : 'text-[#d69a38]'}`}>
                {isSupabaseConfigured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready (.env configured)
                  </>
                ) : (
                  <>
                    <Info className="w-3.5 h-3.5" /> Local Mock Simulation Mode
                  </>
                )}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-center justify-between">
              <span className="text-[#61777c] font-medium">Realtime Subscriptions:</span>
              <span className="text-[#299b72] font-semibold">Supported</span>
            </div>
          </div>
        </Card>

        {/* Appearance & Design System */}
        <Card className="p-6 bg-white border-[#dce5e7] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#dce5e7]">
            <ShieldCheck className="w-5 h-5 text-[#168a91]" />
            <div>
              <h3 className="text-sm font-semibold text-[#263b40]">
                Design System & Theme
              </h3>
              <p className="text-xs text-[#61777c]">Teal & Cool Grey Modern Technology Theme.</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#263b40] font-medium">Active Theme</span>
            <div className="flex items-center gap-1.5 bg-[#ddf1f1] p-2 rounded-lg border border-[#168a91]/20 text-[#168a91] font-semibold text-xs">
              <Sun className="w-4 h-4 text-[#168a91]" />
              <span>Teal & Cool Grey (Active)</span>
            </div>
          </div>
        </Card>

        {/* Transparency Notice Card */}
        <Card className="p-6 bg-[#f0f6f6] border-[#dce5e7] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#263b40] text-sm font-semibold">
            <Info className="w-4 h-4 text-[#168a91]" />
            <span>Transparency Notice</span>
          </div>
          <p className="text-xs text-[#61777c] leading-relaxed">
            This application operates in simulated demonstration mode with local video feeds and mock telemetry data. Bounding box overlays and detection scores demonstrate interface design and operational workflows.
          </p>
          <div className="pt-1 text-[11px] text-[#8a9b9f]">
            Lensight Platform &bull; Enterprise Video Intelligence
          </div>
        </Card>
      </div>
    </div>
  );
};
