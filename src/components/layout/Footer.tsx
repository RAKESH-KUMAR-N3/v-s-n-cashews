'use client';

import React, { useState } from 'react';
import { Shield, Award, Truck, ShieldCheck, Mail, MapPin, Instagram, Facebook, Youtube, Check } from 'lucide-react';
import { SITE_CONFIG, ActiveView } from '@/config/site';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';

interface FooterProps {
  onNavigate?: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNav = (view: ActiveView, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-[#0A0F1D] border-t-2 border-[#D4AF37]/40 text-[#F8F9FA] mt-20 relative overflow-hidden">
      {/* Background Subtle Gold Crest Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      {/* Trust Badges Bar */}
      <div className="border-b border-[#D4AF37]/20 py-10 bg-[#0B132B]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {SITE_CONFIG.trustBadges.map((badge, index) => {
            const icons = [Award, MapPin, Shield, Truck];
            const IconComponent = icons[index % icons.length];
            return (
              <div
                key={badge.title}
                className="flex items-center gap-3 p-3 border border-[#D4AF37]/20 bg-[#1C2541]/40"
              >
                <div className="p-2 border border-[#D4AF37] text-[#D4AF37]">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#F3E5AB]">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-gray-400">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#D4AF37] bg-[#1C2541] flex items-center justify-center text-[#D4AF37] font-serif font-black text-xl">
              VSN
            </div>
            <span className="font-serif text-2xl font-bold tracking-wider text-[#F8F9FA]">
              V S N CASHEWS
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            {SITE_CONFIG.originStory}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={SITE_CONFIG.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={SITE_CONFIG.social.youtube}
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] pb-2 border-b border-[#D4AF37]/30">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <button onClick={(e) => handleNav('home', e)} className="hover:text-[#D4AF37] transition-colors text-left">
                Home Overview
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('products', e)} className="hover:text-[#D4AF37] transition-colors text-left">
                All Cashew Products
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('about', e)} className="hover:text-[#D4AF37] transition-colors text-left">
                Mangalore Heritage
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('orders', e)} className="hover:text-[#D4AF37] transition-colors text-left text-[#F3E5AB] font-bold">
                Track Order & History
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('quotes', e)} className="hover:text-[#D4AF37] transition-colors text-left text-[#F3E5AB] font-bold">
                B2B Wholesale Quotes
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('invoices', e)} className="hover:text-[#D4AF37] transition-colors text-left text-[#F3E5AB] font-bold">
                GST Tax Receipts & Invoices
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('contact', e)} className="hover:text-[#D4AF37] transition-colors text-left">
                Contact & Wholesale
              </button>
            </li>
          </ul>
        </div>

        {/* Cashew Collection Grades */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] pb-2 border-b border-[#D4AF37]/30">
            Cashew Grades
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <button onClick={(e) => handleNav('products', e)} className="hover:text-[#D4AF37] transition-colors text-left">
                W-180 Emperor King
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('products', e)} className="hover:text-[#D4AF37] transition-colors text-left">
                W-240 Royal Select
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('products', e)} className="hover:text-[#D4AF37] transition-colors text-left">
                Ghee Roasted & Salted
              </button>
            </li>
            <li>
              <button onClick={(e) => handleNav('products', e)} className="hover:text-[#D4AF37] transition-colors text-left">
                Royal Velvet Gift Hampers
              </button>
            </li>
          </ul>
        </div>

        {/* Royal Newsletter */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] pb-2 border-b border-[#D4AF37]/30">
            Royal Gazette
          </h4>
          <p className="text-[11px] text-gray-400">
            Subscribe to receive private harvest releases and festive gift box catalogues.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <SquareInput
              placeholder="Enter your email"
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />
            <SquareButton variant="gold" size="sm" fullWidth type="submit">
              {subscribed ? (
                <span className="flex items-center justify-center gap-1 text-emerald-400">
                  <Check className="w-4 h-4" /> Subscribed
                </span>
              ) : (
                'Join Gazette'
              )}
            </SquareButton>
          </form>
        </div>
      </div>

      {/* Bottom Copyright & Security Badges */}
      <div className="border-t border-[#D4AF37]/20 py-6 bg-[#070B16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} V S N CASHEWS. All Sovereign Rights Reserved. Kukatpally, Hyderabad, Telangana.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#F3E5AB]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Razorpay 256-bit Encrypted
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
