'use client';

import React from 'react';
import Link from 'next/link';
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
    <nav className="mobile-bottom-nav-fixed">
      <div className="w-full grid grid-cols-4 items-center px-1">
        {/* 1. Home */}
        <Link
          href="/"
          prefetch={true}
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all ${
            activeView === 'home'
              ? 'text-[#D4AF37] font-bold scale-105'
              : 'text-gray-400 hover:text-[#D4AF37]'
          }`}
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
          <span className="text-[9px] uppercase tracking-wider font-semibold text-white">Home</span>
        </Link>

        {/* 2. Products */}
        <Link
          href="/products"
          prefetch={true}
          onClick={() => handleNav('products')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all ${
            activeView === 'products'
              ? 'text-[#D4AF37] font-bold scale-105'
              : 'text-gray-400 hover:text-[#D4AF37]'
          }`}
        >
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
          <span className="text-[9px] uppercase tracking-wider font-semibold text-white">Products</span>
        </Link>

        {/* 3. Contact */}
        <Link
          href="/contact"
          prefetch={true}
          onClick={() => handleNav('contact')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all ${
            activeView === 'contact'
              ? 'text-[#D4AF37] font-bold scale-105'
              : 'text-gray-400 hover:text-[#D4AF37]'
          }`}
        >
          <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
          <span className="text-[9px] uppercase tracking-wider font-semibold text-white">Contact</span>
        </Link>

        {/* 4. Login/Register OR Account */}
        {userMode === 'LOGGED_IN' ? (
          <Link
            href="/account"
            prefetch={true}
            onClick={() => handleNav('account')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all cursor-pointer ${
              activeView === 'account' || activeView === 'orders'
                ? 'text-[#D4AF37] font-bold scale-105'
                : 'text-gray-300 hover:text-[#D4AF37]'
            }`}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#F3E5AB] max-w-[60px] truncate">
              {userProfile?.name?.split(' ')[0] || 'Account'}
            </span>
          </Link>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-[#D4AF37] hover:text-[#F3E5AB] font-bold cursor-pointer"
          >
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
            <span className="text-[9px] uppercase tracking-tighter text-[#D4AF37]">Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};
