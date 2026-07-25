'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { AboutBriefSection } from '@/components/home/AboutBriefSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Product, CashewWeight } from '@/types';
import { ActiveView } from '@/config/site';

interface HomeViewProps {
  onAddToCart: (product: Product, weight: CashewWeight) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: ActiveView) => void;
  onSelectCategory: (category: string) => void;
  searchTerm?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onAddToCart,
  onSelectProduct,
  onNavigate,
  onSelectCategory,
  searchTerm = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 1. Hero Banner */}
      <HeroBanner onNavigate={onNavigate} />

      {/* 2. Brief About Us Section (Why VSN Cashews - Heritage of Rajahmundry) */}
      <AboutBriefSection onNavigate={onNavigate} />

      {/* 3. Best Seller Products Catalog Section */}
      <FeaturedProducts
        onAddToCart={onAddToCart}
        onSelectProduct={onSelectProduct}
        searchTerm={searchTerm}
      />

      {/* 4. Bottom Wholesale CTA Banner */}
      <CtaBanner onNavigate={onNavigate} />
    </motion.div>
  );
};
