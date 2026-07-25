'use client';

import React from 'react';

interface CashewNutParticleProps {
  className?: string;
  size?: number;
  variant?: number;
}

const KAJU_ICONS = [
  '/assets/kaju-icon.png',
  '/assets/kaju-icon-1.png',
  '/assets/kaju-icon-2.png',
];

export const CashewNutParticle: React.FC<CashewNutParticleProps> = ({
  className = '',
  size = 28,
  variant = 0,
}) => {
  const iconSrc = KAJU_ICONS[Math.abs(variant) % KAJU_ICONS.length] || KAJU_ICONS[0];

  return (
    <img
      src={iconSrc}
      alt="Cashew Nut"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`inline-block object-contain filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.6)] ${className}`}
    />
  );
};

