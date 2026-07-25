import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scaleUp } from '@/lib/animations';

export interface SquareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const SquareModal: React.FC<SquareModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#070B16]/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative w-full rounded-none bg-[#1C2541] border border-[#D4AF37] p-6 md:p-8 shadow-[0_0_40px_rgba(212,175,55,0.25)] text-[#F8F9FA] z-10 max-h-[90vh] overflow-y-auto',
              sizes[size]
            )}
          >
            {/* Corner Gold Squares */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D4AF37]/30">
              {title && (
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#F3E5AB] tracking-wider uppercase">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-[#D4AF37] transition-colors rounded-none border border-transparent hover:border-[#D4AF37]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
