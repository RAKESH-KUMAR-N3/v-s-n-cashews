'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Bell, Search, X } from 'lucide-react';
import { ActiveView } from '@/config/site';
import { VsnLogo } from '@/components/ui/VsnLogo';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

  const dummyNotifications = [
    {
      id: 1,
      title: 'Welcome to V S N Cashews!',
      time: 'Just now',
      desc: 'Use code ROYAL10 for 10% off on your first order.',
    },
    {
      id: 2,
      title: 'Fresh Hyderabad Batch',
      time: '2 hours ago',
      desc: 'W-180 Emperor King Cashews now available.',
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B132B] border-b border-[#D4AF37]/40 shadow-2xl opacity-100'
          : 'bg-[#0B132B]/80 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 w-full">
        {/* Left Side: Brand Logo + Clean Gold Text */}
        <div onClick={(e) => handleNavClick('home', e)} className="shrink-0">
          <VsnLogo size="md" />
        </div>

        {/* Desktop Navbar Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={(e) => handleNavClick('products', e)}
            className={`text-xs uppercase tracking-widest py-2 transition-all font-semibold border-b-2 ${
              activeView === 'products'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-300 hover:text-[#D4AF37] border-transparent'
            }`}
          >
            Products
          </button>

          <button
            onClick={(e) => handleNavClick('about', e)}
            className={`text-xs uppercase tracking-widest py-2 transition-all font-semibold border-b-2 ${
              activeView === 'about'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-300 hover:text-[#D4AF37] border-transparent'
            }`}
          >
            About
          </button>

          <button
            onClick={onOpenCart}
            className="text-xs uppercase tracking-widest py-2 transition-all font-semibold text-gray-300 hover:text-[#D4AF37] border-b-2 border-transparent"
          >
            Cart ({cartCount})
          </button>

          <button
            onClick={(e) => handleNavClick('contact', e)}
            className={`text-xs uppercase tracking-widest py-2 transition-all font-semibold border-b-2 ${
              activeView === 'contact'
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-300 hover:text-[#D4AF37] border-transparent'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Header Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#1C2541] border border-[#D4AF37] px-2 py-1 w-32 sm:w-52">
                <Search className="w-3.5 h-3.5 text-[#D4AF37] mr-1 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    onSearchChange?.(e.target.value);
                    if (activeView !== 'products') {
                      onNavigate('products');
                    }
                  }}
                  placeholder="Search..."
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
                  <X className="w-3.5 h-3.5" />
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
                className="p-1.5 text-gray-300 hover:text-[#D4AF37] transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
              </button>
            )}
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-1.5 text-gray-300 hover:text-[#D4AF37] relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#0B132B] border border-[#D4AF37] p-3 shadow-2xl z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-1.5">
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

                <div className="space-y-1.5">
                  {dummyNotifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 border border-[#D4AF37]/20 bg-[#1C2541]/50 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[#D4AF37] font-bold">
                        <span>{item.title}</span>
                        <span className="text-[9px] text-gray-400">{item.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-300">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon Bag */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1.5 bg-[#1C2541] border border-[#D4AF37] px-2.5 py-1.5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-all group"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#F3E5AB] group-hover:text-[#0B132B]">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
