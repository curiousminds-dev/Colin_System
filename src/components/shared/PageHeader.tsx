import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, count, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 border-b border-border bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-navy">{title}</h1>
          {count !== undefined && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{count}</span>
          )}
        </div>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function ChartCard({ title, subtitle, children, className, action }: ChartCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-white shadow-sm', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-navy">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
