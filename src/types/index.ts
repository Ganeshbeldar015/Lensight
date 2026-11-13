export type CameraStatus = 'online' | 'offline' | 'warning';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type EventType = 'person' | 'vehicle' | 'motion' | 'restricted_area';

export interface Camera {
  id: string;            // e.g. "CAM-001"
  name: string;          // e.g. "Main Entrance"
  location: string;      // e.g. "Building A - Ground Floor"
  status: CameraStatus;
  lastSeen: string;      // ISO timestamp
  streamUrl?: string;    // Sample mp4 or video stream URL
  thumbnail?: string;    // Optional thumbnail poster
  zone?: string;
  fps?: number;
  resolution?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface DetectionEvent {
  id: string;            // e.g. "EVT-1042"
  type: EventType;
  cameraId: string;
  cameraName?: string;
  timestamp: string;     // ISO timestamp
  confidence: number;    // 0.50 - 0.99
  severity: Severity;
  description: string;
  thumbnailUrl?: string;
  boundingBoxes?: BoundingBox[];
}

export interface Alert {
  id: string;            // e.g. "ALT-0231"
  eventId: string;
  cameraId: string;
  cameraName?: string;
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  timestamp: string;     // ISO timestamp
  acknowledged: boolean;
  acknowledgedAt?: string;
  read?: boolean;
  readAt?: string;
}

export interface OverviewKpis {
  totalCameras: number;
  activeCameras: number;
  eventsToday: number;
  criticalAlerts: number;
  onlineCount: number;
  offlineCount: number;
  warningCount: number;
}

export interface EventFilterState {
  searchQuery: string;
  types: EventType[];
  severities: Severity[];
  cameraIds: string[];
  dateRange: 'today' | '24h' | '7d' | '30d' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  durationMs?: number;
}
