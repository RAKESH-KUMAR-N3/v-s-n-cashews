'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Bell,
  Search,
  X,
  User,
  LogIn,
} from 'lucide-react';
import { SITE_CONFIG, ActiveView } from '@/config/site';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { VsnLogo } from '@/components/ui/VsnLogo';
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
  onOpenAuthModal,
  onSearchChange,
  searchTerm = '',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { userMode, userProfile } = useCart();

  // Handle scroll detection for transparent to solid sticky header transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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

  const dummyNotifications = [
    {
      id: 1,
      title: 'Welcome to V S N Cashews!',
      time: 'Just now',
      desc: 'Use code ROYAL10 for 10% off on your first order.',
    },
    {
      id: 2,
      title: 'Fresh Kukatpally Batch Released',
      time: '2 hours ago',
      desc: 'W-180 Emperor King Cashews now in stock.',
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B132B] border-b border-[#D4AF37]/30 shadow-2xl opacity-100 backdrop-blur-none'
          : 'bg-transparent border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left Side: Neat Elevated 3D Logo Image (No text next to logo on mobile) */}
        <div onClick={(e) => handleNavClick('home', e)} className="shrink-0">
          <VsnLogo size="md" showText={false} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <button
            onClick={(e) => handleNavClick('products', e)}
            className={`text-xs uppercase tracking-widest py-2 transition-all cursor-pointer font-medium border-b-2 ${
              activeView === 'products'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-300 hover:text-[#D4AF37] border-transparent hover:border-[#D4AF37]/50'
            }`}
          >
            Products
          </button>

          <button
            onClick={(e) => handleNavClick('about', e)}
            className={`text-xs uppercase tracking-widest py-2 transition-all cursor-pointer font-medium border-b-2 ${
              activeView === 'about'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-300 hover:text-[#D4AF37] border-transparent hover:border-[#D4AF37]/50'
            }`}
          >
            About
          </button>

          <button
            onClick={onOpenCart}
            className="text-xs uppercase tracking-widest py-2 transition-all cursor-pointer font-medium text-gray-300 hover:text-[#D4AF37] border-b-2 border-transparent hover:border-[#D4AF37]/50"
          >
            Cart ({cartCount})
          </button>

          <button
            onClick={(e) => handleNavClick('contact', e)}
            className={`text-xs uppercase tracking-widest py-2 transition-all cursor-pointer font-medium border-b-2 ${
              activeView === 'contact'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-300 hover:text-[#D4AF37] border-transparent hover:border-[#D4AF37]/50'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Side Header Icons: Search, Notification, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#1C2541] border border-[#D4AF37] px-2.5 py-1.5 w-32 sm:w-56">
                <Search className="w-4 h-4 text-[#D4AF37] mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    onSearchChange?.(e.target.value);
                    if (activeView !== 'products') {
                      onNavigate('products');
                    }
                  }}
                  placeholder="Search W180..."
                  className="w-full bg-transparent text-xs text-[#F8F9FA] focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange?.('');
                  }}
                  className="text-gray-400 hover:text-[#D4AF37]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  if (activeView !== 'products') {
                    onNavigate('products');
                  }
                }}
                className="p-2 text-gray-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 1. Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-gray-300 hover:text-[#D4AF37] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full" />
            </button>

            {/* Notifications Dropdown Modal */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0B132B] border-2 border-[#D4AF37] p-4 shadow-2xl z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                    Notifications
                  </h4>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-gray-400 hover:text-[#D4AF37]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {dummyNotifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 border border-[#D4AF37]/20 bg-[#1C2541]/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[#D4AF37] font-bold">
                        <span>{item.title}</span>
                        <span className="text-[10px] text-gray-400">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-300">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Cart Page Icon (Bag with Cart Count Badge) */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1.5 bg-[#1C2541] border border-[#D4AF37] px-2.5 sm:px-3 py-1.5 sm:py-2 hover:bg-[#D4AF37] hover:text-[#0B132B] text-[#D4AF37] transition-all cursor-pointer group"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <SquareBadge variant="gold" className="group-hover:bg-[#0B132B] group-hover:text-[#D4AF37]">
              {cartCount}
            </SquareBadge>
          </button>
        </div>
      </div>
    </header>
  );
};
