import React from 'react';
import type { Severity } from '@/types';

interface SeverityDistributionProps {
  data: Array<{
    severity: Severity;
    label: string;
    count: number;
    color: string;
  }>;
}

export const SeverityDistributionChart: React.FC<SeverityDistributionProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.severity} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#F9FAFB] flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
                <span className="font-mono text-[#9CA3AF]">
                  <strong className="text-[#F9FAFB]">{item.count}</strong> ({percent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-[#111827] rounded-full overflow-hidden border border-[#374151]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
