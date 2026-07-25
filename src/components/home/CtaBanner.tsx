'use client';

import React from 'react';
import { Phone, Building2, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { SquareButton } from '@/components/ui/SquareButton';
import { SITE_CONFIG, ActiveView } from '@/config/site';

interface CtaBannerProps {
  onNavigate?: (view: ActiveView) => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onNavigate }) => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#060A17] border-t-2 border-[#D4AF37] relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 border border-[#D4AF37]/60 bg-[#0B132B] px-3.5 py-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#F3E5AB]">
            Wholesale B2B & Express GST Billing
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8F9FA] max-w-4xl mx-auto leading-tight">
          Looking for Direct Bulk Rates & <br />
          <span className="gold-gradient-text">Factory Orders from Rajahmundry?</span>
        </h2>

        <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-semibold leading-relaxed">
          We supply premium export-grade W-180 Jumbo Cashews, gourmet roasts, and custom sweet shop bulk packs to bakers, caterers, and retailers across Andhra Pradesh & Telangana.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <SquareButton
            variant="gold"
            size="lg"
            onClick={() => onNavigate?.('contact')}
            className="w-full sm:w-auto text-xs sm:text-sm py-4 px-8 shadow-[0_0_25px_rgba(212,175,55,0.4)] font-extrabold"
          >
            <Building2 className="w-4 h-4 mr-2 text-[#0B132B]" />
            <span>Request B2B Wholesale Quotation</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </SquareButton>

          <a
            href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-[#D4AF37] bg-[#0B132B] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] py-3.5 px-6 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call Desk: {SITE_CONFIG.contact.phone}</span>
          </a>
        </div>

        {/* Location Footer Badge */}
        <div className="pt-4 text-xs font-bold text-gray-300 flex items-center justify-center gap-2">
          <span>📍 Central Dispatch: Morampudi Junction, Rajahmundry, Andhra Pradesh</span>
        </div>
      </div>
    </section>
  );
};
