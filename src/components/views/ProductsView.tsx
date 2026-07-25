'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  ShoppingBag,
  Check,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product, CashewWeight } from '@/types';
import { formatPrice } from '@/lib/utils';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';

interface ProductsViewProps {
  products?: Product[];
  onAddToCart: (product: Product, weight: CashewWeight) => void;
  onSelectProduct: (product: Product) => void;
  initialSearchTerm?: string;
  initialCategory?: string;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products = [],
  onAddToCart,
  onSelectProduct,
  initialSearchTerm = '',
  initialCategory = 'All',
}) => {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGrade, setSelectedGrade] = useState<string>('All');

  // Sorting
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Selected weight per product
  const [selectedWeights, setSelectedWeights] = useState<Record<string, CashewWeight>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedGrade, sortBy]);

  const categoryNames = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesGrade =
        selectedGrade === 'All' || p.grade.toLowerCase() === selectedGrade.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesGrade && matchesSearch;
    });
  }, [products, selectedCategory, selectedGrade, searchTerm]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const handleWeightSelect = (productId: string, weight: CashewWeight, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWeights((prev) => ({ ...prev, [productId]: weight }));
  };

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const weight = selectedWeights[product.id] || product.weights[0] || '500g';
    onAddToCart(product, weight);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [product.id]: false })), 1500);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedGrade('All');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-10 text-[#F8F9FA] overflow-x-hidden w-full"
    >
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8 space-y-1">
        <SquareBadge variant="gold">Hyderabad Hub Reserve Catalog 🥜</SquareBadge>
        <h1 className="font-serif text-xl sm:text-4xl font-extrabold text-[#F8F9FA]">
          Royal Cashew Collection
        </h1>
        <p className="text-xs text-gray-300">
          Hand-picked W-180 King Kernels, Ghee-Roasted Gourmet Flavors & Velvet Gift Hampers.
        </p>
      </div>

      {/* Main Controls Section */}
      <div className="border border-[#D4AF37]/30 bg-[#0B132B] p-2.5 sm:p-5 mb-5 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#D4AF37]/20">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#D4AF37]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search grade (W180), SKU, title..."
              className="w-full bg-[#1C2541] border border-[#D4AF37]/40 pl-8 pr-7 py-1.5 text-xs text-[#F8F9FA] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-[#1C2541] border border-[#D4AF37]/40 px-2 py-1.5 text-xs text-[#F8F9FA] focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>

            <button
              onClick={resetAllFilters}
              className="p-1.5 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors text-xs shrink-0"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Categories:
          </span>
          <div className="flex flex-wrap gap-1">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-0.5 px-2 border text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37] font-bold'
                    : 'bg-[#1C2541]/60 text-gray-300 border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#D4AF37]/30 bg-[#0B132B] p-4 space-y-2">
          <p className="text-xs font-serif text-[#F3E5AB]">
            No Cashew products found matching your filter criteria.
          </p>
          <SquareButton variant="gold" size="sm" onClick={resetAllFilters}>
            Clear All Filters
          </SquareButton>
        </div>
      ) : (
        /* ULTRA-COMPACT MOBILE GRID (2 Cols on Mobile) */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
          {paginatedProducts.map((product) => {
            const currentWeight = selectedWeights[product.id] || product.weights[0] || '500g';
            const isAdded = addedMap[product.id];

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="flex flex-col justify-between bg-[#0B132B] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-2 sm:p-3.5 transition-all shadow-md cursor-pointer group"
              >
                <div>
                  {/* Top Grade Badge */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[8px] sm:text-xs font-bold px-1 py-0.5 bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]/30">
                      {product.grade}
                    </span>
                    <span className="text-[8px] font-bold text-emerald-400 uppercase">
                      In Stock
                    </span>
                  </div>

                  {/* Image Aspect 4/3 */}
                  <div className="relative mb-1.5 overflow-hidden border border-[#D4AF37]/20 bg-[#1C2541] aspect-[4/3]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-semibold text-[#F3E5AB]">
                      {product.rating}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="font-serif font-bold text-xs sm:text-base text-[#F8F9FA] line-clamp-1 hover:text-[#D4AF37]">
                    {product.name}
                  </h3>

                  {/* Compact Weight Selector */}
                  <div className="mt-1.5 pt-1.5 border-t border-[#D4AF37]/20">
                    <div className="flex gap-1">
                      {product.weights.slice(0, 3).map((w) => (
                        <button
                          key={w}
                          onClick={(e) => handleWeightSelect(product.id, w, e)}
                          className={`flex-1 py-0.5 text-[8px] sm:text-[10px] font-semibold border transition-all cursor-pointer ${
                            currentWeight === w
                              ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37]'
                              : 'bg-[#1C2541] text-gray-300 border-[#D4AF37]/30'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Add Button Inline */}
                <div className="mt-2 pt-1.5 border-t border-[#D4AF37]/30 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-base font-bold font-serif gold-gradient-text">
                    {formatPrice(product.price)}
                  </span>

                  <button
                    onClick={(e) => handleAdd(product, e)}
                    className={`py-1 px-2 text-[9px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] text-[#0B132B] hover:opacity-90'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3 h-3" /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6 pt-3 border-t border-[#D4AF37]/30">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-1 border border-[#D4AF37]/40 text-[#D4AF37] disabled:opacity-30 hover:bg-[#D4AF37] hover:text-[#0B132B]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 border text-[11px] font-bold ${
                currentPage === page
                  ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37]'
                  : 'bg-[#1C2541]/60 text-gray-300 border-[#D4AF37]/30'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-1 border border-[#D4AF37]/40 text-[#D4AF37] disabled:opacity-30 hover:bg-[#D4AF37] hover:text-[#0B132B]"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
