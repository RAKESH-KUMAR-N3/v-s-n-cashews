'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product, CashewWeight } from '@/types';
import { formatPrice } from '@/lib/utils';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { PRODUCTS_CATALOG } from '@/data/products';

interface FeaturedProductsProps {
  onAddToCart: (product: Product, weight: CashewWeight) => void;
  onSelectProduct?: (product: Product) => void;
  searchTerm?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onAddToCart,
  onSelectProduct,
  searchTerm = '',
}) => {
  const [selectedWeights, setSelectedWeights] = useState<Record<string, CashewWeight>>({
    'prod-w180-king': '500g',
    'prod-w240-jumbo': '500g',
    'prod-roasted-salted': '500g',
    'prod-gift-box-sovereign': '1kg',
  });

  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const featuredList = PRODUCTS_CATALOG.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 4);

  const filteredProducts = featuredList.filter((p) =>
    searchTerm
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const handleWeightChange = (productId: string, weight: CashewWeight, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWeights((prev) => ({ ...prev, [productId]: weight }));
  };

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const weight = selectedWeights[product.id] || '500g';
    onAddToCart(product, weight);

    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="products" className="py-8 sm:py-16 bg-[#1C2541]/40 relative">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-1.5">
          <SquareBadge variant="gold">Rajahmundry Reserve</SquareBadge>
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#F8F9FA]">
            Signature Sovereign Collection
          </h2>
          <p className="text-xs text-gray-300">
            Vacuum-sealed in nitrogen-flushed metalized pouches to preserve orchard crispness.
          </p>
        </div>

        {/* Ultra-Compact Mobile Grid: 2 Columns on Mobile, 4 on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
          {filteredProducts.map((product) => {
            const currentWeight = selectedWeights[product.id] || '500g';
            const isAdded = addedItemMap[product.id];

            return (
              <motion.div
                key={product.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectProduct?.(product)}
                className="flex flex-col justify-between bg-[#0B132B] border border-[#D4AF37]/30 hover:border-[#D4AF37] p-2 sm:p-3.5 transition-all shadow-md relative group cursor-pointer"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[8px] sm:text-xs font-bold px-1 py-0.5 bg-[#1C2541] text-[#D4AF37] border border-[#D4AF37]/30">
                      {product.grade}
                    </span>
                    {product.isBestSeller && (
                      <span className="text-[8px] sm:text-xs font-extrabold px-1 py-0.5 bg-[#D4AF37] text-[#0B132B]">
                        Best Seller
                      </span>
                    )}
                  </div>

                  {/* Compact Product Image (Aspect 4/3 to reduce card height) */}
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
                          onClick={(e) => handleWeightChange(product.id, w, e)}
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

                {/* Price & Add Button Inline Side-by-Side */}
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
