'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HomeView } from '@/components/views/HomeView';
import { useCart } from '@/context/CartContext';
import { Product, CashewWeight } from '@/types';
import { ActiveView } from '@/config/site';

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product, weight: CashewWeight, quantity = 1) => {
    addToCart(product, weight, quantity);
  };

  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.slug || product.id}`);
  };

  const handleNavigate = (view: ActiveView) => {
    if (view === 'home') router.push('/');
    else router.push(`/${view}`);
  };

  const handleSelectCategory = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <HomeView
      onAddToCart={handleAddToCart}
      onSelectProduct={handleSelectProduct}
      onNavigate={handleNavigate}
      onSelectCategory={handleSelectCategory}
    />
  );
}
