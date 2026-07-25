import React from 'react';
import { Award, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

export const BrandTrust: React.FC = () => {
  return (
    <section id="heritage" className="py-20 bg-[#0B132B] border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C2541]/90 border-2 border-[#D4AF37] p-8 md:p-12 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          {/* Decorative Corner Flashes */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#D4AF37]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#D4AF37]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#D4AF37]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Mangalore Estate Quality Oath
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F8F9FA] leading-tight">
                Why V S N CASHEWS Stand Sovereign Above All
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                In an industry where generic grade mixing is common, V S N CASHEWS maintains absolute purity. Every package is single-origin sorted, ensuring uniform count, size consistency, and velvety butter flavor.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0B132B] border border-[#D4AF37]/40 space-y-2">
                <div className="p-2 w-fit bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                  7-Stage Optical Grading
                </h4>
                <p className="text-[11px] text-gray-400">
                  Electronic color sorting removes broken, spotted, or undersized kernels automatically.
                </p>
              </div>

              <div className="p-4 bg-[#0B132B] border border-[#D4AF37]/40 space-y-2">
                <div className="p-2 w-fit bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                  Nitrogen Flush Vacuum Pack
                </h4>
                <p className="text-[11px] text-gray-400">
                  Prevents moisture degradation and rancidity without artificial chemical preservatives.
                </p>
              </div>

              <div className="p-4 bg-[#0B132B] border border-[#D4AF37]/40 space-y-2">
                <div className="p-2 w-fit bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                  Direct Air Express Dispatch
                </h4>
                <p className="text-[11px] text-gray-400">
                  Shipped directly from Baikampady industrial unit to all Indian pin codes in 24-48 hours.
                </p>
              </div>

              <div className="p-4 bg-[#0B132B] border border-[#D4AF37]/40 space-y-2">
                <div className="p-2 w-fit bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                  Freshness Guarantee
                </h4>
                <p className="text-[11px] text-gray-400">
                  100% money-back guarantee if the crunch, aroma, or grade does not meet royal standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
