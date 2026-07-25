'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProductDashboard } from '@/components/admin/AdminProductDashboard';
import { PRODUCTS_CATALOG } from '@/data/products';
import { INITIAL_CATEGORIES } from '@/data/categories';
import { Product, Category } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(PRODUCTS_CATALOG);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminProductDashboard
      products={products}
      categories={categories}
      onAddProduct={handleAddProduct}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
      onAddCategory={handleAddCategory}
      onUpdateCategory={handleUpdateCategory}
      onDeleteCategory={handleDeleteCategory}
      onViewProductPublic={(slug) => router.push(`/products/${slug}`)}
    />
  );
}
