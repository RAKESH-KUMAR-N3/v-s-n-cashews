import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { buttonPress } from '@/lib/animations';

export interface SquareButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'gold' | 'navy' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const SquareButton = React.forwardRef<HTMLButtonElement, SquareButtonProps>(
  (
    {
      variant = 'gold',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'rounded-none font-medium tracking-wider uppercase transition-colors inline-flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed border';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-5 py-2.5 text-xs md:text-sm h-11',
      lg: 'px-8 py-3.5 text-sm md:text-base h-14 font-semibold',
    };

    const variantStyles = {
      gold: 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] text-[#0B132B] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]',
      navy: 'bg-[#1C2541] text-[#F3E5AB] border-[#D4AF37]/40 hover:border-[#D4AF37]',
      outline: 'bg-transparent text-[#D4AF37] border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10',
      ghost: 'bg-transparent text-[#F8F9FA] border-transparent hover:text-[#D4AF37] hover:bg-[#1C2541]/50',
      danger: 'bg-red-950 text-red-200 border-red-500/50 hover:bg-red-900',
    };

    return (
      <motion.button
        ref={ref}
        variants={buttonPress}
        initial="rest"
        whileHover={disabled || isLoading ? 'rest' : 'hover'}
        whileTap={disabled || isLoading ? 'rest' : 'tap'}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

SquareButton.displayName = 'SquareButton';
