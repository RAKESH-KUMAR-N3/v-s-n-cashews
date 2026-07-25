'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, MapPin, Sparkles, CheckCircle2, ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { SITE_CONFIG, ActiveView } from '@/config/site';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface AboutViewProps {
  onNavigate: (view: ActiveView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const processSteps = [
    {
      step: '01',
      title: 'Selective Harvest Selection',
      desc: 'Handpicked premium raw cashew nuts at peak oil density.',
    },
    {
      step: '02',
      title: 'Sun Drying & Moisture Calibration',
      desc: 'Naturally solar-cured to achieve optimal 8% kernel humidity.',
    },
    {
      step: '03',
      title: 'Gentle Thermal Shelling',
      desc: 'Steam-assisted thermal cracking preserving whole kernel structure without scorching.',
    },
    {
      step: '04',
      title: 'Borma Gentle De-Humidification',
      desc: 'Controlled hot-air baking to loosen outer skin while preserving sweet natural fats.',
    },
    {
      step: '05',
      title: 'Laser & Master Hand Grading',
      desc: 'Sorting and classification of W-180 Jumbo to W-320 Whole standards.',
    },
    {
      step: '06',
      title: 'Metal Detection & Purity Audits',
      desc: 'Dual-pass electromagnetic screening ensuring zero foreign matter contamination.',
    },
    {
      step: '07',
      title: 'Nitrogen Flushed Vacuum Sealing',
      desc: 'Injected with food-grade nitrogen inside multi-layer barrier foil to guarantee crisp freshness.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#F8F9FA] space-y-20"
    >
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <SquareBadge variant="gold">Hyderabad Hub • Kukatpally</SquareBadge>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F9FA] leading-tight">
          The Sovereign Legacy of V S N Cashews
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          V S N CASHEWS champions uncompromised purity, hand-grading perfection, and direct freshness right from Kukatpally, Hyderabad, Telangana.
        </p>
      </div>

      {/* Main Grid Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
            <MapPin className="w-4 h-4" /> Main Road, Phase 1, Kukatpally, Hyderabad
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3E5AB]">
            Where Quality Meets Master Artisanship
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            V S N CASHEWS delivers premium cashew kernels renowned worldwide for their buttery creaminess, sweet crunch, and unbeatable fresh taste.
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Unlike commercial mass-processing factories that rely on harsh chemical bleaching or artificial glazing, V S N CASHEWS strictly adheres to non-bleached natural processing.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#D4AF37]/30">
            <div className="p-3 border border-[#D4AF37]/20 bg-[#1C2541]/40">
              <span className="font-serif text-2xl font-bold text-[#D4AF37] block">Hyderabad Hub</span>
              <span className="text-[11px] text-gray-400">Kukatpally Phase 1 Dispatch</span>
            </div>
            <div className="p-3 border border-[#D4AF37]/20 bg-[#1C2541]/40">
              <span className="font-serif text-2xl font-bold text-[#D4AF37] block">100% Zero Bleach</span>
              <span className="text-[11px] text-gray-400">Natural Creamy Kernel Hue</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 border-2 border-[#D4AF37]/40 p-2 bg-[#0B132B] shadow-2xl relative">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800"
            alt="Cashew Processing Kukatpally Hyderabad"
            aspectRatio="square"
          />
          <div className="absolute bottom-6 right-6 bg-[#0B132B]/90 border border-[#D4AF37] p-4 text-xs space-y-1">
            <span className="text-[#D4AF37] font-bold block">180 Kernels Per Pound</span>
            <span className="text-gray-300">W-180 Sovereign Emperor Grade</span>
          </div>
        </div>
      </div>

      {/* 7-Stage Process Timeline */}
      <div className="space-y-10 border-t border-[#D4AF37]/30 pt-16">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <SquareBadge variant="gold">Process Discipline</SquareBadge>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F9FA]">
            Our 7-Stage Sovereign Processing Protocol
          </h2>
          <p className="text-xs text-gray-300">
            How raw cashew nuts transform into vacuum-sealed perfection at our Kukatpally, Hyderabad facility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((s) => (
            <div
              key={s.step}
              className="p-5 border border-[#D4AF37]/30 bg-[#0B132B] flex flex-col justify-between hover:border-[#D4AF37] transition-all"
            >
              <div>
                <span className="font-serif font-black text-2xl text-[#D4AF37] block mb-2">
                  {s.step}
                </span>
                <h3 className="font-serif font-bold text-sm text-[#F3E5AB] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Final CTA Card */}
          <div className="p-5 border border-[#D4AF37] bg-gradient-to-br from-[#1C2541] to-[#0B132B] flex flex-col justify-between">
            <div>
              <Sparkles className="w-6 h-6 text-[#D4AF37] mb-2" />
              <h3 className="font-serif font-bold text-base text-[#F8F9FA] mb-2">
                Experience the Difference
              </h3>
              <p className="text-xs text-gray-300 mb-4">
                Taste authentic W-180 Jumbo kernels fresh from our Hyderabad store.
              </p>
            </div>
            <SquareButton
              variant="gold"
              size="sm"
              fullWidth
              onClick={() => onNavigate('products')}
            >
              Explore Catalog <ArrowRight className="w-4 h-4 ml-1" />
            </SquareButton>
          </div>
        </div>
      </div>

      {/* Quality Promises & Certifications */}
      <div className="border border-[#D4AF37]/30 bg-[#1C2541]/40 p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <SquareBadge variant="navy">Sovereign Guarantee</SquareBadge>
          <h2 className="font-serif text-2xl font-bold text-[#F8F9FA]">
            Our Four Quality Commandments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase text-[#F3E5AB] tracking-wider mb-1">
                Zero Chemical Bleaching
              </h4>
              <p className="text-[11px] text-gray-400">
                100% natural off-white hue preserved through precise temperature regulation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase text-[#F3E5AB] tracking-wider mb-1">
                FSSAI Certified
              </h4>
              <p className="text-[11px] text-gray-400">
                Processed under strict ISO food safety and hygiene protocols in Hyderabad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase text-[#F3E5AB] tracking-wider mb-1">
                Direct Best Pricing
              </h4>
              <p className="text-[11px] text-gray-400">
                Direct processor pricing for retail and wholesale customers in Hyderabad & pan India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase text-[#F3E5AB] tracking-wider mb-1">
                Nitrogen Freshness Lock
              </h4>
              <p className="text-[11px] text-gray-400">
                Dual-layer pouches impervious to humidity, air, and light degradation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
