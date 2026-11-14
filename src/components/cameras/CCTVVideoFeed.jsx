import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  Camera, 
  Eye, 
  EyeOff, 
  Maximize2, 
  ShieldAlert, 
  User, 
  Car, 
  Activity,
  VideoOff
} from 'lucide-react';

export const CCTVVideoFeed = ({
  camera,
  latestDetection,
  isPlaying = true,
  showOverlay = true,
  onTogglePlay,
  onToggleOverlay,
  onFocus,
  aspectRatio = 'aspect-video',
  className = ''
}) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState('');

  const isOffline = camera?.status === 'offline';
  const hasStream = Boolean(camera?.streamUrl && !videoError && !isOffline);

  // Synchronize play/pause state
  useEffect(() => {
    if (!videoRef.current || !hasStream) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
        // Autoplay policy or interrupt handling
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, hasStream]);

  // Live ticking CCTV HUD timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8);
      const ms = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
      setLiveTimestamp(`${dateStr} ${timeStr}:${ms}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Determine active simulated detection box
  const activeDetection = latestDetection || {
    type: camera?.zone?.toLowerCase().includes('perimeter') 
      ? 'restricted_area' 
      : camera?.zone?.toLowerCase().includes('parking') || camera?.zone?.toLowerCase().includes('logistics')
      ? 'vehicle'
      : 'person',
    confidence: 0.91,
    boundingBox: { x: 190, y: 110, width: 220, height: 260 },
    label: camera?.zone?.toLowerCase().includes('perimeter')
      ? 'RESTRICTED AREA 91%'
      : camera?.zone?.toLowerCase().includes('parking')
      ? 'VEHICLE 91%'
      : 'PERSON 91%'
  };

  // Color theme mapping for detection overlay
  const detectionTheme = {
    person: {
      border: 'border-[#168a91]',
      bg: 'bg-[#168a91]/15',
      badge: 'bg-[#168a91] text-white',
      icon: User,
      label: 'PERSON'
    },
    vehicle: {
      border: 'border-[#69aeb0]',
      bg: 'bg-[#69aeb0]/15',
      badge: 'bg-[#69aeb0] text-white',
      icon: Car,
      label: 'VEHICLE'
    },
    restricted_area: {
      border: 'border-[#d95757]',
      bg: 'bg-[#d95757]/20',
      badge: 'bg-[#d95757] text-white',
      icon: ShieldAlert,
      label: 'RESTRICTED AREA'
    },
    motion: {
      border: 'border-[#299b72]',
      bg: 'bg-[#299b72]/15',
      badge: 'bg-[#299b72] text-white',
      icon: Activity,
      label: 'MOTION'
    }
  }[activeDetection.type] || {
    border: 'border-[#168a91]',
    bg: 'bg-[#168a91]/15',
    badge: 'bg-[#168a91] text-white',
    icon: Activity,
    label: 'DETECTION'
  };

  const DetectionIcon = detectionTheme.icon;

  const box = activeDetection.boundingBox || (activeDetection.boundingBoxes && activeDetection.boundingBoxes[0]) || {
    x: 180,
    y: 110,
    width: 240,
    height: 260
  };

  return (
    <div className={`relative ${aspectRatio} bg-slate-950 flex items-center justify-center overflow-hidden select-none group ${className}`}>
      {/* 1. Offline CCTV Diagnostic Screen */}
      {isOffline ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-950 relative overflow-hidden">
          <AlertTriangle className="w-9 h-9 text-[#d95757] mb-2 opacity-90 animate-pulse" />
          <span className="font-mono text-xs font-bold text-[#d95757] tracking-wider">
            NO SIGNAL
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-1">
            CAMERA OFFLINE
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            Last active: {camera?.lastSeen ? new Date(camera.lastSeen).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
      ) : hasStream ? (
        /* 2. Active / Paused Video Feed */
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={camera.streamUrl}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900/85 border border-white/20 text-white font-mono text-xs flex items-center gap-2 shadow-lg">
                <Pause className="w-3.5 h-3.5 text-[#d69a38]" />
                <span className="font-semibold tracking-wider">PAUSED</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 3. Professional CCTV-Style Placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-4 pointer-events-none border border-slate-800 rounded">
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-slate-600" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-slate-600" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-slate-600" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-slate-600" />
          </div>

          <div className="w-11 h-11 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 mb-2 shadow-inner">
            {videoError ? (
              <VideoOff className="w-5 h-5 text-[#d69a38]" />
            ) : (
              <Camera className="w-5 h-5 text-[#168a91]" />
            )}
          </div>

          <span className="text-xs font-semibold text-slate-200">
            {videoError ? 'Stream Standby' : 'Simulated CCTV Feed'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-0.5">
            {camera?.name || 'Camera Channel'} &bull; {camera?.id || 'CAM-000'}
          </span>
        </div>
      )}

      {/* 4. Simulated Detection Overlay (Bounding Box + Confidence HUD) */}
      {!isOffline && showOverlay && (
        <div
          className={`absolute border-2 ${detectionTheme.border} ${detectionTheme.bg} transition-all pointer-events-none duration-200`}
          style={{
            left: `${Math.max(5, Math.min(70, (box.x / 640) * 100))}%`,
            top: `${Math.max(5, Math.min(60, (box.y / 480) * 100))}%`,
            width: `${Math.max(20, Math.min(50, (box.width / 640) * 100))}%`,
            height: `${Math.max(25, Math.min(65, (box.height / 480) * 100))}%`
          }}
        >
          <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />

          {/* Classification Label & Confidence Badge */}
          <div className="absolute -top-6 left-0 flex items-center gap-1">
            <span className={`${detectionTheme.badge} text-[10px] font-semibold px-1.5 py-0.5 rounded-xs flex items-center gap-1 shadow-md whitespace-nowrap`}>
              <DetectionIcon className="w-2.5 h-2.5" />
              <span>{detectionTheme.label}</span>
              <span className="text-white/80 font-normal">
                {Math.round((activeDetection.confidence || 0.9) * 100)}%
              </span>
            </span>
          </div>
        </div>
      )}

      {/* 5. Live CCTV HUD Header (Top-Left) */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-xs border border-white/10 text-[10px] text-white shadow-xs pointer-events-none font-mono">
        <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-[#d95757]' : 'bg-[#299b72] animate-pulse'}`} />
        <span className="font-bold tracking-wider">{isOffline ? 'OFFLINE' : 'LIVE'}</span>
        <span className="text-white/40">&bull;</span>
        <span className="text-slate-300 tabular-nums tracking-wide">{liveTimestamp}</span>
      </div>

      {/* 6. Technical Telemetry Tag (Top-Right) */}
      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-xs border border-white/10 text-[10px] text-slate-300 shadow-xs pointer-events-none font-mono">
        {camera?.resolution || '1080p'} &bull; {camera?.fps || 30} FPS
      </div>

      {/* 7. Bottom Floating Action Toolbar (Clean hover controls, never blocks center of feed) */}
      {!isOffline && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-lg">
          {/* Feed Zone / Status Info */}
          <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono truncate max-w-[45%]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#299b72] animate-pulse shrink-0" />
            <span className="truncate">{camera?.zone || camera?.location || 'Live Channel'}</span>
          </div>

          {/* Quick Control Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay?.();
              }}
              className="h-7 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
              title={isPlaying ? 'Pause feed' : 'Play feed'}
              aria-label={isPlaying ? 'Pause feed' : 'Play feed'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleOverlay?.();
              }}
              className={`h-7 px-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                showOverlay
                  ? 'bg-[#168a91] text-white hover:bg-[#11747a]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={showOverlay ? 'Hide AI Detection Box' : 'Show AI Detection Box'}
              aria-label="Toggle detection overlay"
            >
              {showOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="text-[11px]">AI Box</span>
            </button>

            {onFocus && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFocus();
                }}
                className="h-7 w-7 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Fullscreen Focus"
                aria-label="Fullscreen Focus"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
