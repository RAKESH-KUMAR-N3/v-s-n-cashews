import React from 'react';
import { Product } from '@/types';
import { ActiveView } from '@/config/site';

interface SEOHeadProps {
  activeView?: ActiveView | string;
  selectedProduct?: Product | null;
  selectedCategory?: string;
  searchQuery?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = () => {
  return null;
};
