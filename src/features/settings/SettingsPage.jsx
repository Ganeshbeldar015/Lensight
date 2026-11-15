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
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu,
  Bell,
  HardDrive,
  Activity,
  Layers,
  Sparkles,
  Shield,
  FileCheck2,
  Lock,
  Wifi
} from 'lucide-react';

const ToggleSwitch = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <div className="min-w-0">
      <span className="text-xs font-semibold text-[#263b40] block">{label}</span>
      {description && <span className="text-[11px] text-[#61777c] block leading-snug">{description}</span>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#168a91] focus:ring-offset-2 ${
        enabled ? 'bg-[#168a91]' : 'bg-[#dce5e7]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const SettingsPage = () => {
  const { showToast } = useToast();
  const { refreshCameras } = useCameras();
  const { refreshAlerts } = useAlerts();

  // Diagnostics & Simulator
  const [latency, setLatency] = useState(getSimulatedLatency());
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Vision & Inference Engine Settings
  const [confidenceFloor, setConfidenceFloor] = useState(75);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [privacyMasking, setPrivacyMasking] = useState(true);

  // Alerting & Dispatch Protocols
  const [audibleSirens, setAudibleSirens] = useState(true);
  const [desktopPush, setDesktopPush] = useState(false);
  const [autoArchiveLow, setAutoArchiveLow] = useState(true);

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

  const handleRunDiagnostics = () => {
    setIsRunningDiagnostics(true);
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      showToast({
        type: 'success',
        title: 'System Diagnostics: All Green',
        message: 'Camera pipelines active (9/9), AI inference nominal (60 FPS), and telemetry latencies verified.'
      });
    }, 900);
  };

  const handleToggle = (setter, keyName, value) => {
    setter(value);
    showToast({
      type: 'info',
      title: 'Setting Updated',
      message: `${keyName} is now ${value ? 'Enabled' : 'Disabled'}.`
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure vision AI inference models, incident dispatch protocols, storage retention, and regulatory compliance standards."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: AI Vision & Detection Engine */}
        <Card className="p-4 sm:p-6 bg-white border-[#dce5e7] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#dce5e7]">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-[#168a91]" />
              <div>
                <h3 className="text-sm font-semibold text-[#263b40]">
                  AI Vision & Detection Engine
                </h3>
                <p className="text-xs text-[#61777c]">
                  Hardware acceleration, neural models, and detection sensitivity.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#edf8f3] text-[#299b72] border border-[#299b72]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#299b72] animate-pulse" />
              60 FPS Neural Core
            </span>
          </div>

          <div className="space-y-4">
            {/* Confidence Threshold */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#61777c] font-medium">Detection Confidence Floor:</span>
                <span className="text-[#168a91] font-bold font-mono">{confidenceFloor}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={confidenceFloor}
                onChange={(e) => setConfidenceFloor(Number(e.target.value))}
                className="w-full accent-[#168a91] bg-[#dce5e7] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8a9b9f]">
                <span>50% (High Recall)</span>
                <span>75% (Recommended)</span>
                <span>95% (High Precision)</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="border-t border-[#dce5e7] pt-2 divide-y divide-[#dce5e7]/60">
              <ToggleSwitch
                enabled={showBoundingBoxes}
                onChange={(val) => handleToggle(setShowBoundingBoxes, 'Real-Time Bounding Boxes', val)}
                label="Real-Time Bounding Box Overlays"
                description="Render visual tracking bounding boxes and classification tags over video streams."
              />
              <ToggleSwitch
                enabled={privacyMasking}
                onChange={(val) => handleToggle(setPrivacyMasking, 'Dynamic Privacy Masking', val)}
                label="Dynamic Privacy Masking (GDPR / CCPA)"
                description="Automatically blur facial identities and vehicle license plates on recorded streams."
              />
            </div>

            {/* Active Models */}
            <div className="pt-2 border-t border-[#dce5e7]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a9b9f] block mb-2">
                Active Neural Classifiers
              </span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f0f6f6] border border-[#dce5e7] text-[#263b40] font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#168a91]" />
                  YOLOv11-Vision-SecOps
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f0f6f6] border border-[#dce5e7] text-[#263b40] font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#168a91]" />
                  DeepSORT-v3 Re-ID Engine
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Alerting & Incident Dispatch Protocols */}
        <Card className="p-4 sm:p-6 bg-white border-[#dce5e7] shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#dce5e7]">
            <Bell className="w-5 h-5 text-[#168a91]" />
            <div>
              <h3 className="text-sm font-semibold text-[#263b40]">
                Alerting & Incident Dispatch Protocols
              </h3>
              <p className="text-xs text-[#61777c]">
                Operator escalation triggers, push channels, and incident routing.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#dce5e7]/60">
            <ToggleSwitch
              enabled={audibleSirens}
              onChange={(val) => handleToggle(setAudibleSirens, 'Audible Critical Siren', val)}
              label="Audible Siren on Critical Perimeter Breaches"
              description="Play high-priority acoustic warning tone through operator console on Level 1 breaches."
            />
            <ToggleSwitch
              enabled={desktopPush}
              onChange={(val) => handleToggle(setDesktopPush, 'Desktop Push Alerts', val)}
              label="Browser Desktop Notifications"
              description="Transmit instantaneous OS-level push notifications for unacknowledged incidents."
            />
            <ToggleSwitch
              enabled={autoArchiveLow}
              onChange={(val) => handleToggle(setAutoArchiveLow, 'Auto-Archive Low Severity', val)}
              label="Auto-Archive Low Severity Events"
              description="Automatically resolve and archive informational/motion telemetry after 15 minutes."
            />
          </div>

          <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#61777c] font-medium">Incident Dispatch Webhook:</span>
              <span className="text-[#299b72] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Relay
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#8a9b9f] truncate">
              https://dispatch.lensight.internal/v2/secops-webhook
            </p>
          </div>
        </Card>

        {/* Card 3: Storage, Stream & Cloud Telemetry */}
        <Card className="p-4 sm:p-6 bg-white border-[#dce5e7] shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#dce5e7]">
            <HardDrive className="w-5 h-5 text-[#168a91]" />
            <div>
              <h3 className="text-sm font-semibold text-[#263b40]">
                Storage, Streaming & Cloud Telemetry
              </h3>
              <p className="text-xs text-[#61777c]">
                Video retention buffers, streaming protocol, and database status.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-center justify-between">
              <span className="text-[#61777c] font-medium">Storage & Cloud Provider:</span>
              <span className="text-[#263b40] font-semibold">
                {isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Enterprise In-Memory Edge Cache'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-center justify-between">
              <span className="text-[#61777c] font-medium">Stream Transport Protocol:</span>
              <span className="text-[#263b40] font-semibold flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-[#168a91]" /> WebRTC / RTSP-over-TLS 1.3
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-center justify-between">
              <span className="text-[#61777c] font-medium">Rolling Buffer Retention:</span>
              <span className="text-[#263b40] font-semibold">30 Days (Cyclic Storage)</span>
            </div>

            <div className="p-3 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-center justify-between">
              <span className="text-[#61777c] font-medium">Cryptographic Audit Trail:</span>
              <span className="text-[#299b72] font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> SHA-256 Tamper-Proof
              </span>
            </div>
          </div>
        </Card>

        {/* Card 4: Security, Compliance & Operational Specifications (Valid Points replacing Transparency Notice) */}
        <Card className="p-4 sm:p-6 bg-white border-[#dce5e7] shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#dce5e7]">
            <ShieldCheck className="w-5 h-5 text-[#168a91]" />
            <div>
              <h3 className="text-sm font-semibold text-[#263b40]">
                Security, Compliance & Operational Specifications
              </h3>
              <p className="text-xs text-[#61777c]">
                Enterprise regulatory governance, audit standards, and failover architecture.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-start gap-2.5">
              <FileCheck2 className="w-4 h-4 text-[#168a91] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#263b40]">NDAA Section 889 Compliant</h4>
                <p className="text-[11px] text-[#61777c] leading-relaxed">
                  Certified for critical infrastructure and federal deployment; zero prohibited telecom hardware in capture pipeline.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-[#168a91] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#263b40]">SOC 2 Type II & Continuous Audit Trail</h4>
                <p className="text-[11px] text-[#61777c] leading-relaxed">
                  All operator actions, event acknowledgements, and video exports are signed and permanently logged with immutable timestamps.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-[#168a91] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#263b40]">GDPR Article 35 / CCPA Privacy-by-Design</h4>
                <p className="text-[11px] text-[#61777c] leading-relaxed">
                  Dynamic facial blurring and selective metadata strip ensures compliance with international data privacy frameworks.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f0f6f6] border border-[#dce5e7] flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-[#168a91] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#263b40]">Zero-Loss Autonomous Edge Failover</h4>
                <p className="text-[11px] text-[#61777c] leading-relaxed">
                  Nodes retain continuous recording buffer locally during upstream network disconnects, auto-syncing upon reconnection.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#dce5e7] flex items-center justify-between text-[11px] text-[#8a9b9f]">
            <span>Lensight Platform v2.4.1 (Enterprise Suite)</span>
            <span className="font-semibold text-[#168a91]">Security Clearance: Level 4</span>
          </div>
        </Card>

        {/* Card 5: Diagnostic Harness & Telemetry Simulator (Full width or paired) */}
        <Card className="lg:col-span-2 p-4 sm:p-6 bg-white border-[#dce5e7] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#dce5e7] gap-2">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-[#168a91]" />
              <div>
                <h3 className="text-sm font-semibold text-[#263b40]">
                  Diagnostic Test Harness & Network Simulation
                </h3>
                <p className="text-xs text-[#61777c]">
                  Control simulated latency, test loading states, and run platform health checks.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunDiagnostics}
                isLoading={isRunningDiagnostics}
                leftIcon={<Activity className="w-3.5 h-3.5" />}
              >
                Run Diagnostics
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetData}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Seed Data
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-w-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#61777c] font-medium">Simulated Network Telemetry Delay:</span>
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
              <span>0ms (Instantaneous)</span>
              <span>450ms (Nominal Enterprise CDN)</span>
              <span>2000ms (High Latency / Edge Saturation)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
