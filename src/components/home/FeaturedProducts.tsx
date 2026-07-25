import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product, CashewWeight } from '@/types';
import { formatPrice } from '@/lib/utils';
import { SquareCard } from '@/components/ui/SquareCard';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
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
    <section id="products" className="py-20 bg-[#1C2541]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <SquareBadge variant="gold">Mangalore Reserve</SquareBadge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F8F9FA]">
            Signature Sovereign Collection
          </h2>
          <p className="text-xs text-gray-300">
            Vacuum-sealed in nitrogen-flushed metalized pouches to preserve orchard crispness for up to 12 months.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const currentWeight = selectedWeights[product.id] || '500g';
            const isAdded = addedItemMap[product.id];

            return (
              <SquareCard
                key={product.id}
                glowOnHover
                onClick={() => onSelectProduct?.(product)}
                className="flex flex-col justify-between h-full bg-[#0B132B] cursor-pointer"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <SquareBadge variant="navy">{product.grade}</SquareBadge>
                    {product.isBestSeller && (
                      <SquareBadge variant="gold">Best Seller</SquareBadge>
                    )}
                  </div>

                  {/* Image Container */}
                  <div className="relative mb-4 overflow-hidden border border-[#D4AF37]/30 bg-[#1C2541] group">
                    <OptimizedImage
                      src={product.images[0]}
                      alt={product.name}
                      aspectRatio="square"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct?.(product);
                        }}
                        className="p-2 bg-[#D4AF37] text-[#0B132B] font-bold text-xs uppercase flex items-center gap-1 cursor-pointer hover:bg-white transition-colors"
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
                    <div className="flex gap-1.5">
                      {product.weights.map((w) => (
                        <button
                          key={w}
                          onClick={(e) => handleWeightChange(product.id, w, e)}
                          className={`flex-1 py-1 text-[11px] font-semibold border transition-all cursor-pointer ${
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
                    <span className="text-xs text-gray-400 block line-through">
                      {product.compareAtPrice && formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="text-lg font-bold font-serif gold-gradient-text">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <SquareButton
                    variant={isAdded ? 'navy' : 'gold'}
                    size="sm"
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
      </div>
    </section>
  );
};
