import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface SquareCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
}

export const SquareCheckbox = React.forwardRef<HTMLInputElement, SquareCheckboxProps>(
  ({ label, checked, className, onChange, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded-none border border-[#D4AF37] bg-[#0B132B] flex items-center justify-center transition-all duration-200 group-hover:border-[#F3E5AB]',
              checked && 'bg-[#D4AF37] text-[#0B132B]'
            )}
          >
            {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>
        {label && (
          <span className="text-xs text-gray-200 group-hover:text-[#F3E5AB] transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

SquareCheckbox.displayName = 'SquareCheckbox';
