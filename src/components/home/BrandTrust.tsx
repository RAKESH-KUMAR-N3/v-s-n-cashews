'use client';

import React from 'react';
import { Award, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

export const BrandTrust: React.FC = () => {
  return (
    <section id="heritage" className="py-8 sm:py-16 bg-[#0B132B] border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[#1C2541]/60 border border-[#D4AF37]/40 p-4 sm:p-10 relative overflow-hidden shadow-lg">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-6 sm:mb-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Rajahmundry Estate Quality Oath
            </span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#F8F9FA] leading-tight">
              Why V S N CASHEWS Stand Sovereign Above All
            </h2>
            <p className="text-xs text-gray-300">
              In an industry where generic grade mixing is common, V S N CASHEWS maintains absolute purity. Single-origin sorted, uniform count, and velvety butter flavor.
            </p>
          </div>

          {/* Compact Feature Items - NO Cards inside Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="p-3 bg-[#0B132B]/80 border border-[#D4AF37]/20 flex flex-col items-center text-center space-y-1.5">
              <div className="p-1.5 bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                7-Stage Optical Grading
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">
                Electronic color sorting removes broken or spotted kernels automatically.
              </p>
            </div>

            <div className="p-3 bg-[#0B132B]/80 border border-[#D4AF37]/20 flex flex-col items-center text-center space-y-1.5">
              <div className="p-1.5 bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                Nitrogen Flush Pack
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">
                Prevents moisture degradation and rancidity without preservatives.
              </p>
            </div>

            <div className="p-3 bg-[#0B132B]/80 border border-[#D4AF37]/20 flex flex-col items-center text-center space-y-1.5">
              <div className="p-1.5 bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                Air Express Dispatch
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">
                Shipped directly from Baikampady unit to all pin codes in 24-48 hours.
              </p>
            </div>

            <div className="p-3 bg-[#0B132B]/80 border border-[#D4AF37]/20 flex flex-col items-center text-center space-y-1.5">
              <div className="p-1.5 bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                Freshness Guarantee
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">
                100% money-back guarantee if crunch or aroma does not meet royal standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
