'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductsView } from '@/components/views/ProductsView';
import { useCart } from '@/context/CartContext';
import { PRODUCTS_CATALOG } from '@/data/products';
import { Product, CashewWeight } from '@/types';

function ProductsContent() {
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-8">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
