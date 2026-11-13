import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface EventCategoryChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const EventCategoryChart: React.FC<EventCategoryChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-72">
      <div className="h-full w-full sm:w-1/2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1F2937" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                borderRadius: '0.75rem',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#F9FAFB',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-mono text-[#F9FAFB]">{total}</span>
          <span className="text-[10px] uppercase font-mono text-[#9CA3AF]">Detections</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="w-full sm:w-1/2 space-y-2.5">
        {data.map((item) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#9CA3AF] font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[#F9FAFB] font-semibold">{item.value}</span>
                <span className="text-[11px] text-[#6B7280]">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

