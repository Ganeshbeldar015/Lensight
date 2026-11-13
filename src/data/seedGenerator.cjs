const fs = require('fs');
const path = require('path');

const CAMERAS = [
  {
    id: 'CAM-001',
    name: 'Main Entrance Gate',
    location: 'Building A - Ground Floor',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 45).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    zone: 'Perimeter Entry',
    fps: 30,
    resolution: '1080p'
  },
  {
    id: 'CAM-002',
    name: 'Visitor Reception & Lobby',
    location: 'Building A - Floor 1',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 20).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    zone: 'Lobby & Public',
    fps: 30,
    resolution: '1080p'
  },
  {
    id: 'CAM-003',
    name: 'Data Center Vault & Server Room',
    location: 'Building B - Sub-Basement',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 10).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    zone: 'Restricted Tier 4',
    fps: 60,
    resolution: '4K'
  },
  {
    id: 'CAM-004',
    name: 'Perimeter North Fence line',
    location: 'Outer Perimeter - North Wall',
    status: 'warning',
    lastSeen: new Date(Date.now() - 1000 * 180).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    zone: 'Boundary Perimeter',
    fps: 15,
    resolution: '720p'
  },
  {
    id: 'CAM-005',
    name: 'Loading Bay & Logistics Dock 4',
    location: 'Warehouse C - South Dock',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 35).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    zone: 'Logistics',
    fps: 30,
    resolution: '1080p'
  },
  {
    id: 'CAM-006',
    name: 'Executive Office Corridor',
    location: 'Building A - Floor 4',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 50).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    zone: 'Executive Wing',
    fps: 30,
    resolution: '1080p'
  },
  {
    id: 'CAM-007',
    name: 'Sub-Level Parking Lot P1',
    location: 'Underground Garage - Sector B',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 15).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    zone: 'Parking Structure',
    fps: 30,
    resolution: '1080p'
  },
  {
    id: 'CAM-008',
    name: 'Rooftop HVAC & Solar Array',
    location: 'Building A - Roof Access',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    streamUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    zone: 'Facility Infrastructure',
    fps: 0,
    resolution: '1080p'
  },
  {
    id: 'CAM-009',
    name: 'East Turnstile Employee Access',
    location: 'East Wing - Security Checkpoint 2',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 25).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
    zone: 'Access Control',
    fps: 30,
    resolution: '1080p'
  },
  {
    id: 'CAM-010',
    name: 'Chemical & Hazmat Storage Yard',
    location: 'Facility D - Zone 3',
    status: 'warning',
    lastSeen: new Date(Date.now() - 1000 * 120).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    zone: 'Hazardous Materials',
    fps: 20,
    resolution: '1080p'
  },
  {
    id: 'CAM-011',
    name: 'Perimeter South Riverbank',
    location: 'Outer Perimeter - South Gate',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    streamUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=600&q=80',
    zone: 'Boundary Perimeter',
    fps: 0,
    resolution: '720p'
  },
  {
    id: 'CAM-012',
    name: 'Cafeteria & Central Atrium',
    location: 'Building A - Floor 2',
    status: 'online',
    lastSeen: new Date(Date.now() - 1000 * 18).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    zone: 'Common Areas',
    fps: 30,
    resolution: '1080p'
  }
];

const EVENT_TEMPLATES = {
  person: [
    'Unidentified individual detected traversing after hours',
    'Personnel badge scanned at secondary checkpoint',
    'Maintenance contractor detected in service corridor',
    'Lone worker detected in logistics warehouse',
    'Individual lingering near executive suites'
  ],
  vehicle: [
    'Commercial delivery van entered logistics dock bay 4',
    'Unregistered passenger vehicle entered underground garage P1',
    'Security patrol vehicle logged at perimeter gate',
    'Electric delivery forklift active in loading area',
    'Heavy cargo transport parked in red clearance zone'
  ],
  motion: [
    'Sudden rapid movement detected along perimeter fence line',
    'Motion sensor triggered near HVAC mechanical air intake',
    'Vibration anomaly registered at server rack row C',
    'Object displacement detected in hazardous materials bay',
    'Night-time light shift and motion in central cafeteria'
  ],
  restricted_area: [
    'Unauthorized breach inside Secure Server Room Tier 4',
    'Perimeter fence crossing detected on North boundary',
    'Breach into Chemical Storage Zone without badge authorization',
    'Access violation detected at Rooftop HVAC service hatch',
    'Intrusion detected in Executive Safe storage alcove'
  ]
};

// Generate 165 realistic events over the past 30 days
const now = Date.now();
const events = [];

for (let i = 1; i <= 165; i++) {
  // Distribute over last 30 days, heavily weighted towards recent days
  const dayOffset = Math.pow(Math.random(), 1.6) * 30; // More events recently
  const hour = Math.floor(8 + Math.random() * 14) % 24; // Daytime weighted
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  const eventTime = new Date(now - (dayOffset * 24 * 60 * 60 * 1000));
  eventTime.setHours(hour, minute, second);

  const randType = Math.random();
  let type = 'person';
  if (randType < 0.38) type = 'person';
  else if (randType < 0.65) type = 'vehicle';
  else if (randType < 0.85) type = 'motion';
  else type = 'restricted_area';

  let severity = 'low';
  if (type === 'restricted_area') {
    severity = Math.random() < 0.7 ? 'critical' : 'high';
  } else if (type === 'vehicle') {
    severity = Math.random() < 0.2 ? 'high' : (Math.random() < 0.5 ? 'medium' : 'low');
  } else if (type === 'person') {
    severity = hour >= 22 || hour <= 5 ? 'high' : (Math.random() < 0.3 ? 'medium' : 'low');
  } else {
    severity = Math.random() < 0.25 ? 'medium' : 'low';
  }

  // Camera selection based on event type
  let cam;
  if (type === 'restricted_area') {
    const candidates = ['CAM-003', 'CAM-004', 'CAM-008', 'CAM-010', 'CAM-011'];
    const chosenId = candidates[Math.floor(Math.random() * candidates.length)];
    cam = CAMERAS.find(c => c.id === chosenId) || CAMERAS[0];
  } else if (type === 'vehicle') {
    const candidates = ['CAM-001', 'CAM-005', 'CAM-007'];
    const chosenId = candidates[Math.floor(Math.random() * candidates.length)];
    cam = CAMERAS.find(c => c.id === chosenId) || CAMERAS[0];
  } else {
    cam = CAMERAS[Math.floor(Math.random() * CAMERAS.length)] || CAMERAS[0];
  }

  const templates = EVENT_TEMPLATES[type];
  const description = templates[Math.floor(Math.random() * templates.length)];
  const confidence = Number((0.65 + Math.random() * 0.33).toFixed(2));

  const bboxWidth = Math.floor(100 + Math.random() * 140);
  const bboxHeight = Math.floor(140 + Math.random() * 180);
  const bboxX = Math.floor(50 + Math.random() * (640 - bboxWidth - 100));
  const bboxY = Math.floor(50 + Math.random() * (480 - bboxHeight - 100));

  events.push({
    id: `EVT-${(1000 + i).toString()}`,
    type,
    cameraId: cam.id,
    cameraName: cam.name,
    timestamp: eventTime.toISOString(),
    confidence,
    severity,
    description,
    thumbnailUrl: cam.thumbnail,
    boundingBoxes: [
      {
        x: bboxX,
        y: bboxY,
        width: bboxWidth,
        height: bboxHeight,
        label: `${type.toUpperCase()} ${(confidence * 100).toFixed(0)}%`
      }
    ]
  });
}

// Sort descending by timestamp
events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// Generate Alerts from High and Critical events
const alerts = [];
const highAndCritEvents = events.filter(e => e.severity === 'critical' || e.severity === 'high');

// Pick 22 events for alerts
const alertSourceEvents = highAndCritEvents.slice(0, 22);

alertSourceEvents.forEach((evt, idx) => {
  const isAck = idx > 7; // Top 8 are unread/unacknowledged
  const ackTime = isAck ? new Date(new Date(evt.timestamp).getTime() + 1000 * 60 * 12).toISOString() : undefined;

  alerts.push({
    id: `ALT-${(200 + idx).toString()}`,
    eventId: evt.id,
    cameraId: evt.cameraId,
    cameraName: evt.cameraName,
    severity: evt.severity,
    title: evt.severity === 'critical' 
      ? `CRITICAL: ${evt.type.toUpperCase().replace('_', ' ')} BREACH`
      : `HIGH ALERT: Suspicious ${evt.type.replace('_', ' ')} Activity`,
    description: evt.description,
    timestamp: evt.timestamp,
    acknowledged: isAck,
    acknowledgedAt: ackTime
  });
});

alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// Save to files
const dataDir = path.resolve(__dirname);
fs.writeFileSync(path.join(dataDir, 'cameras.json'), JSON.stringify(CAMERAS, null, 2));
fs.writeFileSync(path.join(dataDir, 'events.json'), JSON.stringify(events, null, 2));
fs.writeFileSync(path.join(dataDir, 'alerts.json'), JSON.stringify(alerts, null, 2));

console.log(`Generated:
- ${CAMERAS.length} Cameras in cameras.json
- ${events.length} Events in events.json
- ${alerts.length} Alerts in alerts.json`);
