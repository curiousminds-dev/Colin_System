import { cn } from '@/lib/utils';
import { AlertCircle, Inbox, Loader2, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-navy">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" className="mt-4" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = 'Something went wrong', description = 'We could not load this data. Please try again.', onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
        <AlertCircle className="h-6 w-6 text-danger" />
      </div>
      <h3 className="text-sm font-semibold text-navy">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p>
      {onRetry && <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <Loader2 className="h-6 w-6 animate-spin text-cyan-brand" />
    </div>
  );
}

export function PermissionDenied({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
        <ShieldAlert className="h-8 w-8 text-warning" />
      </div>
      <h3 className="text-lg font-semibold text-navy">Access Restricted</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {message || 'You do not have permission to view this section. Please contact your school administrator if you believe this is an error.'}
      </p>
    </div>
  );
}

export function SensitiveDataNotice({ message }: { message?: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/5 px-3.5 py-2.5">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-xs text-slate-600">
        {message || 'This section contains confidential information. Access is restricted to authorised staff only. Do not share or screenshot this content.'}
      </p>
    </div>
  );
}
