'use client';

import React from 'react';
import { Mail, Phone, MapPin, Award, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { SITE_CONFIG, ActiveView } from '@/config/site';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';

interface FooterProps {
  onNavigate?: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#060A17] border-t-2 border-[#D4AF37]/40 pt-16 pb-12 text-gray-300 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-3 p-4 border border-[#D4AF37]/30 bg-[#0B132B]">
            <Award className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">100% Handpicked</h4>
              <p className="text-[11px] text-gray-400">Grade W-180 Jumbo Kernels</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-[#D4AF37]/30 bg-[#0B132B]">
            <Truck className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">Hyderabad Direct</h4>
              <p className="text-[11px] text-gray-400">Express Dispatch in 24 Hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-[#D4AF37]/30 bg-[#0B132B]">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">Vacuum Sealed</h4>
              <p className="text-[11px] text-gray-400">Nitrogen Flushed Freshness Lock</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-[#D4AF37]/30 bg-[#0B132B]">
            <RefreshCw className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">Razorpay Protected</h4>
              <p className="text-[11px] text-gray-400">256-bit Encrypted Checkout</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/v-s-n-logo.png"
                alt="V S N CASHEWS Logo"
                className="h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              />
              <span className="font-serif text-2xl font-black text-[#D4AF37] tracking-wider">
                V S N CASHEWS
              </span>
            </div>

            <p className="text-xs leading-relaxed text-gray-400 max-w-md">
              Based in Kukatpally, Hyderabad, V S N CASHEWS selects only premium grade raw cashew nuts. Each nut undergoes 7-stage quality grading, gentle humidity drying, and vacuum sealing to ensure uncompromised crunch, butteriness, and royal taste.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{SITE_CONFIG.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>{SITE_CONFIG.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-[#F3E5AB] border-b border-[#D4AF37]/30 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate?.('home')} className="hover:text-[#D4AF37] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('products')} className="hover:text-[#D4AF37] transition-colors">
                  All Cashew Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('about')} className="hover:text-[#D4AF37] transition-colors">
                  Hyderabad Hub & Legacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('orders')} className="hover:text-[#D4AF37] transition-colors">
                  Track Order & History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('quotes')} className="hover:text-[#D4AF37] transition-colors">
                  B2B Wholesale Quotes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('invoices')} className="hover:text-[#D4AF37] transition-colors">
                  GST Tax Receipts & Invoices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('contact')} className="hover:text-[#D4AF37] transition-colors">
                  Contact & Wholesale
                </button>
              </li>
            </ul>
          </div>

          {/* Cashew Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-[#F3E5AB] border-b border-[#D4AF37]/30 pb-2">
              Cashew Grades
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>W-180 Emperor King</li>
              <li>W-240 Royal Select</li>
              <li>Ghee Roasted & Salted</li>
              <li>Royal Velvet Gift Hampers</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-[#F3E5AB] border-b border-[#D4AF37]/30 pb-2">
              Royal Gazette
            </h4>
            <p className="text-[11px] text-gray-400">
              Subscribe to receive private harvest releases and festive gift box catalogues.
            </p>
            <div className="space-y-2">
              <SquareInput placeholder="Enter your email..." className="text-xs bg-[#0B132B]" />
              <SquareButton variant="gold" size="sm" className="w-full text-xs">
                Subscribe
              </SquareButton>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/20 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} V S N CASHEWS. All Sovereign Rights Reserved. Kukatpally, Hyderabad, Telangana.
        </div>
      </div>
    </footer>
  );
};
