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
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        backgroundColor: '#0B132B',
        borderTop: '2px solid #D4AF37',
        height: '64px',
        boxShadow: '0 -5px 25px rgba(0,0,0,0.9)',
      }}
      className="lg:hidden w-full flex items-center"
    >
      <div className="w-full grid grid-cols-4 items-center px-1">
        {/* 1. Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-all ${
            activeView === 'home'
              ? 'text-[#D4AF37] font-bold scale-105'
              : 'text-gray-400 hover:text-[#D4AF37]'
          }`}
        >
          <Home className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white">Home</span>
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
          <Package className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white">Products</span>
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
          <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white">Contact</span>
        </button>

        {/* 4. Login/Register OR Account */}
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
            <LogIn className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[9px] uppercase tracking-tighter text-[#D4AF37]">Login/Reg</span>
          </button>
        )}
      </div>
    </nav>
  );
};
