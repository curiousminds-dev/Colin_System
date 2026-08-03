import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, type ReactNode, useMemo } from 'react';
import { EmptyState } from './States';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
  hidden?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedRowKey?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  density?: 'compact' | 'normal';
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  selectedRowKey,
  loading,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search.',
  pageSize = 10,
  sortKey,
  sortDirection,
  onSort,
  density = 'normal',
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const visibleColumns = columns.filter((c) => !c.hidden);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSort) return;
    const newDir = sortKey === col.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(col.key, newDir);
  };

  const rowPadding = density === 'compact' ? 'py-1.5' : 'py-2.5';

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50/50">
                {visibleColumns.map((c) => (
                  <th key={c.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500" style={{ width: c.width }}>
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {visibleColumns.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      <div className="h-3 w-full max-w-[120px] animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50/60">
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-2.5 text-xs font-semibold text-slate-500 sticky top-0 bg-slate-50/95 backdrop-blur',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.sortable && 'cursor-pointer select-none hover:text-navy',
                  )}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col)}
                >
                  <span className={cn('inline-flex items-center gap-1', col.align === 'right' && 'justify-end')}>
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 text-slate-300" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.map((row) => {
              const key = rowKey(row);
              const isSelected = selectedRowKey === key;
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-border transition-colors',
                    isSelected ? 'bg-cyan-light' : 'hover:bg-slate-50',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {visibleColumns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 text-xs text-navy',
                        rowPadding,
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                      )}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <p className="text-xs text-slate-500">
          Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, data.length)} of {data.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2 text-xs text-slate-500">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useSort<T>(data: T[], initialKey?: string) {
  const [sortKey, setSortKey] = useState(initialKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const sortedData = [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sortedData;
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  return { sorted, sortKey, sortDirection, handleSort };
}
