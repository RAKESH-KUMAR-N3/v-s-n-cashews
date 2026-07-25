import React from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface SquareTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
}

export function SquareTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No records found.',
  className,
}: SquareTableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto border border-[#D4AF37]/40 rounded-none bg-[#0B132B]', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#1C2541] border-b border-[#D4AF37]/40">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  'px-4 py-3 text-xs font-serif font-bold uppercase tracking-wider text-[#D4AF37]',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D4AF37]/20">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-[#1C2541]/50 transition-colors group"
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={cn('px-4 py-3.5 text-xs text-gray-200', col.className)}>
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
