import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

export interface SquareCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  glowOnHover?: boolean;
  variant?: 'navy' | 'gold-subtle' | 'bordered';
  children: React.ReactNode;
}

export const SquareCard: React.FC<SquareCardProps> = ({
  glowOnHover = false,
  variant = 'navy',
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    navy: 'bg-[#1C2541]/90 border-[#D4AF37]/30 text-[#F8F9FA]',
    'gold-subtle': 'bg-[#1C2541]/50 border-[#D4AF37]/50 text-[#F8F9FA]',
    bordered: 'bg-[#0B132B] border-[#D4AF37]/40 text-[#F8F9FA]',
  };

  return (
    <motion.div
      whileHover={glowOnHover ? { y: -4, borderColor: '#D4AF37' } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'rounded-none border p-5 relative transition-shadow duration-300',
        variantStyles[variant],
        glowOnHover && 'hover:shadow-[0_0_25px_rgba(212,175,55,0.2)]',
        className
      )}
      {...props}
    >
      {/* Royal Gold Corner Accents - Square Geometry */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37]" />
      {children}
    </motion.div>
  );
};
