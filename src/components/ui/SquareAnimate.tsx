'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { fadeIn, slideUp, slideInRight, slideInLeft, scaleUp, staggerContainer } from '@/lib/animations';

export interface SquareAnimateProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'fade' | 'slide-up' | 'slide-right' | 'slide-left' | 'scale' | 'stagger';
  delay?: number;
  children: React.ReactNode;
}

export const SquareAnimate: React.FC<SquareAnimateProps> = ({
  variant = 'fade',
  delay = 0,
  children,
  className,
  ...props
}) => {
  const variants = {
    fade: fadeIn,
    'slide-up': slideUp,
    'slide-right': slideInRight,
    'slide-left': slideInLeft,
    scale: scaleUp,
    stagger: staggerContainer,
  };

  return (
    <motion.div
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
