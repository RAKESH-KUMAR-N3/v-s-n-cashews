import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  aspectRatio?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800',
  aspectRatio,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden bg-[#1C2541]/50 ${className}`} style={aspectRatio ? { aspectRatio } : undefined}>
      {/* Blur / Skeleton Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C2541] via-[#2A365C] to-[#1C2541] animate-pulse" />
      )}

      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
