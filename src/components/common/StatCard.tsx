import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  indicatorColor?: 'emerald' | 'amber' | 'red' | 'blue';
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  trend,
  indicatorColor = 'emerald',
  highlight = false,
}) => {
  const indicatorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const dotColors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

  return (
    <div
      className={`relative rounded-xl border p-5 transition-all duration-200 ${
        highlight
          ? 'bg-[#1F2937] border-red-500/40 shadow-lg shadow-red-500/5'
          : 'bg-[#1F2937] border-[#374151] hover:border-[#4B5563]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium tracking-wide uppercase text-[#9CA3AF]">
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#F9FAFB]">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-mono font-medium ${
                  trend.isNeutral
                    ? 'text-[#9CA3AF]'
                    : trend.isPositive
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtext && <p className="mt-1 text-xs text-[#6B7280]">{subtext}</p>}
        </div>

        <div className={`p-3 rounded-lg border ${indicatorStyles[indicatorColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#374151]/60 flex items-center justify-between text-[11px] text-[#9CA3AF]">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColors[indicatorColor]}`} />
          <span>System Status</span>
        </div>
        <span className="font-mono text-[#6B7280]">Real-time Sync</span>
      </div>
    </div>
  );
};

