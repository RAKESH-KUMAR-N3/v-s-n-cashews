import React from 'react';
import { cn } from '@/lib/utils';

export interface SquareFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const SquareForm: React.FC<SquareFormProps> = ({
  title,
  description,
  className,
  children,
  onSubmit,
  ...props
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'bg-[#1C2541]/90 border border-[#D4AF37]/50 p-6 md:p-8 rounded-none space-y-6 relative shadow-[0_0_20px_rgba(212,175,55,0.1)]',
        className
      )}
      {...props}
    >
      {/* Corner Square Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#D4AF37]" />

      {(title || description) && (
        <div className="pb-4 border-b border-[#D4AF37]/30 space-y-1">
          {title && (
            <h3 className="font-serif font-bold text-lg text-[#F3E5AB] uppercase tracking-wider">
              {title}
            </h3>
          )}
          {description && <p className="text-xs text-gray-300">{description}</p>}
        </div>
      )}

      <div className="space-y-4">{children}</div>
    </form>
  );
};
