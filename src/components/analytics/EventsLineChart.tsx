import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface EventsLineChartProps {
  data: Array<{
    time: string;
    person: number;
    vehicle: number;
    motion: number;
    restricted_area: number;
    total: number;
  }>;
}

export const EventsLineChart: React.FC<EventsLineChartProps> = ({ data }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorPerson" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorVehicle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A855F7" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.4} vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
            fontFamily="monospace"
          />
          <YAxis
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            fontFamily="monospace"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              borderColor: '#374151',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#F9FAFB',
            }}
            itemStyle={{ padding: '2px 0' }}
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Total Events"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
          <Area
            type="monotone"
            dataKey="person"
            name="Person"
            stroke="#3B82F6"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorPerson)"
          />
          <Area
            type="monotone"
            dataKey="vehicle"
            name="Vehicle"
            stroke="#A855F7"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorVehicle)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

