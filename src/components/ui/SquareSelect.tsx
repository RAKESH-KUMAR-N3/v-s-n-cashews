import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface Option {
  label: string;
  value: string;
}

export interface SquareSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const SquareSelect = React.forwardRef<HTMLSelectElement, SquareSelectProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs uppercase tracking-wider text-[#F3E5AB] font-medium">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            className={cn(
              'w-full rounded-none bg-[#0B132B] text-[#F8F9FA] text-sm px-4 py-3 border border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] appearance-none pr-10 cursor-pointer transition-all duration-200',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0B132B] text-[#F8F9FA]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-[#D4AF37] pointer-events-none" />
        </div>
        {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
      </div>
    );
  }
);

SquareSelect.displayName = 'SquareSelect';
