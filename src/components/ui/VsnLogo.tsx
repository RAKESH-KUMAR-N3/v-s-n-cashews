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
  showText = false,
}) => {
  const sizeMap = {
    sm: 'h-8 sm:h-9 max-w-[90px]',
    md: 'h-9 sm:h-12 max-w-[130px]',
    lg: 'h-12 sm:h-16 max-w-[180px]',
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}>
      {/* V S N Elevated 3D Logo Image */}
      <img
        src="/assets/v-s-n-logo.png"
        alt="V S N CASHEWS Logo"
        className={`${currentSize} object-contain shrink-0 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-all duration-300`}
      />

      {showText && (
        <div className="hidden md:flex flex-col text-left">
          <span className="font-serif text-lg font-black tracking-wider text-[#F8F9FA] group-hover:text-[#D4AF37] transition-colors leading-none whitespace-nowrap">
            V S N CASHEWS
          </span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold mt-1 whitespace-nowrap">
            Kukatpally • Hyderabad
          </span>
        </div>
      )}
    </div>
  );
};
