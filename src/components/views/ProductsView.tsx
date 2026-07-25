'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  ShoppingBag,
  Eye,
  Check,
  Search,
  Filter,
  RefreshCw,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product, CashewWeight } from '@/types';
import { formatPrice } from '@/lib/utils';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareCard } from '@/components/ui/SquareCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ProductsViewProps {
  products?: Product[];
  onAddToCart: (product: Product, weight: CashewWeight) => void;
  onSelectProduct: (product: Product) => void;
  initialSearchTerm?: string;
  initialCategory?: string;
}

const ALL_GRADES = ['All', 'W-180', 'W-240', 'W-320', 'Splits', 'Gourmet Flavored', 'Royal Gift Box'];

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
  const [selectedWeightFilter, setSelectedWeightFilter] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3000);

  // Sorting & Layout
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'rating' | 'stock' | 'name-asc'
  >('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
  }, [searchTerm, selectedCategory, selectedGrade, selectedWeightFilter, inStockOnly, maxPriceFilter, sortBy]);

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

      const matchesWeight =
        selectedWeightFilter === 'All' || p.weights.includes(selectedWeightFilter as CashewWeight);

      const matchesStock = !inStockOnly || (p.inStock && p.stockQuantity > 0);

      const matchesPrice = p.price <= maxPriceFilter;

      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesGrade && matchesWeight && matchesStock && matchesPrice && matchesSearch;
    });
  }, [
    products,
    selectedCategory,
    selectedGrade,
    selectedWeightFilter,
    inStockOnly,
    maxPriceFilter,
    searchTerm,
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'stock') return list.sort((a, b) => b.stockQuantity - a.stockQuantity);
    if (sortBy === 'name-asc') return list.sort((a, b) => a.name.localeCompare(b.name));
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
    setSelectedWeightFilter('All');
    setInStockOnly(false);
    setMaxPriceFilter(3000);
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 text-[#F8F9FA] overflow-x-hidden w-full"
    >
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 space-y-2">
        <SquareBadge variant="gold">Hyderabad Hub Reserve Catalog 🥜</SquareBadge>
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#F8F9FA]">
          Royal Cashew Collection
        </h1>
        <p className="text-xs sm:text-sm text-gray-300">
          Hand-picked W-180 King Kernels, Ghee-Roasted Gourmet Flavors, and Bespoke Velvet Gift Hampers harvested directly for Kukatpally, Hyderabad.
        </p>
      </div>

      {/* Main Controls Section */}
      <div className="border border-[#D4AF37]/30 bg-[#0B132B] p-3 sm:p-6 mb-6 space-y-4 shadow-xl">
        {/* Row 1: Search & Sort & View Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-[#D4AF37]/20">
          {/* Realtime Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search grade (W180), SKU, title..."
              className="w-full bg-[#1C2541] border border-[#D4AF37]/40 pl-9 pr-8 py-2 text-xs text-[#F8F9FA] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-[#1C2541] border border-[#D4AF37]/40 px-2.5 py-2 text-xs text-[#F8F9FA] focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>

            <button
              onClick={resetAllFilters}
              className="p-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors text-xs shrink-0"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Category Tabs */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1.5 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Categories:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 px-2.5 border text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
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

      {/* Catalog Display */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#D4AF37]/30 bg-[#0B132B] p-6 space-y-3">
          <p className="text-sm font-serif text-[#F3E5AB]">
            No Cashew products found matching your filter criteria.
          </p>
          <SquareButton variant="gold" size="sm" onClick={resetAllFilters}>
            Clear All Filters
          </SquareButton>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {paginatedProducts.map((product) => {
            const currentWeight = selectedWeights[product.id] || product.weights[0] || '500g';
            const isAdded = addedMap[product.id];

            return (
              <SquareCard
                key={product.id}
                glowOnHover
                className="flex flex-col justify-between h-full bg-[#0B132B] cursor-pointer p-3 sm:p-4"
                onClick={() => onSelectProduct(product)}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <SquareBadge variant="navy">{product.grade}</SquareBadge>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                      In Stock
                    </span>
                  </div>

                  {/* Image Container */}
                  <div className="relative mb-3 group overflow-hidden border border-[#D4AF37]/30 bg-[#1C2541]">
                    <OptimizedImage
                      src={product.images[0]}
                      alt={product.name}
                      aspectRatio="square"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-[#F3E5AB]">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#F8F9FA] line-clamp-1 hover:text-[#D4AF37]">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Weight Options Selector */}
                  <div className="mt-3 pt-2 border-t border-[#D4AF37]/20">
                    <div className="flex gap-1 flex-wrap">
                      {product.weights.map((w) => (
                        <button
                          key={w}
                          onClick={(e) => handleWeightSelect(product.id, w, e)}
                          className={`py-0.5 px-2 text-[9px] font-semibold border transition-all cursor-pointer ${
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

                {/* Price & Add to Cart */}
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 flex items-center justify-between gap-2">
                  <div>
                    {product.compareAtPrice && (
                      <span className="text-[10px] text-gray-400 block line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                    <span className="text-base font-bold font-serif gold-gradient-text">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <SquareButton
                    variant={isAdded ? 'navy' : 'gold'}
                    size="sm"
                    onClick={(e) => handleAdd(product, e)}
                    className="shrink-0 text-xs py-1.5 px-2.5"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                      </>
                    )}
                  </SquareButton>
                </div>
              </SquareCard>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-[#D4AF37]/30">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-1.5 border border-[#D4AF37]/40 text-[#D4AF37] disabled:opacity-30 hover:bg-[#D4AF37] hover:text-[#0B132B]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 border text-xs font-bold ${
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
            className="p-1.5 border border-[#D4AF37]/40 text-[#D4AF37] disabled:opacity-30 hover:bg-[#D4AF37] hover:text-[#0B132B]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
