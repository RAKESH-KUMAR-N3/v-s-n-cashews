'use client';

import React from 'react';

interface VsnLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const VsnLogo: React.FC<VsnLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: 'h-10 sm:h-11 max-w-[125px]',
    md: 'h-12 sm:h-15 max-w-[155px]',
    lg: 'h-15 sm:h-18 max-w-[210px]',
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}>
      {/* V S N Elevated 3D Logo Image (Increased size by 2%) */}
      <img
        src="/assets/v-s-n-logo.png"
        alt="V S N CASHEWS Logo"
        className={`${currentSize} object-contain shrink-0 drop-shadow-[0_0_20px_rgba(212,175,55,0.65)] group-hover:scale-105 transition-all duration-300`}
      />

      {/* Royal Gold Badge reading CASHEWS right next to logo */}
      <div className="flex items-center bg-[#1C2541]/90 border border-[#D4AF37] px-2.5 py-0.5 shadow-[0_0_12px_rgba(212,175,55,0.3)] group-hover:border-[#F3E5AB] transition-colors">
        <span className="font-serif text-xs sm:text-sm font-extrabold tracking-widest text-[#F3E5AB] group-hover:text-[#D4AF37] uppercase whitespace-nowrap">
          CASHEWS
        </span>
      </div>
    </div>
  );
};
