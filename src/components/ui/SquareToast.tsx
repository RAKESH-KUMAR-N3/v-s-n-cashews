import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (options: { title: string; message?: string; type?: ToastType }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = 'success' }: { title: string; message?: string; type?: ToastType }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, message, type };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <SquareToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};

const SquareToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    danger: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#D4AF37] shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/60',
    danger: 'border-red-500/60',
    warning: 'border-amber-500/60',
    info: 'border-[#D4AF37]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'rounded-none bg-[#1C2541] text-[#F8F9FA] p-4 border shadow-xl flex items-start justify-between gap-3 relative pointer-events-auto overflow-hidden',
        borders[toast.type || 'info']
      )}
    >
      {/* Corner Square Accent */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D4AF37]" />
      
      <div className="flex items-start gap-3">
        {icons[toast.type || 'info']}
        <div>
          <h4 className="text-xs font-serif font-bold uppercase text-[#F3E5AB] tracking-wide">
            {toast.title}
          </h4>
          {toast.message && <p className="text-xs text-gray-300 mt-1">{toast.message}</p>}
        </div>
      </div>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white p-1 rounded-none transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Timer Progress Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-0.5 bg-[#D4AF37]"
      />
    </motion.div>
  );
};
