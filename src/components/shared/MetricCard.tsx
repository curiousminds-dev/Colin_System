import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function MetricCard({ label, value, icon: Icon, change, changeLabel, iconColor = 'text-cyan-brand', iconBg = 'bg-cyan-light', className }: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <div className={cn('rounded-xl border border-border bg-white p-4 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-navy">{value}</p>
        </div>
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconBg)}>
          <Icon className={cn('h-4.5 w-4.5', iconColor)} style={{ width: 18, height: 18 }} />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', isPositive ? 'text-success' : 'text-danger')}>
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(change)}%
          </span>
          {changeLabel && <span className="text-xs text-slate-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
