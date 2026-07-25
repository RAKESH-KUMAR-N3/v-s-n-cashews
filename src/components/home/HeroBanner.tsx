'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { CashewNutParticle } from '@/components/ui/CashewNutParticle';
import { ActiveView } from '@/config/site';

interface HeroBannerProps {
  onNavigate?: (view: ActiveView) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-b from-[#060A17] via-[#0B132B] to-[#0D1B3A] py-10 sm:py-16 md:py-20 overflow-hidden w-full max-w-[100vw] border-b border-[#D4AF37]/30">
      {/* Background Decorative Gold Radial Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D4AF37]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Background Layer: Authentic Floating Golden Kaju Nut Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60">
        {[...Array(14)].map((_, i) => {
          const leftPos = (i * 7 + 4) % 95;
          const animDelay = (i * 0.6) % 5;
          const duration = 7 + (i % 4) * 2;
          const particleSize = 28 + (i % 3) * 8;
          const variant = i % 3;
          return (
            <motion.div
              key={i}
              initial={{ y: -30, opacity: 0, rotate: 0 }}
              animate={{
                y: ['0%', '1100%'],
                opacity: [0, 0.9, 0.9, 0],
                rotate: [0, 45, -45, 90],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: animDelay,
                ease: 'linear',
              }}
              style={{ left: `${leftPos}%` }}
              className="absolute top-0 select-none"
            >
              <CashewNutParticle size={particleSize} variant={variant} />
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        {/* Left Column Text Content */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
          {/* Top Royal Badge */}
          <div className="inline-flex items-center gap-2 border border-[#D4AF37]/60 bg-[#0B132B]/90 px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-[#F3E5AB]">
              Direct from Rajahmundry, Andhra Pradesh
            </span>
          </div>

          {/* Bold Modern Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F8F9FA] tracking-tight leading-[1.15]">
            King Jumbo Cashews & <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Royal Ghee Roasts</span>
          </h1>

          {/* Prominent High-Contrast Description */}
          <p className="text-sm sm:text-base text-gray-100 font-semibold max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Handpicked W-180 Emperor Jumbo Cashews, Pure Cow Ghee Roasts & Authentic Spice Infusions. Vacuum-sealed for uncompromised royal freshness.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <SquareButton
              variant="gold"
              size="lg"
              className="w-full sm:w-auto text-xs sm:text-sm py-3.5 px-8 shadow-[0_0_25px_rgba(212,175,55,0.4)] font-extrabold"
              onClick={() => onNavigate?.('products')}
            >
              <span>Shop Royal Collection</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </SquareButton>

            <SquareButton
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-xs sm:text-sm py-3.5 px-6 font-extrabold"
              onClick={() => onNavigate?.('about')}
            >
              Wholesale B2B Catalog
            </SquareButton>
          </div>

          {/* Key Metrics Badges */}
          <div className="pt-5 border-t border-[#D4AF37]/30 grid grid-cols-3 gap-3 text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-base sm:text-2xl font-extrabold gold-gradient-text">W-180</p>
              <p className="text-[9px] sm:text-[11px] uppercase text-gray-300 font-bold tracking-wider">King Jumbo Size</p>
            </div>
            <div>
              <p className="text-base sm:text-2xl font-extrabold gold-gradient-text">100%</p>
              <p className="text-[9px] sm:text-[11px] uppercase text-gray-300 font-bold tracking-wider">Pure Ghee Roast</p>
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start text-[#D4AF37] text-sm font-extrabold gap-1">
                <Star className="w-4 h-4 fill-[#D4AF37]" />
                <span>4.9 / 5</span>
              </div>
              <p className="text-[9px] sm:text-[11px] uppercase text-gray-300 font-bold tracking-wider">5,000+ Ratings</p>
            </div>
          </div>
        </div>

        {/* Right Column Product Showcase Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-[300px] sm:max-w-md bg-gradient-to-b from-[#1C2541] to-[#0B132B] border-2 border-[#D4AF37] p-3.5 shadow-[0_0_40px_rgba(212,175,55,0.3)] group">
            {/* Top Product Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#060A17] border border-[#D4AF37]/40">
              <img
                src="/assets/img-cashew-1.jpg"
                alt="W-180 King Jumbo Cashews"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <SquareBadge variant="gold" className="text-[10px] uppercase font-extrabold py-1 px-2">
                  🏆 Grade W-180 King Jumbo
                </SquareBadge>
              </div>
            </div>

            {/* Product Card Info */}
            <div className="pt-3 text-left space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm sm:text-lg text-[#F3E5AB]">
                  W-180 King Jumbo Cashews
                </h3>
                <span className="font-extrabold text-sm sm:text-base text-[#D4AF37]">
                  ₹890 / 500g
                </span>
              </div>

              <p className="text-xs text-gray-200 font-semibold leading-snug">
                Export Grade King Jumbo Whole Cashew Kernels from Rajahmundry. Nitrogen-sealed for maximum crunch.
              </p>

              <SquareButton
                variant="gold"
                size="sm"
                fullWidth
                onClick={() => onNavigate?.('products')}
                className="mt-1 py-2 text-xs font-extrabold"
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
