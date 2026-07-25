'use client';

import React from 'react';
import { Home, Package, PhoneCall, LogIn, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ActiveView } from '@/config/site';

interface BottomMobileNavProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenAuthModal?: () => void;
}

export const BottomMobileNav: React.FC<BottomMobileNavProps> = ({
  activeView,
  onNavigate,
  onOpenAuthModal,
}) => {
  const { userMode, userProfile } = useCart();

  const handleNav = (view: ActiveView) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B132B] border-t-2 border-[#D4AF37]/50 shadow-[0_-5px_25px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-4 h-16 items-center px-1">
        {/* 1. Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-all ${
            activeView === 'home'
              ? 'text-[#D4AF37] font-bold scale-105'
              : 'text-gray-400 hover:text-[#D4AF37]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Home</span>
        </button>

        {/* 2. Products */}
        <button
          onClick={() => handleNav('products')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-all ${
            activeView === 'products'
              ? 'text-[#D4AF37] font-bold scale-105'
              : 'text-gray-400 hover:text-[#D4AF37]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Products</span>
        </button>

        {/* 3. Contact */}
        <button
          onClick={() => handleNav('contact')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-all ${
            activeView === 'contact'
              ? 'text-[#D4AF37] font-bold scale-105'
              : 'text-gray-400 hover:text-[#D4AF37]'
          }`}
        >
          <PhoneCall className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Contact</span>
        </button>

        {/* 4. Login/Register OR Account (In place of login after logged in) */}
        {userMode === 'LOGGED_IN' ? (
          <button
            onClick={() => handleNav('orders')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all ${
              activeView === 'orders'
                ? 'text-[#D4AF37] font-bold scale-105'
                : 'text-gray-300 hover:text-[#D4AF37]'
            }`}
          >
            <User className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#F3E5AB] max-w-[65px] truncate">
              {userProfile?.name?.split(' ')[0] || 'Account'}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[#D4AF37] hover:text-[#F3E5AB] font-bold"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-tighter">Login/Reg</span>
          </button>
        )}
      </div>
    </nav>
  );
};
