'use client';

import React from 'react';
import { X, Phone, Mail, ChevronRight, Sparkles, User, Crown, Package, Building2, FileText, LogIn, UserPlus } from 'lucide-react';
import { SITE_CONFIG, ActiveView } from '@/config/site';
import { SquareButton } from '@/components/ui/SquareButton';
import { VsnLogo } from '@/components/ui/VsnLogo';
import { useCart } from '@/context/CartContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenAuthModal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  onOpenAuthModal,
}) => {
  const { userMode, userProfile } = useCart();
  if (!isOpen) return null;

  const handleLinkClick = (view: ActiveView) => {
    onNavigate(view);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-4/5 max-w-xs bg-[#0B132B] border-r border-[#D4AF37] h-full flex flex-col p-6 text-[#F8F9FA] z-10 animate-slide-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
          <div onClick={() => handleLinkClick('home')}>
            <VsnLogo size="sm" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login / Register Quick Action */}
        <div className="my-4 space-y-2">
          {userMode === 'LOGGED_IN' ? (
            <button
              onClick={() => {
                onClose();
                onOpenAuthModal?.();
              }}
              className="w-full flex items-center justify-between p-3 border border-[#D4AF37] bg-[#1C2541] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span className="truncate">Account: {userProfile?.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal?.();
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 border border-[#D4AF37] bg-[#1C2541] text-[#D4AF37] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal?.();
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 border border-[#D4AF37] bg-[#D4AF37] text-[#0B132B] text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1">
          {SITE_CONFIG.navigation.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item.view)}
                className={`w-full flex items-center justify-between p-3 border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#1C2541] border-[#D4AF37] text-[#D4AF37]'
                    : 'border-[#D4AF37]/20 hover:border-[#D4AF37] bg-[#1C2541]/40 text-gray-200 hover:text-[#D4AF37]'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            );
          })}

          {/* Quick Shortcuts */}
          <div className="pt-2 space-y-2 border-t border-[#D4AF37]/20">
            <button
              onClick={() => handleLinkClick('orders')}
              className="w-full flex items-center justify-between p-2.5 border border-[#D4AF37]/30 bg-[#0B132B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>Track Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <button
              onClick={() => handleLinkClick('quotes')}
              className="w-full flex items-center justify-between p-2.5 border border-[#D4AF37]/30 bg-[#0B132B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span>B2B Quotes</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <button
              onClick={() => handleLinkClick('invoices')}
              className="w-full flex items-center justify-between p-2.5 border border-[#D4AF37]/30 bg-[#0B132B] text-[#F3E5AB] text-xs font-bold uppercase tracking-wider cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span>Tax Invoices</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </nav>

        {/* Origin Stamp & Contact Info */}
        <div className="pt-4 border-t border-[#D4AF37]/30 space-y-3 mt-4">
          <div className="flex items-center gap-2 text-[11px] text-[#F3E5AB]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Direct Mangalore Harvest</span>
          </div>
          <div className="text-[11px] text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{SITE_CONFIG.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{SITE_CONFIG.contact.email}</span>
            </div>
          </div>
          <SquareButton
            variant="gold"
            size="sm"
            fullWidth
            onClick={() => handleLinkClick('products')}
          >
            Explore Catalog
          </SquareButton>
        </div>
      </div>
    </div>
  );
};
