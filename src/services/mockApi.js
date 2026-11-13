import rawCameras from '@/data/cameras.json';
import rawEvents from '@/data/events.json';
import rawAlerts from '@/data/alerts.json';

// In-memory working copies for live interactive mutations
let camerasState = JSON.parse(JSON.stringify(rawCameras));
let eventsState = JSON.parse(JSON.stringify(rawEvents));
let alertsState = JSON.parse(JSON.stringify(rawAlerts));

let simulatedLatencyMs = 450;

export function setSimulatedLatency(ms) {
  simulatedLatencyMs = ms;
}

export function getSimulatedLatency() {
  return simulatedLatencyMs;
}

export function resetToSeedData() {
  camerasState = JSON.parse(JSON.stringify(rawCameras));
  eventsState = JSON.parse(JSON.stringify(rawEvents));
  alertsState = JSON.parse(JSON.stringify(rawAlerts));
}

const sleep = (ms = simulatedLatencyMs) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== CAMERAS API ====================

export async function getCameras() {
  await sleep();
  return [...camerasState];
}

export async function getCameraById(id) {
  await sleep(150);
  return camerasState.find(c => c.id === id);
}

export async function addCamera(data) {
  await sleep(simulatedLatencyMs + 100);
  const nextNum = camerasState.length + 1;
  const newId = `CAM-${nextNum.toString().padStart(3, '0')}`;
  
  const newCamera = {
    id: newId,
    name: data.name,
    location: data.location,
    status: data.status || 'online',
    lastSeen: new Date().toISOString(),
    streamUrl: data.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    zone: data.zone || 'General Sector',
    fps: data.fps || 30,
    resolution: data.resolution || '1080p'
  };

  camerasState = [newCamera, ...camerasState];
  return newCamera;
}

export async function updateCameraStatus(id, status) {
  await sleep(200);
  const index = camerasState.findIndex(c => c.id === id);
  if (index === -1) throw new Error(`Camera ${id} not found`);

  const updated = {
    ...camerasState[index],
    status,
    lastSeen: new Date().toISOString()
  };
  camerasState[index] = updated;
  return updated;
}

export async function deleteCamera(id) {
  await sleep(300);
  camerasState = camerasState.filter(c => c.id !== id);
  return true;
}

// ==================== EVENTS API ====================

export async function getEvents(params = {}) {
  await sleep();

  const {
    filter = {},
    sortBy = 'timestamp',
    sortOrder = 'desc',
    page = 1,
    limit = 15
  } = params;

  let filtered = [...eventsState];

  // 1. Text Search (matches event id, type, camera name, camera id, or description)
  if (filter.searchQuery && filter.searchQuery.trim() !== '') {
    const q = filter.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(e => 
      (e.id && e.id.toLowerCase().includes(q)) ||
      (e.type && e.type.toLowerCase().includes(q)) ||
      (e.type && e.type.replace(/_/g, ' ').toLowerCase().includes(q)) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.cameraId && e.cameraId.toLowerCase().includes(q)) ||
      (e.cameraName && e.cameraName.toLowerCase().includes(q))
    );
  }

  // 2. Event Types
  if (filter.types && filter.types.length > 0) {
    filtered = filtered.filter(e => filter.types.includes(e.type));
  }

  // 3. Severities
  if (filter.severities && filter.severities.length > 0) {
    filtered = filtered.filter(e => filter.severities.includes(e.severity));
  }

  // 4. Cameras
  if (filter.cameraIds && filter.cameraIds.length > 0) {
    filtered = filtered.filter(e => filter.cameraIds.includes(e.cameraId));
  }

  // 5. Date Range
  if (filter.dateRange) {
    const nowMs = Date.now();
    let threshold = 0;

    if (filter.dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      threshold = today.getTime();
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= threshold);
    } else if (filter.dateRange === '24h') {
      threshold = nowMs - 24 * 60 * 60 * 1000;
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= threshold);
    } else if (filter.dateRange === '7d') {
      threshold = nowMs - 7 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= threshold);
    } else if (filter.dateRange === '30d') {
      threshold = nowMs - 30 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= threshold);
    } else if (filter.dateRange === 'custom') {
      if (filter.startDate) {
        const start = new Date(filter.startDate).getTime();
        filtered = filtered.filter(e => new Date(e.timestamp).getTime() >= start);
      }
      if (filter.endDate) {
        const end = new Date(filter.endDate).getTime();
        filtered = filtered.filter(e => new Date(e.timestamp).getTime() <= end);
      }
    }
  }

  // Sorting
  const severityRank = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  filtered.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'confidence') {
      comparison = a.confidence - b.confidence;
    } else if (sortBy === 'severity') {
      comparison = (severityRank[a.severity] || 0) - (severityRank[b.severity] || 0);
    } else {
      comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit;
  const paginated = filtered.slice(startIdx, startIdx + limit);

  return {
    events: paginated,
    total,
    page,
    totalPages
  };
}

export async function getEventById(id) {
  await sleep(150);
  return eventsState.find(e => e.id === id);
}

// ==================== ALERTS API ====================

export async function getAlerts() {
  await sleep();
  return [...alertsState];
}

export async function acknowledgeAlert(id) {
  await sleep(200);
  const idx = alertsState.findIndex(a => a.id === id);
  if (idx === -1) throw new Error(`Alert ${id} not found`);

  const updated = {
    ...alertsState[idx],
    acknowledged: true,
    acknowledgedAt: new Date().toISOString()
  };
  alertsState[idx] = updated;
  return updated;
}

export async function acknowledgeAllAlerts() {
  await sleep(350);
  const nowIso = new Date().toISOString();
  alertsState = alertsState.map(a => 
    a.acknowledged ? a : { ...a, acknowledged: true, acknowledgedAt: nowIso }
  );
  return [...alertsState];
}

// ==================== OVERVIEW & KPIS ====================

export async function getOverviewKpis() {
  await sleep(300);

  const totalCameras = camerasState.length;
  const onlineCount = camerasState.filter(c => c.status === 'online').length;
  const warningCount = camerasState.filter(c => c.status === 'warning').length;
  const offlineCount = camerasState.filter(c => c.status === 'offline').length;
  const activeCameras = onlineCount;

  // Events today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();

  const eventsToday = eventsState.filter(e => new Date(e.timestamp).getTime() >= todayTimestamp).length;

  // Unacknowledged critical alerts
  const criticalAlerts = alertsState.filter(a => a.severity === 'critical' && !a.acknowledged).length;

  return {
    totalCameras,
    activeCameras,
    eventsToday,
    criticalAlerts,
    onlineCount,
    offlineCount,
    warningCount
  };
}

// ==================== ANALYTICS API ====================

export async function getAnalyticsData(range) {
  await sleep(simulatedLatencyMs + 50);

  const now = Date.now();
  let threshold = now - 7 * 24 * 60 * 60 * 1000;
  if (range === 'today') {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    threshold = t.getTime();
  } else if (range === '24h') {
    threshold = now - 24 * 60 * 60 * 1000;
  } else if (range === '7d') {
    threshold = now - 7 * 24 * 60 * 60 * 1000;
  } else if (range === '30d') {
    threshold = now - 30 * 24 * 60 * 60 * 1000;
  }

  const inRangeEvents = eventsState.filter(e => new Date(e.timestamp).getTime() >= threshold);
  const totalEvents = inRangeEvents.length;

  // Average confidence
  const avgConf = totalEvents > 0 
    ? inRangeEvents.reduce((acc, e) => acc + e.confidence, 0) / totalEvents
    : 0;

  // Peak hour calculation
  const hourCounts = {};
  inRangeEvents.forEach(e => {
    const h = new Date(e.timestamp).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });

  let peakH = 14;
  let maxCount = -1;
  Object.entries(hourCounts).forEach(([h, count]) => {
    if (count > maxCount) {
      maxCount = count;
      peakH = Number(h);
    }
  });
  const peakHourStr = `${peakH.toString().padStart(2, '0')}:00 - ${(peakH + 1).toString().padStart(2, '0')}:00`;

  // Busiest camera calculation
  const camEventCounts = {};
  inRangeEvents.forEach(e => {
    camEventCounts[e.cameraId] = (camEventCounts[e.cameraId] || 0) + 1;
  });

  let topCamId = 'CAM-001';
  let topCamCount = 0;
  Object.entries(camEventCounts).forEach(([camId, c]) => {
    if (c > topCamCount) {
      topCamCount = c;
      topCamId = camId;
    }
  });

  const topCam = camerasState.find(c => c.id === topCamId) || { id: topCamId, name: 'Main Camera' };

  // Category breakdown
  const categoryCounts = {
    person: 0,
    vehicle: 0,
    motion: 0,
    restricted_area: 0
  };

  inRangeEvents.forEach(e => {
    if (categoryCounts[e.type] !== undefined) {
      categoryCounts[e.type]++;
    }
  });

  const categoryBreakdown = [
    { name: 'Person', value: categoryCounts.person, color: '#fa5d19' },
    { name: 'Vehicle', value: categoryCounts.vehicle, color: '#2a6dfb' },
    { name: 'Motion', value: categoryCounts.motion, color: '#ecb730' },
    { name: 'Restricted Area', value: categoryCounts.restricted_area, color: '#eb3424' }
  ];

  // Events over time buckets
  const eventsOverTime = [];

  if (range === 'today' || range === '24h') {
    for (let i = 23; i >= 0; i--) {
      const bStart = new Date(now - (i + 1) * 60 * 60 * 1000);
      const bEnd = new Date(now - i * 60 * 60 * 1000);
      const matched = inRangeEvents.filter(e => {
        const t = new Date(e.timestamp).getTime();
        return t >= bStart.getTime() && t < bEnd.getTime();
      });
      eventsOverTime.push({
        label: `${bEnd.getHours()}:00`,
        timestamp: bEnd.toISOString(),
        count: matched.length,
        critical: matched.filter(e => e.severity === 'critical').length
      });
    }
  } else {
    const numDays = range === '7d' ? 7 : 30;
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const matched = inRangeEvents.filter(e => {
        const evDate = new Date(e.timestamp);
        return evDate.getDate() === d.getDate() && evDate.getMonth() === d.getMonth();
      });
      eventsOverTime.push({
        label: dateStr,
        timestamp: d.toISOString(),
        count: matched.length,
        critical: matched.filter(e => e.severity === 'critical').length
      });
    }
  }

  // Camera distribution ranking
  const cameraDistribution = Object.entries(camEventCounts)
    .map(([camId, count]) => {
      const c = camerasState.find(cam => cam.id === camId);
      return {
        id: camId,
        name: c ? c.name : camId,
        count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalEvents,
    averageConfidence: Number((avgConf * 100).toFixed(1)),
    peakHour: peakHourStr,
    busiestCamera: {
      id: topCam.id,
      name: topCam.name,
      count: topCamCount
    },
    eventsOverTime,
    categoryBreakdown,
    cameraDistribution
  };
}
