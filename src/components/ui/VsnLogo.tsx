'use client';

import React from 'react';

interface VsnLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VsnLogo: React.FC<VsnLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { img: 'h-8 sm:h-9', text: 'text-sm' },
    md: { img: 'h-10 sm:h-12', text: 'text-base sm:text-lg' },
    lg: { img: 'h-12 sm:h-15', text: 'text-lg sm:text-xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}>
      {/* V S N Elevated 3D Logo Image */}
      <img
        src="/assets/v-s-n-logo.png"
        alt="V S N CASHEWS Logo"
        className={`${currentSize.img} object-contain shrink-0 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:scale-105 transition-all duration-300`}
      />

      {/* Clean elegant text next to logo without any box */}
      <div className="flex flex-col text-left">
        <span className={`font-serif ${currentSize.text} font-extrabold tracking-widest gold-gradient-text leading-none whitespace-nowrap`}>
          CASHEWS
        </span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mt-0.5 whitespace-nowrap">
          Kukatpally • Hyd
        </span>
      </div>
    </div>
  );
};
