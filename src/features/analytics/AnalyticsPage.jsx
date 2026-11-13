import React, { useState, useEffect } from 'react';
import { dataProvider } from '@/services/dataProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  PieChart as PieIcon, 
  Camera, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const AnalyticsPage = () => {
  const [range, setRange] = useState('7d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dataProvider.getAnalyticsData(range);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Surveillance Analytics & Telemetry"
        description="Temporal trends, AI classification density, and camera load distribution metrics."
        badge={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-1.5 font-bold">
            <BarChart3 className="w-3.5 h-3.5" />
            TELEMETRY ENGINE
          </span>
        }
        actions={
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
            {['today', '24h', '7d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
                  range === r
                    ? 'bg-[#fa5d19] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchAnalytics} />
      ) : loading || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Summary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-semibold">
                <span>TOTAL DETECTIONS</span>
                <TrendingUp className="w-4 h-4 text-[#fa5d19]" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
                {data.totalEvents}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">in selected window</p>
            </Card>

            <Card className="bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-semibold">
                <span>AVG CONFIDENCE</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
                {data.averageConfidence}%
              </div>
              <p className="text-[11px] text-emerald-600 font-mono mt-1 font-medium">Classification reliability</p>
            </Card>

            <Card className="bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-semibold">
                <span>PEAK ACTIVITY HOUR</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 text-xl font-extrabold text-slate-900 font-mono truncate">
                {data.peakHour}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Highest detection volume</p>
            </Card>

            <Card className="bg-white border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-semibold">
                <span>BUSIEST SENSOR</span>
                <Camera className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-2 text-base font-bold text-slate-900 truncate" title={data.busiestCamera.name}>
                {data.busiestCamera.name}
              </div>
              <p className="text-[11px] text-blue-600 font-mono mt-1 font-medium">
                {data.busiestCamera.count} events logged
              </p>
            </Card>
          </div>

          {/* Events Over Time Chart */}
          <Card className="p-5 bg-white border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Detection Events Over Time
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hourly or daily event frequencies segmented by critical severity breaches.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#fa5d19] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#fa5d19]" /> Total Events
                </span>
                <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-600" /> Critical
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.eventsOverTime}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fa5d19" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fa5d19" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Total Events"
                    stroke="#fa5d19"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="critical"
                    name="Critical Alerts"
                    stroke="#dc2626"
                    strokeWidth={2}
                    fillOpacity={0.2}
                    fill="#dc2626"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Categories Donut */}
            <Card className="p-5 bg-white border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#fa5d19]" />
                  Event Category Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proportional breakdown of classified threat categories.
                </p>
              </div>

              <div className="h-64 w-full my-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {data.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#0f172a',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-xs text-slate-700 font-mono">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Camera-Wise Event Count Horizontal Bar */}
            <Card className="p-5 bg-white border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#fa5d19]" />
                  Camera-Wise Activity Density
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Top surveillance nodes sorted by detection frequency.
                </p>
              </div>

              <div className="h-64 w-full my-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.cameraDistribution} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis
                      dataKey="id"
                      type="category"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      width={65}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#0f172a',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(val, name, item) => [
                        `${val} detections`,
                        item.payload.name
                      ]}
                    />
                    <Bar dataKey="count" fill="#fa5d19" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
