'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandTrust } from '@/components/home/BrandTrust';
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
      <HeroBanner onNavigate={onNavigate} />
      <CategoryGrid onSelectCategory={onSelectCategory} />
      <FeaturedProducts
        onAddToCart={onAddToCart}
        onSelectProduct={onSelectProduct}
        searchTerm={searchTerm}
      />
      <BrandTrust />
    </motion.div>
  );
};
