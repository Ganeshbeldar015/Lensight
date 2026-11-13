import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { EventsLineChart } from '@/components/analytics/EventsLineChart';
import { EventCategoryChart } from '@/components/analytics/EventCategoryChart';
import { CameraBarChart } from '@/components/analytics/CameraBarChart';
import { SeverityDistributionChart } from '@/components/analytics/SeverityDistributionChart';
import type { EventType, Severity } from '@/types';
import {
  TrendingUp,
  Camera,
  Activity,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { events, cameras } = useApp();
  const [datePreset, setDatePreset] = useState<'today' | '7d' | '30d'>('today');

  // Filter events based on active date preset
  const filteredEvents = useMemo(() => {
    const now = new Date().getTime();
    return events.filter((evt) => {
      const evtTime = new Date(evt.timestamp).getTime();
      if (datePreset === 'today') {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        return evtTime >= startOfToday.getTime();
      } else if (datePreset === '7d') {
        return now - evtTime <= 7 * 24 * 60 * 60 * 1000;
      } else if (datePreset === '30d') {
        return now - evtTime <= 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  }, [events, datePreset]);

  // Summary Metrics calculations
  const totalEvents = filteredEvents.length;

  const avgDailyEvents = useMemo(() => {
    if (datePreset === 'today') return totalEvents;
    const days = datePreset === '7d' ? 7 : 30;
    return Math.round(totalEvents / days);
  }, [totalEvents, datePreset]);

  const mostActiveCamera = useMemo(() => {
    if (filteredEvents.length === 0) return { name: 'N/A', count: 0 };
    const counts: Record<string, number> = {};
    filteredEvents.forEach((e) => {
      const name = e.cameraName || e.cameraId;
      counts[name] = (counts[name] || 0) + 1;
    });
    let topName = 'N/A';
    let max = 0;
    Object.entries(counts).forEach(([name, count]) => {
      if (count > max) {
        max = count;
        topName = name;
      }
    });
    return { name: topName, count: max };
  }, [filteredEvents]);

  const mostFrequentType = useMemo(() => {
    if (filteredEvents.length === 0) return { label: 'N/A', count: 0 };
    const counts: Record<EventType, number> = {
      person: 0,
      vehicle: 0,
      motion: 0,
      restricted_area: 0,
    };
    filteredEvents.forEach((e) => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });
    const typeLabels: Record<EventType, string> = {
      person: 'Person Detected',
      vehicle: 'Vehicle Detected',
      motion: 'Motion Detected',
      restricted_area: 'Restricted Area',
    };
    let topType: EventType = 'person';
    let max = -1;
    (Object.keys(counts) as EventType[]).forEach((t) => {
      if (counts[t] > max) {
        max = counts[t];
        topType = t;
      }
    });
    return { label: typeLabels[topType], count: max };
  }, [filteredEvents]);

  const avgConfidence = useMemo(() => {
    if (filteredEvents.length === 0) return 0;
    const sum = filteredEvents.reduce((acc, e) => acc + e.confidence, 0);
    return Math.round((sum / filteredEvents.length) * 100);
  }, [filteredEvents]);

  // Chart 1: Events Over Time
  const eventsOverTime = useMemo(() => {
    if (datePreset === 'today') {
      const buckets = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
      return buckets.map((bucket, i) => {
        const hourStart = i * 3;
        const hourEnd = hourStart + 3;
        const bucketEvents = filteredEvents.filter((e) => {
          const h = new Date(e.timestamp).getHours();
          return h >= hourStart && h < hourEnd;
        });
        return {
          time: bucket,
          person: bucketEvents.filter((e) => e.type === 'person').length,
          vehicle: bucketEvents.filter((e) => e.type === 'vehicle').length,
          motion: bucketEvents.filter((e) => e.type === 'motion').length,
          restricted_area: bucketEvents.filter((e) => e.type === 'restricted_area').length,
          total: bucketEvents.length,
        };
      });
    } else {
      const daysCount = datePreset === '7d' ? 7 : 14;
      const result = [];
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayStart = new Date(d);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(d);
        dayEnd.setHours(23, 59, 59, 999);

        const bucketEvents = filteredEvents.filter((e) => {
          const t = new Date(e.timestamp).getTime();
          return t >= dayStart.getTime() && t <= dayEnd.getTime();
        });

        result.push({
          time: dayStr,
          person: bucketEvents.filter((e) => e.type === 'person').length,
          vehicle: bucketEvents.filter((e) => e.type === 'vehicle').length,
          motion: bucketEvents.filter((e) => e.type === 'motion').length,
          restricted_area: bucketEvents.filter((e) => e.type === 'restricted_area').length,
          total: bucketEvents.length,
        });
      }
      return result;
    }
  }, [filteredEvents, datePreset]);

  // Chart 2: Category Breakdown
  const categoryData = useMemo(() => {
    const counts = {
      person: filteredEvents.filter((e) => e.type === 'person').length,
      vehicle: filteredEvents.filter((e) => e.type === 'vehicle').length,
      motion: filteredEvents.filter((e) => e.type === 'motion').length,
      restricted_area: filteredEvents.filter((e) => e.type === 'restricted_area').length,
    };
    return [
      { name: 'Person', value: counts.person, color: '#3B82F6' },
      { name: 'Vehicle', value: counts.vehicle, color: '#A855F7' },
      { name: 'Motion', value: counts.motion, color: '#10B981' },
      { name: 'Restricted Area', value: counts.restricted_area, color: '#F43F5E' },
    ];
  }, [filteredEvents]);

  // Chart 3: Camera-wise event count (Top 6 cameras)
  const cameraWiseData = useMemo(() => {
    const counts: Record<string, { camId: string; camName: string; count: number }> = {};
    cameras.forEach((c) => {
      counts[c.id] = { camId: c.id, camName: c.name, count: 0 };
    });
    filteredEvents.forEach((e) => {
      if (counts[e.cameraId]) {
        counts[e.cameraId].count += 1;
      }
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredEvents, cameras]);

  // Chart 4: Severity Distribution
  const severityData = useMemo(() => {
    const counts = {
      critical: filteredEvents.filter((e) => e.severity === 'critical').length,
      high: filteredEvents.filter((e) => e.severity === 'high').length,
      medium: filteredEvents.filter((e) => e.severity === 'medium').length,
      low: filteredEvents.filter((e) => e.severity === 'low').length,
    };
    return [
      { severity: 'critical' as Severity, label: 'Critical Severity', count: counts.critical, color: '#EF4444' },
      { severity: 'high' as Severity, label: 'High Severity', count: counts.high, color: '#F97316' },
      { severity: 'medium' as Severity, label: 'Medium Severity', count: counts.medium, color: '#F59E0B' },
      { severity: 'low' as Severity, label: 'Low / Informational', count: counts.low, color: '#10B981' },
    ];
  }, [filteredEvents]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header with Date Presets */}
      <PageHeader
        title="Intelligence Analytics"
        subtitle="Computed temporal patterns, neural classification trends, and telemetry distribution"
        breadcrumbs={[{ label: 'Lensight' }, { label: 'Analytics' }]}
        actions={
          <div className="flex rounded-xl bg-[#1F2937] p-1 border border-[#374151]">
            <button
              onClick={() => setDatePreset('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                datePreset === 'today'
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDatePreset('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                datePreset === '7d'
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDatePreset('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                datePreset === '30d'
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        }
      />

      {/* Analytics Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Events"
          value={totalEvents}
          icon={Activity}
          subtext={`Within ${datePreset === 'today' ? 'today' : datePreset}`}
          trend={{ value: 'Live Dataset', isNeutral: true }}
          indicatorColor="emerald"
        />

        <StatCard
          label="Daily Average"
          value={avgDailyEvents}
          icon={TrendingUp}
          subtext="Mean events per 24h cycle"
          trend={{ value: 'Normalized', isNeutral: true }}
          indicatorColor="blue"
        />

        <StatCard
          label="Most Active Camera"
          value={mostActiveCamera.name.split(' ')[0]}
          icon={Camera}
          subtext={`${mostActiveCamera.count} detections (${mostActiveCamera.name})`}
          trend={{ value: 'Peak Node', isPositive: true }}
          indicatorColor="amber"
        />

        <StatCard
          label="Most Frequent Event"
          value={mostFrequentType.label.split(' ')[0]}
          icon={Sparkles}
          subtext={`${mostFrequentType.count} detections • ${avgConfidence}% avg conf`}
          trend={{ value: `${avgConfidence}% Accuracy`, isPositive: true }}
          indicatorColor="emerald"
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Events Over Time */}
        <div className="lg:col-span-8 bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Detection Volume Over Time
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Aggregate trend and neural object breakdown for selected duration
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              RECHARTS RENDER ENGINE
            </span>
          </div>

          <EventsLineChart data={eventsOverTime} />
        </div>

        {/* Chart 2: Event Categories */}
        <div className="lg:col-span-4 bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              Event Categories
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Classification share among Person, Vehicle, Motion & Perimeter
            </p>
          </div>

          <EventCategoryChart data={categoryData} />
        </div>

        {/* Chart 3: Camera-wise Event Count */}
        <div className="lg:col-span-7 bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              Camera-Wise Event Activity
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Top surveillance camera nodes ranked by detection volume
            </p>
          </div>

          <CameraBarChart data={cameraWiseData} />
        </div>

        {/* Chart 4: Severity Distribution */}
        <div className="lg:col-span-5 bg-[#1F2937] border border-[#374151] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Severity Tier Distribution
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Proportional distribution of threat levels across detected events
            </p>
          </div>

          <SeverityDistributionChart data={severityData} />
        </div>
      </div>
    </div>
  );
};
