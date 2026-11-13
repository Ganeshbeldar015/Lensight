import type { DetectionEvent, EventType, Severity } from '@/types';
import { INITIAL_CAMERAS } from './cameras';

// Helper to format ISO with deterministic offsets
function getTimestamp(daysAgo: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, Math.floor((hour * 7 + minute * 13) % 60), 0);
  return d.toISOString();
}

interface EventSeed {
  type: EventType;
  severity: Severity;
  camIndex: number;
  hour: number;
  minute: number;
  desc: string;
  confidence: number;
  boxes: Array<{ x: number; y: number; width: number; height: number; label: string }>;
}

// Key prominent events today (including the 5 critical alert triggers)
const KEY_TODAY_EVENTS: EventSeed[] = [
  {
    type: 'restricted_area',
    severity: 'critical',
    camIndex: 6, // Server Room CAM-007
    hour: 15,
    minute: 42,
    desc: 'Unidentified subject bypassed badge gate without RFID clearance in secure server corridor.',
    confidence: 0.97,
    boxes: [{ x: 38, y: 22, width: 24, height: 58, label: 'Person [Unauthorized]' }],
  },
  {
    type: 'restricted_area',
    severity: 'critical',
    camIndex: 14, // Vault Access CAM-015
    hour: 14,
    minute: 19,
    desc: 'Motion and presence detected inside Sub-level 2 vault vestibule outside designated hours.',
    confidence: 0.96,
    boxes: [{ x: 44, y: 30, width: 20, height: 52, label: 'Subject Breach' }],
  },
  {
    type: 'vehicle',
    severity: 'critical',
    camIndex: 11, // West Gate CAM-012
    hour: 13,
    minute: 5,
    desc: 'Tailgating vehicle tailing executive shuttle through barrier gate without stopping for scan.',
    confidence: 0.94,
    boxes: [{ x: 25, y: 35, width: 45, height: 35, label: 'Vehicle [Tailgate]' }],
  },
  {
    type: 'motion',
    severity: 'critical',
    camIndex: 7, // East Perimeter CAM-008
    hour: 11,
    minute: 37,
    desc: 'Fence vibration and thermal silhouette scaling perimeter wire on East boundary line.',
    confidence: 0.92,
    boxes: [{ x: 62, y: 15, width: 18, height: 42, label: 'Fence Intrusion' }],
  },
  {
    type: 'restricted_area',
    severity: 'critical',
    camIndex: 17, // Chemical Storage CAM-018
    hour: 9,
    minute: 24,
    desc: 'Individual entered Hazardous Materials Enclosure without certified PPE badge verification.',
    confidence: 0.98,
    boxes: [{ x: 30, y: 28, width: 22, height: 54, label: 'Person [No PPE]' }],
  },
  // High severity events
  {
    type: 'person',
    severity: 'high',
    camIndex: 0, // Main Entrance CAM-001
    hour: 15,
    minute: 12,
    desc: 'Loitering detected near secondary turnstiles exceeding 8-minute dwelling threshold.',
    confidence: 0.91,
    boxes: [{ x: 48, y: 20, width: 18, height: 62, label: 'Person [Loitering]' }],
  },
  {
    type: 'vehicle',
    severity: 'high',
    camIndex: 1, // Parking Area CAM-002
    hour: 14,
    minute: 50,
    desc: 'Commercial delivery van idling in designated emergency fire lane for >15 minutes.',
    confidence: 0.95,
    boxes: [{ x: 15, y: 40, width: 42, height: 38, label: 'Van [Fire Lane]' }],
  },
  {
    type: 'motion',
    severity: 'high',
    camIndex: 4, // Warehouse CAM-005
    hour: 13,
    minute: 45,
    desc: 'Forklift near-miss warning: moving machinery detected within 2m pedestrian aisle.',
    confidence: 0.89,
    boxes: [{ x: 50, y: 35, width: 30, height: 40, label: 'Forklift Proximity' }],
  },
  {
    type: 'person',
    severity: 'high',
    camIndex: 10, // Research Lab CAM-011
    hour: 12,
    minute: 10,
    desc: 'Dual occupancy detected in single-occupant airlock buffer zone.',
    confidence: 0.93,
    boxes: [{ x: 32, y: 25, width: 34, height: 55, label: 'Multiple Persons' }],
  },
  {
    type: 'restricted_area',
    severity: 'high',
    camIndex: 13, // HVAC Plant CAM-014
    hour: 10,
    minute: 15,
    desc: 'Service hatch opened on mechanical roof deck without maintenance work order.',
    confidence: 0.88,
    boxes: [{ x: 20, y: 45, width: 28, height: 35, label: 'Roof Hatch Access' }],
  },
];

// Generate exactly 145 events for today to match KPI "Events Today: 145"
function generateTodayEvents(): DetectionEvent[] {
  const events: DetectionEvent[] = [];

  // Add the 10 specific key events
  KEY_TODAY_EVENTS.forEach((seed, idx) => {
    const cam = INITIAL_CAMERAS[seed.camIndex % INITIAL_CAMERAS.length];
    events.push({
      id: `EVT-${1000 + idx}`,
      type: seed.type,
      cameraId: cam.id,
      cameraName: cam.name,
      timestamp: getTimestamp(0, seed.hour, seed.minute),
      confidence: seed.confidence,
      severity: seed.severity,
      description: seed.desc,
      thumbnailUrl: cam.thumbnail,
      boundingBoxes: seed.boxes,
    });
  });

  // Generate the remaining 135 events spread across the 24 hours of today
  const types: EventType[] = ['person', 'vehicle', 'motion', 'restricted_area'];
  const severities: Severity[] = ['low', 'medium', 'low', 'low', 'medium', 'high', 'low'];

  const typeDescriptions: Record<EventType, string[]> = {
    person: [
      'Pedestrian passing through transit lobby checkpoint.',
      'Staff member badged through corridor entrance.',
      'Visitor accompanied by host in reception area.',
      'Maintenance personnel accessing mechanical storage.',
      'Courier presenting delivery slip at front counter.',
    ],
    vehicle: [
      'Authorized sedan entered south visitor parking bay.',
      'Logistics delivery truck arrived at loading platform.',
      'Electric shuttle vehicle crossing courtyard roadway.',
      'Staff vehicle exiting parking gate lane 1.',
      'Contractor service truck checked into staging area.',
    ],
    motion: [
      'Ambient lighting fluctuation and perimeter foliage sway.',
      'Conveyor belt startup movement registered in warehouse bay.',
      'Automatic sliding doors cycled open and closed.',
      'Brief optical disturbance detected across optical sensor.',
      'Freight elevator door movement detected on level 2.',
    ],
    restricted_area: [
      'Brief boundary line touch detected along fence perimeter.',
      'Cleaning crew entered lab transition ante-room with keycard.',
      'Unscheduled door contact opened in electrical enclosure.',
      'Perimeter proximity warning triggered along east fence zone.',
      'Staff member entered archival storage room.',
    ],
  };

  for (let i = 10; i < 145; i++) {
    const cam = INITIAL_CAMERAS[i % INITIAL_CAMERAS.length];
    const type = types[(i * 3 + 1) % types.length];
    const severity = severities[i % severities.length];
    
    // Distribute hours between 00:00 and 16:30
    const hour = Math.floor((i * 11) % 17);
    const minute = Math.floor((i * 17) % 60);
    const descs = typeDescriptions[type];
    const desc = descs[i % descs.length];
    const confidence = parseFloat((0.72 + ((i * 7) % 27) / 100).toFixed(2));

    events.push({
      id: `EVT-${1000 + i}`,
      type,
      cameraId: cam.id,
      cameraName: cam.name,
      timestamp: getTimestamp(0, hour, minute),
      confidence,
      severity,
      description: desc,
      thumbnailUrl: cam.thumbnail,
      boundingBoxes: [
        {
          x: 20 + ((i * 5) % 40),
          y: 25 + ((i * 3) % 30),
          width: 15 + ((i * 7) % 25),
          height: 30 + ((i * 9) % 35),
          label: `${type.toUpperCase()} ${(confidence * 100).toFixed(0)}%`,
        },
      ],
    });
  }

  // Sort today's events descending by timestamp
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return events;
}

// Generate historical events for the last 30 days to enrich Analytics and 7d/30d filters
function generateHistoricalEvents(): DetectionEvent[] {
  const events: DetectionEvent[] = [];
  const types: EventType[] = ['person', 'vehicle', 'motion', 'restricted_area'];
  const severities: Severity[] = ['low', 'low', 'medium', 'low', 'high', 'low', 'medium'];

  // Days 1 through 29 ago, approx 40-70 events per day
  let idCounter = 2000;
  for (let day = 1; day <= 30; day++) {
    const dailyCount = 35 + ((day * 13) % 35);
    for (let j = 0; j < dailyCount; j++) {
      const cam = INITIAL_CAMERAS[(day * 3 + j) % INITIAL_CAMERAS.length];
      const type = types[(j * 2 + day) % types.length];
      const severity = severities[(j + day * 2) % severities.length];
      const hour = (j * 3 + day * 5) % 24;
      const minute = (j * 7 + day * 11) % 60;
      const confidence = parseFloat((0.75 + ((j * 5 + day) % 24) / 100).toFixed(2));

      events.push({
        id: `EVT-${idCounter++}`,
        type,
        cameraId: cam.id,
        cameraName: cam.name,
        timestamp: getTimestamp(day, hour, minute),
        confidence,
        severity,
        description: `Historical ${type} telemetry registered on ${cam.name}.`,
        boundingBoxes: [
          {
            x: 25,
            y: 30,
            width: 25,
            height: 40,
            label: `${type.toUpperCase()} ${(confidence * 100).toFixed(0)}%`,
          },
        ],
      });
    }
  }

  return events;
}

export const INITIAL_TODAY_EVENTS = generateTodayEvents();
export const ALL_INITIAL_EVENTS: DetectionEvent[] = [
  ...INITIAL_TODAY_EVENTS,
  ...generateHistoricalEvents(),
];
