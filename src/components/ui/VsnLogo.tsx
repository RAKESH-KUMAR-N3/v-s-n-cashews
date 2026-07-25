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
    sm: { img: 'h-9 sm:h-10', text: 'text-sm sm:text-base' },
    md: { img: 'h-11 sm:h-13', text: 'text-base sm:text-lg' },
    lg: { img: 'h-14 sm:h-16', text: 'text-lg sm:text-xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}>
      {/* V S N Elevated 3D Logo Image */}
      <img
        src="/assets/v-s-n-logo.png"
        alt="V S N CASHEWS Logo"
        className={`${currentSize.img} object-contain shrink-0 drop-shadow-[0_0_18px_rgba(212,175,55,0.7)] group-hover:scale-105 transition-all duration-300`}
      />

      {/* Clean elegant gold CASHEWS typography without Kukatpally text */}
      <div className="flex flex-col text-left">
        <span className={`font-serif ${currentSize.text} font-black tracking-[0.18em] gold-gradient-text leading-none whitespace-nowrap uppercase`}>
          CASHEWS
        </span>
      </div>
    </div>
  );
};
