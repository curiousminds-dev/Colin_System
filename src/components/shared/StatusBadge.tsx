import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'cyan';

const variantStyles: Record<Variant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-info/10 text-info border-info/20',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  cyan: 'bg-cyan-light text-navy border-cyan/30',
};

interface StatusBadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ variant = 'neutral', children, className, dot }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        variantStyles[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function attendanceStatusBadge(status?: string): { label: string; variant: Variant } {
  switch (status) {
    case 'present':
      return { label: 'Present', variant: 'success' };
    case 'late':
      return { label: 'Late', variant: 'warning' };
    case 'absent':
      return { label: 'Absent', variant: 'danger' };
    case 'excused':
      return { label: 'Excused', variant: 'info' };
    case 'pending':
      return { label: 'Pending', variant: 'neutral' };
    case 'active':
      return { label: 'Active', variant: 'success' };
    case 'revoked':
      return { label: 'Revoked', variant: 'danger' };
    case 'suspended':
      return { label: 'Suspended', variant: 'warning' };
    case 'withdrawn':
      return { label: 'Withdrawn', variant: 'neutral' };
    case 'synced':
      return { label: 'Synced', variant: 'success' };
    case 'syncing':
      return { label: 'Syncing', variant: 'info' };
    case 'failed':
      return { label: 'Failed', variant: 'danger' };
    case 'conflict':
      return { label: 'Conflict', variant: 'danger' };
    case 'disabled':
      return { label: 'Disabled', variant: 'neutral' };
    case 'scheduled':
      return { label: 'Scheduled', variant: 'info' };
    case 'closed':
      return { label: 'Closed', variant: 'neutral' };
    case 'paused':
      return { label: 'Paused', variant: 'warning' };
    case 'open':
      return { label: 'Open', variant: 'warning' };
    case 'reviewed':
      return { label: 'Reviewed', variant: 'info' };
    case 'invited':
      return { label: 'Invited', variant: 'cyan' };
    case 'inactive':
      return { label: 'Inactive', variant: 'neutral' };
    case 'sent':
      return { label: 'Sent', variant: 'success' };
    case 'draft':
      return { label: 'Draft', variant: 'neutral' };
    case 'expired':
      return { label: 'Expired', variant: 'neutral' };
    case 'cancelled':
      return { label: 'Cancelled', variant: 'neutral' };
    case 'completed':
      return { label: 'Completed', variant: 'success' };
    case 'reconciled':
      return { label: 'Reconciled', variant: 'success' };
    case 'unreconciled':
      return { label: 'Unreconciled', variant: 'warning' };
    case 'duplicate':
      return { label: 'Duplicate', variant: 'warning' };
    case 'wrong_class':
      return { label: 'Wrong Class', variant: 'warning' };
    case 'unknown':
      return { label: 'Unknown QR', variant: 'danger' };
    default:
      return { label: status || '—', variant: 'neutral' };
  }
}
