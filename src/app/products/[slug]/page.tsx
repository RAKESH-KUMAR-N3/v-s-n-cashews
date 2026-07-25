'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProductDetailsView } from '@/components/views/ProductDetailsView';
import { useCart } from '@/context/CartContext';
import { PRODUCTS_CATALOG } from '@/data/products';
import { Product, CashewWeight } from '@/types';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const product = PRODUCTS_CATALOG.find((p) => p.slug === slug || p.id === slug) || PRODUCTS_CATALOG[0];
  const { addToCart } = useCart();

  const handleAddToCart = (p: Product, weight: CashewWeight, quantity = 1) => {
    addToCart(p, weight, quantity);
  };

  const handleSelectProduct = (p: Product) => {
    router.push(`/products/${p.slug || p.id}`);
  };

  return (
    <ProductDetailsView
      product={product}
      onBack={() => router.push('/products')}
      onAddToCart={handleAddToCart}
      onSelectProduct={handleSelectProduct}
    />
  );
}
