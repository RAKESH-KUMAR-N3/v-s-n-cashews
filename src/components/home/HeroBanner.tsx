import React from 'react';
import { Sparkles, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { ActiveView } from '@/config/site';

interface HeroBannerProps {
  onNavigate?: (view: ActiveView) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-b from-[#060A17] via-[#0B132B] to-[#0D1B3A] py-10 sm:py-16 md:py-20 overflow-hidden w-full max-w-[100vw] border-b border-[#D4AF37]/30">
      {/* Background Decorative Gold Radial Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        {/* Left Column Text Content */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
          {/* Top Royal Badge */}
          <div className="inline-flex items-center gap-2 border border-[#D4AF37]/60 bg-[#0B132B]/90 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-[#F3E5AB]">
              Sovereign Export Grade • 100% Pure
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-[#F8F9FA] tracking-tight leading-[1.15]">
            King Jumbo Cashews & <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Royal Ghee Roasts 🥜</span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Handpicked W-180 Emperor Jumbo Cashews, Pure Cow Ghee Roasts & Authentic Spice Infusions. Vacuum-sealed for uncompromised royal freshness.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <SquareButton
              variant="gold"
              size="lg"
              className="w-full sm:w-auto text-xs sm:text-sm py-3.5 px-8 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              onClick={() => onNavigate?.('products')}
            >
              <span>Shop Royal Collection</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </SquareButton>
            
            <SquareButton
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-xs sm:text-sm py-3.5 px-6"
              onClick={() => onNavigate?.('about')}
            >
              Wholesale B2B Catalog
            </SquareButton>
          </div>

          {/* Key Metrics Badges */}
          <div className="pt-6 border-t border-[#D4AF37]/25 grid grid-cols-3 gap-3 text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-base sm:text-2xl font-serif font-black gold-gradient-text">W-180</p>
              <p className="text-[9px] sm:text-[11px] uppercase text-gray-400 font-bold tracking-wider">King Jumbo Size</p>
            </div>
            <div>
              <p className="text-base sm:text-2xl font-serif font-black gold-gradient-text">100%</p>
              <p className="text-[9px] sm:text-[11px] uppercase text-gray-400 font-bold tracking-wider">Pure Ghee Roast</p>
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start text-[#D4AF37] text-xs font-bold gap-0.5">
                <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                <span>4.9 / 5</span>
              </div>
              <p className="text-[9px] sm:text-[11px] uppercase text-gray-400 font-bold tracking-wider">5,000+ Ratings</p>
            </div>
          </div>
        </div>

        {/* Right Column Product Showcase Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-[300px] sm:max-w-md bg-gradient-to-b from-[#1C2541] to-[#0B132B] border border-[#D4AF37]/60 p-3.5 shadow-[0_0_40px_rgba(212,175,55,0.3)] group">
            {/* Top Product Image */}
            <div className="relative aspect-4/3 overflow-hidden bg-[#060A17] border border-[#D4AF37]/30">
              <img
                src="/assets/img-cashew-1.jpg"
                alt="W-180 King Jumbo Cashews"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <SquareBadge variant="gold" className="text-[10px] uppercase font-bold py-1 px-2">
                  🏆 Grade W-180 King Jumbo
                </SquareBadge>
              </div>
            </div>

            {/* Product Card Info */}
            <div className="pt-3 text-left space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#F3E5AB]">
                  W-180 King Jumbo Cashews
                </h3>
                <span className="font-serif font-black text-sm text-[#D4AF37]">
                  ₹890 / 500g
                </span>
              </div>
              
              <p className="text-[11px] text-gray-300 leading-snug">
                Export Grade King Jumbo Whole Cashew Kernels. Nitrogen-sealed for maximum crunch and natural buttery taste.
              </p>

              <SquareButton
                variant="gold"
                size="sm"
                fullWidth
                onClick={() => onNavigate?.('products')}
                className="mt-1 py-2 text-xs"
              >
                Order Now
              </SquareButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
