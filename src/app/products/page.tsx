'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductsView } from '@/components/views/ProductsView';
import { useCart } from '@/context/CartContext';
import { PRODUCTS_CATALOG } from '@/data/products';
import { Product, CashewWeight } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const { addToCart } = useCart();
  const [products] = useState<Product[]>(PRODUCTS_CATALOG);

  const handleAddToCart = (product: Product, weight: CashewWeight, quantity = 1) => {
    addToCart(product, weight, quantity);
  };

  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.slug || product.id}`);
  };

  return (
    <ProductsView
      products={products}
      onAddToCart={handleAddToCart}
      onSelectProduct={handleSelectProduct}
      initialCategory={initialCategory}
      initialSearchTerm={initialSearch}
    />
  );
}
