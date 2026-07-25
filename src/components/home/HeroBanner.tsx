import React from 'react';
import { Sparkles, ArrowRight, Award } from 'lucide-react';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { ActiveView } from '@/config/site';

interface HeroBannerProps {
  onNavigate?: (view: ActiveView) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B] border-b border-[#D4AF37]/40 py-8 sm:py-16 md:py-24 overflow-hidden w-full">
      {/* Background Decorative Gold Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3710_1px,transparent_1px),linear-gradient(to_bottom,#d4af3710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column Text Content */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 border border-[#D4AF37] bg-[#0B132B] px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs tracking-widest text-[#F3E5AB] uppercase">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
            <span>Kukatpally, Hyderabad Hub</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-extrabold text-[#F8F9FA] tracking-tight leading-tight">
            The Sovereign Grade <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Cashew Nuts of India</span>
          </h1>

          <p className="text-xs sm:text-base text-gray-300 max-w-2xl leading-relaxed">
            Handpicked W-180 King Cashews, slow-roasted gourmet spices, and royal gift hampers vacuum-sealed for uncompromised crunch. Direct from Kukatpally, Hyderabad.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
            <SquareButton
              variant="gold"
              size="lg"
              className="w-full sm:w-auto text-xs sm:text-sm py-2.5 sm:py-3"
              onClick={() => onNavigate?.('products')}
            >
              Order King Collection <ArrowRight className="w-4 h-4 ml-1" />
            </SquareButton>
            <SquareButton
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-xs sm:text-sm py-2.5 sm:py-3"
              onClick={() => onNavigate?.('about')}
            >
              Explore Our Legacy
            </SquareButton>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 sm:pt-6 border-t border-[#D4AF37]/30 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left max-w-lg mx-auto lg:mx-0">
            <div>
              <p className="text-base sm:text-xl md:text-2xl font-serif font-bold text-[#D4AF37]">W-180</p>
              <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 tracking-wider">King Jumbo Size</p>
            </div>
            <div>
              <p className="text-base sm:text-xl md:text-2xl font-serif font-bold text-[#D4AF37]">100%</p>
              <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 tracking-wider">Nitrogen Sealed</p>
            </div>
            <div>
              <p className="text-base sm:text-xl md:text-2xl font-serif font-bold text-[#D4AF37]">4.9 ★</p>
              <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 tracking-wider">5,000+ Reviews</p>
            </div>
          </div>
        </div>

        {/* Right Column Showcase Image Card featuring 3D VSN Logo Graphic */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-xs sm:max-w-md bg-[#1C2541] border-2 border-[#D4AF37] p-2 sm:p-3 shadow-[0_0_30px_rgba(212,175,55,0.25)] group">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 sm:w-4 sm:h-4 bg-[#D4AF37]" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 sm:w-4 sm:h-4 bg-[#D4AF37]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 sm:w-4 sm:h-4 bg-[#D4AF37]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 sm:w-4 sm:h-4 bg-[#D4AF37]" />

            <div className="relative aspect-square overflow-hidden bg-[#0B132B] flex items-center justify-center p-2">
              <img
                src="/assets/v-s-n-logo.png"
                alt="V S N Cashews Sovereign Art"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent opacity-60 pointer-events-none" />

              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                <SquareBadge variant="gold" className="text-[10px] sm:text-xs">
                  <Award className="w-3 h-3 mr-1" /> W-180 King Jumbo
                </SquareBadge>
              </div>

              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-left p-2 sm:p-3 bg-[#0B132B]/90 border border-[#D4AF37]/50 backdrop-blur-sm z-10">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F3E5AB]">
                  Sovereign 3D Collection
                </p>
                <p className="text-[10px] sm:text-[11px] text-gray-300">
                  Crisp, rich, buttery whole cashew kernels carefully selected by master graders in Hyderabad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
