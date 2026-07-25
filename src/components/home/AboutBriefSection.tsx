'use client';

import React from 'react';
import { Award, ShieldCheck, Truck, Sparkles, CheckCircle2, ArrowRight, HeartHandshake } from 'lucide-react';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { ActiveView } from '@/config/site';

interface AboutBriefSectionProps {
  onNavigate?: (view: ActiveView) => void;
}

export const AboutBriefSection: React.FC<AboutBriefSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-12 sm:py-18 bg-[#0B132B] border-b border-[#D4AF37]/30 relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Top Header Badge */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-[#D4AF37]/60 bg-[#1C2541]/90 px-3.5 py-1.5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#F3E5AB]">
              Heritage of Rajahmundry, Andhra Pradesh
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8F9FA] tracking-tight leading-tight">
            Why Choose <span className="gold-gradient-text">V S N CASHEWS?</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-200 font-semibold leading-relaxed">
            Nurtured along the rich soil of the Godavari delta in <strong className="text-[#F3E5AB]">Rajahmundry, Andhra Pradesh</strong>, V S N CASHEWS brings you 100% natural, unbleached, hand-graded Sovereign King Cashews directly from our state-of-the-art processing facility.
          </p>
        </div>

        {/* 4 Feature Pillars Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {/* Pillar 1 */}
          <div className="bg-[#1C2541]/90 border border-[#D4AF37]/40 p-5 space-y-3 relative group hover:border-[#D4AF37] transition-all shadow-lg">
            <div className="w-10 h-10 bg-[#0B132B] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#F3E5AB]">
              7-Stage Hand Grading
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-semibold leading-normal">
              Every single cashew kernel is manually inspected for shape, size, and weight, ensuring zero broken or infested nuts.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#1C2541]/90 border border-[#D4AF37]/40 p-5 space-y-3 relative group hover:border-[#D4AF37] transition-all shadow-lg">
            <div className="w-10 h-10 bg-[#0B132B] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#F3E5AB]">
              100% Pure Cow Ghee Roast
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-semibold leading-normal">
              Slow wood-fire roasted in authentic pure cow ghee and hand-seasoned with organic spices for unmatched crunch.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#1C2541]/90 border border-[#D4AF37]/40 p-5 space-y-3 relative group hover:border-[#D4AF37] transition-all shadow-lg">
            <div className="w-10 h-10 bg-[#0B132B] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#F3E5AB]">
              Zero Chemical Bleaching
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-semibold leading-normal">
              No artificial colors, sulphur processing, or chemical whitening. 100% natural, cream-golden buttery taste.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#1C2541]/90 border border-[#D4AF37]/40 p-5 space-y-3 relative group hover:border-[#D4AF37] transition-all shadow-lg">
            <div className="w-10 h-10 bg-[#0B132B] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#F3E5AB]">
              Rajahmundry Direct Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-semibold leading-normal">
              Freshly packed in vacuum-sealed nitrogen packs and dispatched directly from Rajahmundry with official GST invoices.
            </p>
          </div>
        </div>

        {/* Read More Action Bar */}
        <div className="text-center pt-2">
          <SquareButton
            variant="outline"
            size="md"
            onClick={() => onNavigate?.('about')}
            className="text-xs sm:text-sm font-bold py-3 px-8"
          >
            <span>Learn More About Our Rajahmundry Legacy</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </SquareButton>
        </div>
      </div>
    </section>
  );
};
