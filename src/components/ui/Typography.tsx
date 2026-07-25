import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'display' | 'body' | 'body-sm' | 'caption' | 'gold-gradient';
  as?: React.ElementType;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  className,
  children,
  ...props
}) => {
  const Component = as || (
    variant === 'display' || variant === 'h1' ? 'h1' :
    variant === 'h2' ? 'h2' :
    variant === 'h3' ? 'h3' :
    variant === 'h4' ? 'h4' :
    variant === 'h5' ? 'h5' :
    variant === 'h6' ? 'h6' :
    variant === 'caption' ? 'span' : 'p'
  );

  const styles = {
    display: 'font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8F9FA]',
    h1: 'font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F9FA]',
    h2: 'font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#F8F9FA]',
    h3: 'font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#F3E5AB]',
    h4: 'font-serif text-lg font-bold tracking-wider text-[#F3E5AB]',
    h5: 'font-serif text-base font-semibold tracking-wider text-[#F8F9FA]',
    h6: 'font-serif text-sm font-semibold tracking-wider text-[#D4AF37]',
    body: 'text-sm sm:text-base text-gray-200 leading-relaxed font-sans',
    'body-sm': 'text-xs sm:text-sm text-gray-300 leading-relaxed font-sans',
    caption: 'text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold',
    'gold-gradient': 'font-serif text-2xl sm:text-4xl font-extrabold gold-gradient-text tracking-wide',
  };

  return (
    <Component className={cn(styles[variant], className)} {...props}>
      {children}
    </Component>
  );
};
