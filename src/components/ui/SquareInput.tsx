import React from 'react';
import { cn } from '@/lib/utils';

export interface SquareInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const SquareInput = React.forwardRef<HTMLInputElement, SquareInputProps>(
  ({ label, error, icon, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs uppercase tracking-wider text-[#F3E5AB] font-medium">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-[#D4AF37] pointer-events-none">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-none bg-[#0B132B] text-[#F8F9FA] placeholder:text-gray-500 text-sm px-4 py-3 border border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all duration-200',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
        {!error && helperText && <span className="text-[11px] text-gray-400">{helperText}</span>}
      </div>
    );
  }
);

SquareInput.displayName = 'SquareInput';
