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
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { Product, CashewWeight, CashewGrade } from '@/types';
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

  // Reset to Page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedGrade, selectedWeightFilter, inStockOnly, maxPriceFilter, sortBy]);

  // Derive unique categories from products list
  const categoryNames = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtering Logic
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

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'stock') return list.sort((a, b) => b.stockQuantity - a.stockQuantity);
    if (sortBy === 'name-asc') return list.sort((a, b) => a.name.localeCompare(b.name));
    return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [filteredProducts, sortBy]);

  // Pagination Slice
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#F8F9FA]"
    >
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <SquareBadge variant="gold">Mangalore Reserve Catalog</SquareBadge>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F9FA]">
          Sovereign Cashew Collection
        </h1>
        <p className="text-xs sm:text-sm text-gray-300">
          Hand-sorted W-180 King Kernels, Ghee-Roasted Gourmet Flavors, and Bespoke Velvet Gift Hampers harvested directly from Mangalore orchards.
        </p>
      </div>

      {/* Main Controls Section */}
      <div className="border border-[#D4AF37]/30 bg-[#0B132B] p-4 sm:p-6 mb-8 space-y-6 shadow-xl">
        {/* Row 1: Search & Sort & View Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
          {/* Realtime Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by grade (W180), SKU, or title..."
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

          {/* Sort Dropdown, View Toggle & Reset */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#1C2541] border border-[#D4AF37]/40 px-3 py-2 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="stock">Highest Stock</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#D4AF37]/40 bg-[#1C2541] p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#D4AF37] text-[#0B132B]' : 'text-gray-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#D4AF37] text-[#0B132B]' : 'text-gray-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={resetAllFilters}
              className="p-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Reset All Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Tabs */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter By Category:
          </span>
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
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

        {/* Row 3: Sub-Filters (Grade, In-Stock, Price Range) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D4AF37]/15">
          {/* Grade Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
              Cashew Grade:
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-[#1C2541] border border-[#D4AF37]/30 py-1.5 px-3 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
            >
              {ALL_GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                Max Price:
              </label>
              <span className="text-xs font-bold text-[#F3E5AB]">₹{maxPriceFilter}</span>
            </div>
            <input
              type="range"
              min="300"
              max="3000"
              step="50"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>

          {/* In-Stock Toggle */}
          <div className="flex items-center pt-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F3E5AB]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Filter Stats Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-6 px-1">
        <span>
          Showing <strong className="text-[#D4AF37]">{paginatedProducts.length}</strong> of{' '}
          <strong className="text-[#F3E5AB]">{sortedProducts.length}</strong> products
        </span>
        {totalPages > 1 && (
          <span>
            Page <strong className="text-[#D4AF37]">{currentPage}</strong> of {totalPages}
          </span>
        )}
      </div>

      {/* Catalog Display */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/30 bg-[#0B132B] p-8 space-y-4">
          <p className="text-base font-serif text-[#F3E5AB]">
            No Cashew products found matching your filter criteria.
          </p>
          <SquareButton variant="gold" size="sm" onClick={resetAllFilters}>
            Clear All Filters
          </SquareButton>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => {
            const currentWeight = selectedWeights[product.id] || product.weights[0] || '500g';
            const isAdded = addedMap[product.id];

            return (
              <SquareCard
                key={product.id}
                glowOnHover
                className="flex flex-col justify-between h-full bg-[#0B132B] cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <SquareBadge variant="navy">{product.grade}</SquareBadge>
                    {product.inStock && product.stockQuantity > 0 ? (
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                        In Stock ({product.stockQuantity})
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Image Container */}
                  <div className="relative mb-4 group overflow-hidden border border-[#D4AF37]/30 bg-[#1C2541]">
                    <OptimizedImage
                      src={product.images[0]}
                      alt={product.name}
                      aspectRatio="square"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="px-3 py-1.5 bg-[#D4AF37] text-[#0B132B] font-bold text-xs uppercase flex items-center gap-1 cursor-pointer hover:bg-white transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Quick View
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-[#F3E5AB]">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif font-bold text-base text-[#F8F9FA] line-clamp-1 hover:text-[#D4AF37] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Weight Options Selector */}
                  <div className="mt-4 pt-3 border-t border-[#D4AF37]/20">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1.5">
                      Select Packaging Weight:
                    </label>
                    <div className="flex gap-1.5 flex-wrap">
                      {product.weights.map((w) => (
                        <button
                          key={w}
                          onClick={(e) => handleWeightSelect(product.id, w, e)}
                          className={`flex-1 min-w-[50px] py-1 text-[10px] font-semibold border transition-all cursor-pointer ${
                            currentWeight === w
                              ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37]'
                              : 'bg-[#1C2541] text-gray-300 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="mt-6 pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between gap-2">
                  <div>
                    {product.compareAtPrice && (
                      <span className="text-xs text-gray-400 block line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                    <span className="text-lg font-bold font-serif gold-gradient-text">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <SquareButton
                    variant={isAdded ? 'navy' : 'gold'}
                    size="sm"
                    disabled={!product.inStock || product.stockQuantity === 0}
                    onClick={(e) => handleAdd(product, e)}
                    className="shrink-0"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add To Bag
                      </>
                    )}
                  </SquareButton>
                </div>
              </SquareCard>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-4">
          {paginatedProducts.map((product) => {
            const currentWeight = selectedWeights[product.id] || product.weights[0] || '500g';
            const isAdded = addedMap[product.id];

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="border border-[#D4AF37]/30 bg-[#0B132B] p-4 flex flex-col md:flex-row gap-6 items-center hover:border-[#D4AF37] transition-all cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full md:w-48 h-40 object-cover border border-[#D4AF37]/40 flex-shrink-0"
                />

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <SquareBadge variant="navy">{product.grade}</SquareBadge>
                    <span className="text-xs text-[#D4AF37] font-semibold">{product.category}</span>
                    <span className="text-[10px] text-gray-400">SKU: {product.sku}</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#F8F9FA] hover:text-[#D4AF37]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-300">
                      {product.rating} ({product.reviewCount} customer reviews)
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      • {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-56 p-4 border-t md:border-t-0 md:border-l border-[#D4AF37]/20 flex flex-col justify-between h-full space-y-3">
                  <div>
                    <span className="text-xs text-gray-400 block">Unit Price</span>
                    <span className="text-2xl font-serif font-bold gold-gradient-text">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs line-through text-gray-500 block">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <SquareButton
                    variant={isAdded ? 'navy' : 'gold'}
                    size="md"
                    disabled={!product.inStock || product.stockQuantity === 0}
                    onClick={(e) => handleAdd(product, e)}
                    className="w-full"
                  >
                    {isAdded ? '✓ Added' : 'Add To Bag'}
                  </SquareButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-[#D4AF37]/30">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-2 border border-[#D4AF37]/40 text-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 border text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37]'
                  : 'bg-[#1C2541]/60 text-gray-300 border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 border border-[#D4AF37]/40 text-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
