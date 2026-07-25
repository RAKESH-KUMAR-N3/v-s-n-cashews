'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Bell, Search, X, CheckCheck, LogOut } from 'lucide-react';
import { ActiveView } from '@/config/site';
import { VsnLogo } from '@/components/ui/VsnLogo';
import { useNotification } from '@/context/NotificationContext';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuthModal?: () => void;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  cartCount,
  onOpenCart,
  onSearchChange,
  searchTerm = '',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { notifications, unreadUserCount, markAllAsRead } = useNotification();
  const { userMode, logoutUser } = useCart();

  const userNotifications = notifications.filter((n) => n.recipient === 'USER' || n.recipient === 'BOTH');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: ActiveView, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B132B]/95 border-b border-[#D4AF37]/40 shadow-2xl backdrop-blur-md'
          : 'bg-[#0B132B]/30 border-b border-transparent backdrop-blur-xs'
      }`}
    >
      {/* 1. Main Header Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 w-full">
        {/* Brand Logo & Crisp Typography */}
        <div onClick={(e) => handleNavClick('home', e)} className="shrink-0 cursor-pointer py-1">
          <VsnLogo size="lg" />
        </div>

        {/* Desktop Navbar Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={(e) => handleNavClick('products', e)}
            className={`text-sm uppercase tracking-widest py-2 transition-all font-bold border-b-2 cursor-pointer ${
              activeView === 'products'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-100 hover:text-[#D4AF37] border-transparent'
            }`}
          >
            Products
          </button>

          <button
            onClick={(e) => handleNavClick('about', e)}
            className={`text-sm uppercase tracking-widest py-2 transition-all font-bold border-b-2 cursor-pointer ${
              activeView === 'about'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-100 hover:text-[#D4AF37] border-transparent'
            }`}
          >
            About
          </button>

          <button
            onClick={onOpenCart}
            className="text-sm uppercase tracking-widest py-2 transition-all font-bold text-gray-100 hover:text-[#D4AF37] border-b-2 border-transparent cursor-pointer"
          >
            Cart ({cartCount})
          </button>

          <button
            onClick={(e) => handleNavClick('contact', e)}
            className={`text-sm uppercase tracking-widest py-2 transition-all font-bold border-b-2 cursor-pointer ${
              activeView === 'contact'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-100 hover:text-[#D4AF37] border-transparent'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Header Action Icons: Notification, Clean Cart (No Box), Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Icon (Direct Page Navigation) */}
          <button
            onClick={() => onNavigate('notifications')}
            className={`p-1.5 relative transition-all cursor-pointer hover:scale-105 ${
              activeView === 'notifications' ? 'text-[#F3E5AB]' : 'text-gray-200 hover:text-[#D4AF37]'
            }`}
            title="Notifications & Updates"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
            {unreadUserCount > 0 && (
              <>
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
              </>
            )}
          </button>

          {/* Clean Cart Icon (No Box Container) */}
          <button
            onClick={onOpenCart}
            className="relative p-1.5 text-[#D4AF37] hover:text-[#F3E5AB] transition-all cursor-pointer hover:scale-105"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#D4AF37] text-[#0B132B] text-[10px] font-extrabold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Logout Icon (Only if Logged In) */}
          {userMode === 'LOGGED_IN' && (
            <button
              onClick={() => {
                logoutUser();
                onNavigate('home');
              }}
              className="p-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Logout Account"
            >
              <LogOut className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. White Clean Search Bar directly underneath the Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-2.5">
        <div className="relative w-full max-w-md mx-auto">
          <Search className="w-4 h-4 text-[#8C5C12] absolute left-3 top-1/2 -translate-y-1/2 font-bold" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              onSearchChange?.(e.target.value);
              if (activeView !== 'products') {
                onNavigate('products');
              }
            }}
            placeholder="Search King Cashews, W180, Roasted..."
            className="w-full bg-white text-gray-900 font-semibold border-2 border-[#D4AF37] pl-9 pr-8 py-2 text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-md rounded-none"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
