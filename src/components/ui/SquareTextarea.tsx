import React from 'react';
import { cn } from '@/lib/utils';

export interface SquareTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const SquareTextarea = React.forwardRef<HTMLTextAreaElement, SquareTextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs uppercase tracking-wider text-[#F3E5AB] font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-none bg-[#0B132B] text-[#F8F9FA] placeholder:text-gray-500 text-sm p-4 border border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all duration-200 min-h-[100px] resize-y',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
        {!error && helperText && <span className="text-[11px] text-gray-400">{helperText}</span>}
      </div>
    );
  }
);

SquareTextarea.displayName = 'SquareTextarea';
