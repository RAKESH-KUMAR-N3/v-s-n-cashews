import React from 'react';
import { cn } from '@/lib/utils';

export interface SquareSkeletonProps {
  variant?: 'card' | 'text' | 'image' | 'table';
  className?: string;
  count?: number;
}

export const SquareSkeleton: React.FC<SquareSkeletonProps> = ({
  variant = 'text',
  className,
  count = 1,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-none bg-[#1C2541] border border-[#D4AF37]/20 p-5 space-y-4 animate-pulse relative',
              className
            )}
          >
            <div className="w-full h-44 bg-[#0B132B] border border-[#D4AF37]/10" />
            <div className="h-4 bg-[#0B132B] w-3/4" />
            <div className="h-3 bg-[#0B132B] w-1/2" />
            <div className="h-10 bg-[#D4AF37]/20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div
        className={cn(
          'w-full h-64 bg-[#1C2541] border border-[#D4AF37]/20 animate-pulse rounded-none relative',
          className
        )}
      />
    );
  }

  if (variant === 'table') {
    return (
      <div className="w-full space-y-2 border border-[#D4AF37]/30 p-4 bg-[#1C2541] rounded-none animate-pulse">
        <div className="h-8 bg-[#0B132B] w-full" />
        {items.map((_, i) => (
          <div key={i} className="h-10 bg-[#0B132B]/60 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2.5 w-full">
      {items.map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-[#1C2541] border border-[#D4AF37]/20 animate-pulse rounded-none w-full',
            className
          )}
        />
      ))}
    </div>
  );
};
