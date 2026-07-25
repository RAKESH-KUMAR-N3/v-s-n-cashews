'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Product, CashewWeight } from '@/types';
import { formatPrice } from '@/lib/utils';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareCard } from '@/components/ui/SquareCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { PRODUCTS_CATALOG } from '@/data/products';

interface ProductDetailsViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, weight: CashewWeight, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  onBack,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<CashewWeight>(
    product.selectedWeight || product.weights[0] || '500g'
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Dynamic SEO Injection
  useEffect(() => {
    const metaTitle = product.seo?.metaTitle || `${product.name} | V S N CASHEWS`;
    const metaDesc = product.seo?.metaDescription || product.description;
    
    document.title = metaTitle;

    // Update Meta Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', metaDesc);

    // Update Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (product.seo?.canonicalUrl) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', product.seo.canonicalUrl);
    }

    return () => {
      document.title = 'V S N CASHEWS | Sovereign Grade Mangalore Cashew Nuts';
    };
  }, [product]);

  // Price calculation based on variants or weight multipliers
  const getCalculatedPrice = (): number => {
    if (product.variants && product.variants.length > 0) {
      const match = product.variants.find((v) => v.weight === selectedWeight);
      if (match) return match.price;
    }
    const weightMultiplier = (w: CashewWeight): number => {
      switch (w) {
        case '250g':
          return 0.55;
        case '500g':
          return 1.0;
        case '1kg':
          return 1.9;
        case '2kg Pack':
          return 3.7;
        case '5kg Master Box':
          return 8.8;
        default:
          return 1.0;
      }
    };
    return Math.round(product.price * weightMultiplier(selectedWeight));
  };

  const calculatedPrice = getCalculatedPrice();

  const handleAdd = () => {
    onAddToCart(
      { ...product, price: calculatedPrice },
      selectedWeight,
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = PRODUCTS_CATALOG.filter(
    (p) => p.id !== product.id
  ).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#F8F9FA]"
    >
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4AF37]/20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
        </button>
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span>Catalog</span>
          <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
          <span>{product.category}</span>
          <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
          <span className="text-[#F3E5AB] font-semibold">{product.grade}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-2 border-[#D4AF37]/50 p-2 bg-[#0B132B] shadow-2xl relative">
            <OptimizedImage
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              aspectRatio="square"
              className="w-full h-full object-cover"
            />
            {product.isBestSeller && (
              <div className="absolute top-4 left-4 z-10">
                <SquareBadge variant="gold">Mangalore Best Seller</SquareBadge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 border-2 transition-all cursor-pointer overflow-hidden ${
                    selectedImageIndex === idx
                      ? 'border-[#D4AF37] scale-105'
                      : 'border-[#D4AF37]/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <OptimizedImage src={img} alt={`Thumbnail ${idx}`} className="w-full h-full" />
                </button>
              ))}
            </div>
          )}

          {/* Quality Trust Card */}
          <div className="p-4 border border-[#D4AF37]/30 bg-[#1C2541]/40 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
              <ShieldCheck className="w-4 h-4" /> 7-Stage Nitrogen Vacuum Freshness Lock
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Every pack is sealed within 48 hours of shelling in our Mangalore processing estate, locking in uncompromised crisp crunch for up to 12 months.
            </p>
          </div>
        </div>

        {/* Right Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <SquareBadge variant="gold">{product.grade}</SquareBadge>
              <SquareBadge variant="navy">{product.category}</SquareBadge>
              <span className="text-[11px] text-gray-400 tracking-widest uppercase">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F8F9FA] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#F3E5AB]">
                {product.rating} / 5.0
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviewCount} Verified Buyer Reviews)
              </span>
            </div>
          </div>

          {/* Origin Banner */}
          <div className="flex items-center gap-2 p-3 border border-[#D4AF37]/30 bg-[#0B132B] text-xs">
            <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-gray-300">
              Harvest Origin:{' '}
              <strong className="text-[#F3E5AB]">{product.origin}</strong>
            </span>
          </div>

          {/* Price & Weight Selection */}
          <div className="p-5 border border-[#D4AF37]/40 bg-[#1C2541]/50 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Unit Investment Price:</span>
                <span className="text-3xl font-bold font-serif gold-gradient-text">
                  {formatPrice(calculatedPrice)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xs text-gray-400 line-through ml-3">
                    {formatPrice(
                      Math.round(
                        product.compareAtPrice * (product.price > 0 ? calculatedPrice / product.price : 1)
                      )
                    )}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1">
                  <Check className="w-3.5 h-3.5" /> Direct Stock Ready
                </span>
              </div>
            </div>

            {/* Weight Selectors */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                Select Packaging Weight & Size:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`py-2.5 px-3 border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedWeight === w
                        ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37] font-bold shadow-md'
                        : 'bg-[#0B132B] text-gray-300 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Bag */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <div className="flex items-center border border-[#D4AF37] bg-[#0B132B]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm font-bold text-[#D4AF37] hover:bg-[#1C2541] cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-[#F8F9FA]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-sm font-bold text-[#D4AF37] hover:bg-[#1C2541] cursor-pointer"
                >
                  +
                </button>
              </div>

              <SquareButton
                variant={isAdded ? 'navy' : 'gold'}
                size="lg"
                fullWidth
                onClick={handleAdd}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" /> Added To Royal Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add To Shopping Bag (
                    {formatPrice(calculatedPrice * quantity)})
                  </>
                )}
              </SquareButton>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Taste Profile & Processing Description
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Nutritional Facts Table */}
          {product.nutritionalInfo && (
            <div className="border border-[#D4AF37]/30 bg-[#0B132B] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB] flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#D4AF37]" /> Nutritional Info (per 100g serving)
                </span>
                <span className="text-[10px] text-gray-400">Verified Lab Batch</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-2 border border-[#D4AF37]/20 bg-[#1C2541]/40">
                  <span className="text-[10px] text-gray-400 block">Energy</span>
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {product.nutritionalInfo.calories}
                  </span>
                </div>
                <div className="p-2 border border-[#D4AF37]/20 bg-[#1C2541]/40">
                  <span className="text-[10px] text-gray-400 block">Protein</span>
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {product.nutritionalInfo.protein}
                  </span>
                </div>
                <div className="p-2 border border-[#D4AF37]/20 bg-[#1C2541]/40">
                  <span className="text-[10px] text-gray-400 block">Healthy Fats</span>
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {product.nutritionalInfo.healthyFats}
                  </span>
                </div>
                <div className="p-2 border border-[#D4AF37]/20 bg-[#1C2541]/40">
                  <span className="text-[10px] text-gray-400 block">Dietary Fiber</span>
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {product.nutritionalInfo.dietaryFiber}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-20 pt-10 border-t border-[#D4AF37]/30">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SquareBadge variant="gold">Orchard Pairing</SquareBadge>
            <h2 className="font-serif text-2xl font-bold text-[#F8F9FA] mt-1">
              Complementary Mangalore Grades
            </h2>
          </div>
          <button
            onClick={onBack}
            className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
          >
            View Full Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <SquareCard
              key={rel.id}
              glowOnHover
              className="bg-[#0B132B] flex flex-col justify-between cursor-pointer"
              onClick={() => onSelectProduct(rel)}
            >
              <div>
                <OptimizedImage
                  src={rel.images[0]}
                  alt={rel.name}
                  aspectRatio="square"
                  className="mb-3"
                />
                <div className="flex items-center justify-between mb-1">
                  <SquareBadge variant="navy">{rel.grade}</SquareBadge>
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {formatPrice(rel.price)}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-[#F8F9FA] hover:text-[#D4AF37] transition-colors">
                  {rel.name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#D4AF37]">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </SquareCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
