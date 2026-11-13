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
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs border border-white/10 text-[10px] text-white shadow pointer-events-none font-mono">
        <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-[#d95757]' : 'bg-[#299b72] animate-pulse'}`} />
        <span className="font-semibold">{isOffline ? 'OFFLINE' : 'LIVE'}</span>
        <span className="text-white/40">&bull;</span>
        <span className="text-slate-300">{liveTimestamp}</span>
      </div>

      {/* 6. Technical Telemetry Tag (Top-Right) */}
      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/80 border border-white/10 text-[10px] text-slate-300 shadow pointer-events-none font-mono">
        {camera?.resolution || '1080p'} &bull; {camera?.fps || 30} FPS
      </div>

      {/* 7. Mandatory Honesty Disclaimer (Bottom-Right) */}
      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/85 border border-white/10 text-[9px] text-slate-300 flex items-center gap-1 pointer-events-none shadow font-mono">
        <span>Simulated CCTV</span>
      </div>

      {/* 8. Camera Zone Badge (Bottom-Left) */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 border border-white/10 text-[10px] text-slate-300 shadow pointer-events-none max-w-[50%] truncate font-mono">
        {camera?.zone || camera?.location || 'Zone 01'}
      </div>

      {/* 9. Interactive Hover Action Overlay Controls */}
      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
        {!isOffline && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay?.();
            }}
            className="w-9 h-9 rounded-full bg-white text-[#263b40] hover:bg-[#168a91] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            title={isPlaying ? 'Pause feed' : 'Play feed'}
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
              showOverlay ? 'bg-[#168a91] text-white' : 'bg-white text-[#263b40]'
            } hover:bg-[#11747a] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md`}
            title={showOverlay ? 'Hide detection overlay' : 'Show detection overlay'}
            aria-label="Toggle detection overlay"
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
            className="w-9 h-9 rounded-full bg-white text-[#263b40] hover:bg-[#168a91] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            title="Focus camera"
            aria-label="Focus camera"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
