import React from 'react';
import { Crown, ShieldCheck, Truck, Award, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { SquareButton } from './SquareButton';
import { SquareInput } from './SquareInput';

export const SquareFooter: React.FC = () => {
  return (
    <footer className="bg-[#070B16] border-t-2 border-[#D4AF37] text-[#F8F9FA] relative overflow-hidden">
      {/* Corner Square Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />

      {/* Trust Badges */}
      <div className="border-b border-[#D4AF37]/20 py-8 bg-[#0B132B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="p-3 bg-[#1C2541] border border-[#D4AF37] text-[#D4AF37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs uppercase text-[#F3E5AB]">FSSAI Certified</h4>
              <p className="text-[11px] text-gray-400">100% Quality Assurance</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="p-3 bg-[#1C2541] border border-[#D4AF37] text-[#D4AF37]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs uppercase text-[#F3E5AB]">Express Dispatch</h4>
              <p className="text-[11px] text-gray-400">Insured Shipping Nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="p-3 bg-[#1C2541] border border-[#D4AF37] text-[#D4AF37]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs uppercase text-[#F3E5AB]">Direct From Farm</h4>
              <p className="text-[11px] text-gray-400">Zero Middlemen Markups</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="p-3 bg-[#1C2541] border border-[#D4AF37] text-[#D4AF37]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs uppercase text-[#F3E5AB]">Royal Packaging</h4>
              <p className="text-[11px] text-gray-400">Nitrogen Sealed Freshness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1C2541] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Crown className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-base gold-gradient-text uppercase tracking-widest">
              V S N CASHEWS
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Crafting India’s finest export-grade roasted, salted, and raw jumbo cashews since 1998. Straight from Panruti and Mangalore processing plants to your doorstep.
          </p>
          <div className="text-[11px] font-mono text-[#D4AF37]">GSTIN: 33AAAAA0000A1Z5</div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase text-[#F3E5AB] tracking-widest border-b border-[#D4AF37]/30 pb-2">
            Cashew Grades
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><a href="#grades" className="hover:text-[#D4AF37] transition-colors">W180 Jumbo Royal King</a></li>
            <li><a href="#grades" className="hover:text-[#D4AF37] transition-colors">W210 Super Jumbo</a></li>
            <li><a href="#grades" className="hover:text-[#D4AF37] transition-colors">W240 Premium Large Whole</a></li>
            <li><a href="#grades" className="hover:text-[#D4AF37] transition-colors">Slow Roasted & Himalayan Salted</a></li>
            <li><a href="#bulk" className="hover:text-[#D4AF37] transition-colors">Bulk Commercial Crushes (LWP/SWP)</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase text-[#F3E5AB] tracking-widest border-b border-[#D4AF37]/30 pb-2">
            Factory Contact
          </h4>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Plot 42, Industrial Export Zone, Panruti, Tamil Nadu - 607106</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>+91 98765 43210 / +91 94432 00000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>orders@vsncashews.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase text-[#F3E5AB] tracking-widest border-b border-[#D4AF37]/30 pb-2">
            Wholesale Catalog
          </h4>
          <p className="text-xs text-gray-300">
            Subscribe for weekly mandi market rate updates and export price sheets.
          </p>
          <div className="space-y-2">
            <SquareInput placeholder="Enter your email" className="bg-[#0B132B]" />
            <SquareButton variant="gold" size="sm" fullWidth>
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </SquareButton>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#D4AF37]/20 py-4 text-center text-[11px] text-gray-400 font-mono">
        © {new Date().getFullYear()} V S N CASHEWS. ALL RIGHTS RESERVED. CRAFTED WITH ROYAL ACCURACY.
      </div>
    </footer>
  );
};
