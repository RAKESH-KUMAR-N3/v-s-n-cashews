import React from 'react';
import { ShoppingBag, Search, Phone, Crown, ShieldCheck } from 'lucide-react';
import { SquareButton } from './SquareButton';

export interface SquareNavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export const SquareNavbar: React.FC<SquareNavbarProps> = ({
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B132B]/95 backdrop-blur-md border-b border-[#D4AF37]/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Top Banner */}
      <div className="bg-[#1C2541] border-b border-[#D4AF37]/20 py-1.5 px-4 text-center text-[10px] md:text-xs text-[#F3E5AB] uppercase tracking-widest font-mono flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Direct Factory Exports • 100% Organic W180 & Jumbo Cashews • Free Shipping across India</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1C2541] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif font-extrabold text-lg md:text-xl gold-gradient-text tracking-widest uppercase block leading-none">
              V S N CASHEWS
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-mono block mt-1">
              Premium Export Quality
            </span>
          </div>
        </div>

        {/* Right Action Trigger Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="p-2.5 text-gray-300 hover:text-[#D4AF37] hover:bg-[#1C2541] border border-transparent hover:border-[#D4AF37]/40 transition-colors rounded-none"
            title="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          <a
            href="tel:+919876543210"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs text-[#F3E5AB] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors rounded-none"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-mono">+91 98765 43210</span>
          </a>

          <SquareButton
            variant="gold"
            size="sm"
            onClick={onOpenCart}
            className="relative flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="bg-[#0B132B] text-[#D4AF37] text-[10px] font-bold px-1.5 py-0.5 border border-[#D4AF37]">
                {cartCount}
              </span>
            )}
          </SquareButton>
        </div>
      </div>
    </header>
  );
};
