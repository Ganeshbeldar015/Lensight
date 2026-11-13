import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { isSupabaseConfigured } from '@/services/supabase';
import {
  User,
  Bell,
  Sliders,
  Server,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { isSimulating, setIsSimulating, resetToDefaults, showToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalPush, setCriticalPush] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [autoRefreshSec, setAutoRefreshSec] = useState('10');
  const [minConfidenceThreshold, setMinConfidenceThreshold] = useState(75);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform preferences successfully saved to storage', 'success', 'Preferences Updated');
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setIsResetConfirmOpen(false);
  };

  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Page Header */}
      <PageHeader
        title="System Settings"
        subtitle="Operational parameters, AI inference thresholds, operator profile, and runtime configuration"
        breadcrumbs={[{ label: 'Lensight' }, { label: 'Settings' }]}
      />

      {/* Operator Profile Card */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-400" />
          Operator Profile & Session
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#151E2D] border border-[#374151]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
              SO
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F9FAFB]">Chief Watch Officer</h4>
              <p className="text-xs text-[#9CA3AF] font-mono">ops-lead@lensight.corp</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-400">Security Clearance Level 4</span>
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-[#9CA3AF]">
            <span className="block text-[#6B7280]">Role: Security Administrator</span>
            <span className="text-emerald-400 block mt-0.5">Full Operator Privileges</span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            Notification & Incident Dispatch
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#151E2D] border border-[#374151] cursor-pointer hover:border-[#4B5563] transition-colors">
              <div>
                <span className="text-xs font-semibold text-[#F9FAFB] block">
                  Critical Incident Push Alerts
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  Trigger high-priority visual popovers on critical threat detections
                </span>
              </div>
              <input
                type="checkbox"
                checked={criticalPush}
                onChange={(e) => setCriticalPush(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#151E2D] border border-[#374151] cursor-pointer hover:border-[#4B5563] transition-colors">
              <div>
                <span className="text-xs font-semibold text-[#F9FAFB] block">
                  Periodic Security Digest (Daily)
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  Dispatch automated PDF incident and camera uptime summaries
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#151E2D] border border-[#374151] cursor-pointer hover:border-[#4B5563] transition-colors">
              <div>
                <span className="text-xs font-semibold text-[#F9FAFB] block">
                  Audio Siren on High Severity Events
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  Play audible tone in monitoring room when restricted area is breached
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Dashboard & Inference Engine Settings */}
        <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Surveillance & AI Inference Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
                Telemetry Auto-Refresh Interval
              </label>
              <select
                value={autoRefreshSec}
                onChange={(e) => setAutoRefreshSec(e.target.value)}
                className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-xs font-mono text-[#F9FAFB] focus:outline-none focus:border-emerald-500"
              >
                <option value="5">5 Seconds (High Performance)</option>
                <option value="10">10 Seconds (Recommended)</option>
                <option value="30">30 Seconds (Bandwidth Saving)</option>
                <option value="0">Manual Refresh Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 font-mono uppercase">
                Minimum AI Confidence Filter: {minConfidenceThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={minConfidenceThreshold}
                onChange={(e) => setMinConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer mt-2"
              />
              <span className="text-[11px] text-[#6B7280] block mt-1">
                Detections below {minConfidenceThreshold}% will be suppressed from priority alerts.
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#374151]/60">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#151E2D] border border-[#374151] cursor-pointer hover:border-[#4B5563] transition-colors">
              <div>
                <span className="text-xs font-semibold text-[#F9FAFB] block">
                  Simulated Live Event Generation
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  Periodically inject simulated AI detections to demonstrate realtime dashboard dynamics
                </span>
              </div>
              <input
                type="checkbox"
                checked={isSimulating}
                onChange={(e) => setIsSimulating(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save System Preferences
            </button>
          </div>
        </div>
      </form>

      {/* System Information Card */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          Lensight Core Engine Specifications
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Platform Version</span>
            <span className="font-mono text-[#F9FAFB] font-bold mt-1 block">v2.4.0-Enterprise</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Inference Engine</span>
            <span className="font-mono text-emerald-400 font-bold mt-1 block">TensorRT-v9 (Edge)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Data Provider</span>
            <span className="font-mono text-[#F9FAFB] font-bold mt-1 block">
              {useMock ? 'Mock Data Layer' : isSupabaseConfigured ? 'Supabase Realtime' : 'Mock Fallback'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#151E2D] border border-[#374151]">
            <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Storage Allocated</span>
            <span className="font-mono text-[#F9FAFB] font-bold mt-1 block">4.2 TB / 12 TB</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Mock Data */}
      <div className="bg-[#1F2937] border border-red-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-red-400" />
              Reset Demonstration Baseline
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Reset all modified cameras, acknowledged alerts, and local modifications back to initial 20 cameras, 145 events, and 5 critical alerts.
            </p>
          </div>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-mono font-semibold transition-colors shrink-0"
          >
            Reset All Data
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Application Data"
        message="This will clear your local storage modifications (added/edited cameras, alert acknowledgments) and restore the default 20-camera enterprise dataset."
        confirmLabel="Reset to Defaults"
        isDestructive={true}
      />
    </div>
  );
};
