import React from 'react';
import { cn } from '@/lib/utils';

export interface SquareBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'navy' | 'outline' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const SquareBadge: React.FC<SquareBadgeProps> = ({
  variant = 'gold',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    gold: 'bg-[#D4AF37] text-[#0B132B] font-bold border border-[#F3E5AB]',
    navy: 'bg-[#1C2541] text-[#F3E5AB] border border-[#D4AF37]/50',
    outline: 'bg-transparent text-[#D4AF37] border border-[#D4AF37]',
    success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50',
    danger: 'bg-red-950/80 text-red-300 border border-red-500/50',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-500/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono uppercase tracking-widest rounded-none select-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
