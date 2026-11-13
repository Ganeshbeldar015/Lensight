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
  Radio,
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
  // Priority: passed latestDetection -> fallback synthetic based on camera type/zone
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
      border: 'border-sky-400',
      bg: 'bg-sky-500/15',
      badge: 'bg-sky-500 text-white',
      icon: User,
      label: 'PERSON'
    },
    vehicle: {
      border: 'border-purple-400',
      bg: 'bg-purple-500/15',
      badge: 'bg-purple-600 text-white',
      icon: Car,
      label: 'VEHICLE'
    },
    restricted_area: {
      border: 'border-rose-500',
      bg: 'bg-rose-500/20',
      badge: 'bg-rose-600 text-white',
      icon: ShieldAlert,
      label: 'RESTRICTED AREA'
    },
    motion: {
      border: 'border-emerald-400',
      bg: 'bg-emerald-500/15',
      badge: 'bg-emerald-600 text-white',
      icon: Activity,
      label: 'MOTION'
    }
  }[activeDetection.type] || {
    border: 'border-[#fa5d19]',
    bg: 'bg-[rgba(250,93,25,0.18)]',
    badge: 'bg-[#fa5d19] text-white',
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
          {/* Subtle Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
          
          <AlertTriangle className="w-10 h-10 text-rose-500 mb-2.5 opacity-90 animate-pulse" />
          <span className="font-mono text-xs font-bold text-rose-500 tracking-widest">
            NO CARRIER SIGNAL
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            SENSOR OFFLINE // RTSP TIMEOUT
          </span>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
            Last ping: {camera?.lastSeen ? new Date(camera.lastSeen).toLocaleTimeString() : 'N/A'}
          </span>

          {/* Diagnostic SMPTE Color Bars (Mini) */}
          <div className="mt-3 flex h-2 w-32 rounded overflow-hidden opacity-40">
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-yellow-400" />
            <div className="flex-1 bg-cyan-400" />
            <div className="flex-1 bg-green-500" />
            <div className="flex-1 bg-fuchsia-500" />
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-blue-600" />
          </div>
        </div>
      ) : hasStream && isPlaying ? (
        /* 2. Active Video Feed */
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
      ) : (
        /* 3. Professional CCTV-Style Placeholder (When Paused, Unavailable, or Video Error) */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-radial from-slate-900 to-slate-950 relative overflow-hidden">
          {/* Scanline raster effect */}
          <div className="absolute inset-0 pointer-events-none opacity-15 bg-[linear-gradient(rgba(255,255,255,0.06)_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_3px]" />

          {/* Subtle CCTV Crosshair Grid Reticle */}
          <div className="absolute inset-4 pointer-events-none border border-slate-800/80 rounded">
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-slate-500" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-slate-500" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-slate-500" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-slate-500" />
          </div>

          {/* Center Target Glyph */}
          <div className="w-12 h-12 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center text-slate-400 mb-2.5 shadow-inner">
            {videoError ? (
              <VideoOff className="w-5 h-5 text-amber-500/90" />
            ) : (
              <Camera className="w-5 h-5 text-[#fa5d19] animate-pulse" />
            )}
          </div>

          <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
            {videoError ? 'LOCAL STREAM STANDBY' : 'SIMULATED CCTV FEED'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            {camera?.name || 'Monitoring Channel'} • {camera?.id || 'CAM-000'}
          </span>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
            {camera?.resolution || '1080p'} @ {camera?.fps || 30}fps // H.264
          </span>
        </div>
      )}

      {/* 4. Simulated AI Detection Overlay (Bounding Box + Confidence HUD) */}
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
          {/* Target Corner Reticles */}
          <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />

          {/* Classification Label & Confidence Badge */}
          <div className="absolute -top-6 left-0 flex items-center gap-1">
            <span className={`${detectionTheme.badge} font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-wider rounded-xs flex items-center gap-1 shadow-md whitespace-nowrap`}>
              <DetectionIcon className="w-2.5 h-2.5" />
              <span>{detectionTheme.label}</span>
              <span className="text-white/80 font-normal">
                {Math.round((activeDetection.confidence || 0.9) * 100)}%
              </span>
            </span>
            <span className="bg-slate-900/90 text-amber-300 font-mono text-[8px] font-semibold px-1 py-0.5 rounded-xs border border-amber-500/30">
              SIMULATED
            </span>
          </div>
        </div>
      )}

      {/* 5. Live CCTV HUD Header (Top-Left) */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white shadow pointer-events-none">
        <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
        <span className="font-bold tracking-tight">{isOffline ? 'OFFLINE' : 'REC • LIVE'}</span>
        <span className="text-white/40">•</span>
        <span className="text-slate-300 font-mono">{liveTimestamp}</span>
      </div>

      {/* 6. Technical Telemetry Tag (Top-Right) */}
      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/10 font-mono text-[9px] text-slate-300 shadow pointer-events-none">
        {camera?.resolution || '1080p'} • {camera?.fps || 30}FPS
      </div>

      {/* 7. Mandatory Honesty Disclaimer (Bottom-Right) */}
      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/85 backdrop-blur-xs border border-amber-500/30 font-mono text-[8px] text-amber-300/90 flex items-center gap-1 pointer-events-none shadow">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>SIMULATED CCTV DEMO</span>
      </div>

      {/* 8. Camera Zone Badge (Bottom-Left) */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-white/10 font-mono text-[9px] text-slate-300 shadow pointer-events-none max-w-[50%] truncate">
        {camera?.zone || camera?.location || 'Zone 01'}
      </div>

      {/* 9. Interactive Hover Action Overlay Controls */}
      <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
        {!isOffline && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay?.();
            }}
            className="w-9 h-9 rounded-full bg-slate-900/90 hover:bg-[#fa5d19] text-white flex items-center justify-center transition-all border border-slate-700 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause CCTV feed' : 'Play CCTV feed'}
            aria-label={isPlaying ? 'Pause feed' : 'Play feed'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        )}

        {!isOffline && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleOverlay?.();
            }}
            className={`w-9 h-9 rounded-full ${
              showOverlay ? 'bg-[#fa5d19] text-white' : 'bg-slate-900/90 text-slate-300'
            } hover:bg-[#fa5d19] hover:text-white flex items-center justify-center transition-all border border-slate-700 cursor-pointer shadow-lg hover:scale-105 active:scale-95`}
            title={showOverlay ? 'Hide AI bounding overlays' : 'Show AI bounding overlays'}
            aria-label="Toggle AI overlay"
          >
            {showOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        )}

        {onFocus && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFocus();
            }}
            className="w-9 h-9 rounded-full bg-slate-900/90 hover:bg-[#fa5d19] text-white flex items-center justify-center transition-all border border-slate-700 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            title="Focus camera telemetry"
            aria-label="Focus camera"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
