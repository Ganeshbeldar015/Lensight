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
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Insights"
        description="Temporal trends, detection volume distribution, and camera load metrics."
        badge={
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF5EF] border border-[#16845B]/20 text-[#16845B] font-semibold flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Security Intelligence
          </span>
        }
        actions={
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-[#E5E7EB]">
            <Calendar className="w-3.5 h-3.5 text-[#64748B] ml-2 mr-1" />
            {['today', '24h', '7d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded text-xs uppercase font-medium transition-colors cursor-pointer ${
                  range === r
                    ? 'bg-[#16845B] text-white font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2937]'
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
            <Card className="bg-white border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider">
                <span>Total Detections</span>
                <TrendingUp className="w-4 h-4 text-[#16845B]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1F2937]">
                {data.totalEvents}
              </div>
              <p className="text-xs text-[#64748B] mt-1">in selected window</p>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider">
                <span>Avg Confidence</span>
                <ShieldCheck className="w-4 h-4 text-[#16845B]" />
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1F2937]">
                {data.averageConfidence}%
              </div>
              <p className="text-xs text-[#16845B] mt-1 font-medium">Detection reliability</p>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider">
                <span>Peak Activity Hour</span>
                <Clock className="w-4 h-4 text-[#D99A26]" />
              </div>
              <div className="mt-2 text-xl font-bold text-[#1F2937] truncate">
                {data.peakHour}
              </div>
              <p className="text-xs text-[#64748B] mt-1">Highest event volume</p>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold uppercase tracking-wider">
                <span>Most Active Camera</span>
                <Camera className="w-4 h-4 text-[#4B83C5]" />
              </div>
              <div className="mt-2 text-base font-bold text-[#1F2937] truncate" title={data.busiestCamera.name}>
                {data.busiestCamera.name}
              </div>
              <p className="text-xs text-[#4B83C5] mt-1 font-medium">
                {data.busiestCamera.count} events logged
              </p>
            </Card>
          </div>

          {/* Events Over Time Chart */}
          <Card className="p-5 bg-white border-[#E5E7EB] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#1F2937]">
                  Detection Activity Over Time
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Hourly or daily event frequencies segmented by critical severity breaches.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-[#16845B] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#16845B]" /> Total Events
                </span>
                <span className="flex items-center gap-1.5 text-[#DC5656] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#DC5656]" /> Critical Alerts
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.eventsOverTime}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16845B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#16845B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5E7EB',
                      borderRadius: '8px',
                      color: '#1F2937',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Total Events"
                    stroke="#16845B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="critical"
                    name="Critical Alerts"
                    stroke="#DC5656"
                    strokeWidth={2}
                    fillOpacity={0.15}
                    fill="#DC5656"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Categories Donut */}
            <Card className="p-5 bg-white border-[#E5E7EB] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1F2937] flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#16845B]" />
                  Event Category Distribution
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Proportional breakdown of classified event categories.
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
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#1F2937',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-xs text-[#1F2937] font-medium">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Camera-Wise Event Count Horizontal Bar */}
            <Card className="p-5 bg-white border-[#E5E7EB] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#1F2937] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#16845B]" />
                  Camera-Wise Activity Density
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Top surveillance nodes sorted by detection frequency.
                </p>
              </div>

              <div className="h-64 w-full my-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.cameraDistribution} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis
                      dataKey="id"
                      type="category"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      width={65}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#1F2937',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                      }}
                      formatter={(val, name, item) => [
                        `${val} detections`,
                        item.payload.name
                      ]}
                    />
                    <Bar dataKey="count" fill="#16845B" radius={[0, 4, 4, 0]} />
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
