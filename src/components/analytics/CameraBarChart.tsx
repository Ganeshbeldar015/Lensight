import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface CameraBarChartProps {
  data: Array<{
    camId: string;
    camName: string;
    count: number;
  }>;
}

export const CameraBarChart: React.FC<CameraBarChartProps> = ({ data }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} horizontal={false} />
          <XAxis
            type="number"
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
            fontFamily="monospace"
          />
          <YAxis
            type="category"
            dataKey="camName"
            stroke="#9CA3AF"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              borderColor: '#374151',
              borderRadius: '0.75rem',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#F9FAFB',
            }}
            formatter={(val: any) => [`${val} detections`, 'Events']}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`bar-${index}`}
                fill={index === 0 ? '#10B981' : index === 1 ? '#059669' : '#374151'}
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

