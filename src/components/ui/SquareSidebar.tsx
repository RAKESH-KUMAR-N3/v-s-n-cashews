import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface SquareSidebarProps {
  items: SidebarItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: string;
}

export const SquareSidebar: React.FC<SquareSidebarProps> = ({
  items,
  activeId,
  onSelect,
  title = 'V S N Royal',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-[#1C2541] border-r border-[#D4AF37]/40 h-full flex flex-col justify-between p-4 relative rounded-none select-none"
    >
      {/* Top Toggle & Title */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <Crown className="w-6 h-6 text-[#D4AF37] shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-serif font-bold text-sm text-[#F3E5AB] tracking-widest uppercase whitespace-nowrap"
              >
                {title}
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-[#D4AF37] hover:bg-[#0B132B] border border-[#D4AF37]/40 rounded-none transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect?.(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-3 text-xs uppercase tracking-wider font-medium rounded-none border border-transparent transition-all duration-200 group relative',
                  isActive
                    ? 'bg-[#0B132B] text-[#D4AF37] border-[#D4AF37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                    : 'text-gray-300 hover:text-[#F3E5AB] hover:bg-[#0B132B]/50 hover:border-[#D4AF37]/30'
                )}
              >
                <span className="shrink-0 text-[#D4AF37]">{item.icon}</span>
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto bg-[#D4AF37] text-[#0B132B] text-[10px] font-bold px-1.5 py-0.5 rounded-none">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Status */}
      {!isCollapsed && (
        <div className="pt-4 border-t border-[#D4AF37]/30 text-[10px] text-gray-400 font-mono tracking-widest text-center uppercase">
          V S N CASHEWS • ESTD 1998
        </div>
      )}
    </motion.aside>
  );
};
