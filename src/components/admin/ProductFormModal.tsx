import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Upload,
  Trash2,
  Sparkles,
  RefreshCw,
  Search,
  Check,
  Shield,
  Layers,
  Image as ImageIcon,
  DollarSign,
  Globe,
  Info,
} from 'lucide-react';
import { Product, CashewGrade, CashewWeight, ProductVariant, ProductSEO } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { slugify } from '@/lib/slug';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  categories: string[];
  onSaveProduct: (product: Product) => void;
}

const ALL_GRADES: CashewGrade[] = [
  'W-180',
  'W-240',
  'W-320',
  'Splits',
  'Gourmet Flavored',
  'Royal Gift Box',
];

const ALL_WEIGHTS: CashewWeight[] = ['250g', '500g', '1kg', '2kg Pack', '5kg Master Box'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  categories,
  onSaveProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'variants' | 'seo' | 'nutrition'>('basic');

  // Form States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState<CashewGrade>('W-180');
  const [category, setCategory] = useState<string>(categories[0] || 'King Grades');
  const [origin, setOrigin] = useState('Baikampady Orchards, Mangalore, Karnataka');
  const [price, setPrice] = useState<number>(890);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(1050);
  const [stockQuantity, setStockQuantity] = useState<number>(100);
  const [inStock, setInStock] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(4.9);
  const [reviewCount, setReviewCount] = useState<number>(120);

  // Images
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Variants
  const [selectedWeights, setSelectedWeights] = useState<CashewWeight[]>(['250g', '500g', '1kg']);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // SEO
  const [seo, setSeo] = useState<ProductSEO>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
  });

  // Nutrition
  const [nutrition, setNutrition] = useState({
    protein: '18.0g',
    healthyFats: '44.0g',
    calories: '550 kcal',
    dietaryFiber: '3.2g',
  });

  // Populate data when editing
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSlug(productToEdit.slug);
      setSku(productToEdit.sku);
      setDescription(productToEdit.description);
      setGrade(productToEdit.grade);
      setCategory(productToEdit.category);
      setOrigin(productToEdit.origin);
      setPrice(productToEdit.price);
      setCompareAtPrice(productToEdit.compareAtPrice);
      setStockQuantity(productToEdit.stockQuantity);
      setInStock(productToEdit.inStock);
      setIsFeatured(!!productToEdit.isFeatured);
      setIsBestSeller(!!productToEdit.isBestSeller);
      setRating(productToEdit.rating || 4.9);
      setReviewCount(productToEdit.reviewCount || 100);
      setImages(productToEdit.images || []);
      setSelectedWeights(productToEdit.weights || ['500g']);
      setVariants(
        productToEdit.variants ||
          (productToEdit.weights || []).map((w) => ({
            id: `var-${w}`,
            weight: w,
            price: Math.round(
              productToEdit.price *
                (w === '250g' ? 0.55 : w === '1kg' ? 1.9 : w === '2kg Pack' ? 3.7 : 1.0)
            ),
            stockQuantity: productToEdit.stockQuantity,
            inStock: productToEdit.inStock,
          }))
      );
      setSeo(
        productToEdit.seo || {
          metaTitle: `${productToEdit.name} | V S N CASHEWS`,
          metaDescription: productToEdit.description,
          metaKeywords: `cashew, mangalore, ${productToEdit.grade}, ${productToEdit.category}`,
          canonicalUrl: `https://vsncashews.com/products/${productToEdit.slug}`,
        }
      );
      if (productToEdit.nutritionalInfo) {
        setNutrition(productToEdit.nutritionalInfo);
      }
    } else {
      // Defaults for new product
      setName('');
      setSlug('');
      setSku(`VSN-${Date.now().toString().slice(-6)}`);
      setDescription('');
      setGrade('W-180');
      setCategory(categories[0] || 'King Grades');
      setOrigin('Baikampady Orchards, Mangalore, Karnataka');
      setPrice(890);
      setCompareAtPrice(1050);
      setStockQuantity(100);
      setInStock(true);
      setIsFeatured(false);
      setIsBestSeller(false);
      setRating(4.9);
      setReviewCount(12);
      setImages(['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800']);
      setSelectedWeights(['250g', '500g', '1kg']);
      setVariants([
        { id: 'v-250g', weight: '250g', price: 490, stockQuantity: 100, inStock: true },
        { id: 'v-500g', weight: '500g', price: 890, stockQuantity: 100, inStock: true },
        { id: 'v-1kg', weight: '1kg', price: 1690, stockQuantity: 100, inStock: true },
      ]);
      setSeo({
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        canonicalUrl: '',
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Slug Generation
  const handleAutoSlug = () => {
    if (name) {
      setSlug(slugify(name));
      if (!seo.metaTitle) {
        setSeo((prev) => ({ ...prev, metaTitle: `${name} | V S N CASHEWS` }));
      }
    }
  };

  // Image Upload Handlers
  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle Weight & Sync Variants
  const handleToggleWeight = (w: CashewWeight) => {
    let updatedWeights: CashewWeight[];
    if (selectedWeights.includes(w)) {
      updatedWeights = selectedWeights.filter((item) => item !== w);
    } else {
      updatedWeights = [...selectedWeights, w];
    }
    setSelectedWeights(updatedWeights);

    // Update variants list
    const updatedVariants = updatedWeights.map((weight) => {
      const existing = variants.find((v) => v.weight === weight);
      if (existing) return existing;
      const calcPrice = Math.round(
        price * (weight === '250g' ? 0.55 : weight === '1kg' ? 1.9 : weight === '2kg Pack' ? 3.7 : 8.8)
      );
      return {
        id: `var-${weight}-${Date.now()}`,
        weight,
        price: calcPrice,
        stockQuantity: stockQuantity,
        inStock: stockQuantity > 0,
      };
    });
    setVariants(updatedVariants);
  };

  const handleVariantPriceChange = (weight: CashewWeight, newPrice: number) => {
    setVariants((prev) =>
      prev.map((v) => (v.weight === weight ? { ...v, price: newPrice } : v))
    );
  };

  const handleVariantStockChange = (weight: CashewWeight, newQty: number) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.weight === weight
          ? { ...v, stockQuantity: newQty, inStock: newQty > 0 }
          : v
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || slugify(name);
    const finalImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800'];

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: name.trim(),
      slug: finalSlug,
      sku: sku.trim() || `VSN-${Date.now().toString().slice(-6)}`,
      description: description.trim(),
      grade,
      category,
      origin: origin.trim(),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      images: finalImages,
      inStock: Boolean(inStock && stockQuantity > 0),
      stockQuantity: Number(stockQuantity),
      weights: selectedWeights,
      variants,
      isFeatured,
      isBestSeller,
      rating,
      reviewCount,
      nutritionalInfo: nutrition,
      seo: {
        metaTitle: seo.metaTitle || `${name} | V S N CASHEWS`,
        metaDescription: seo.metaDescription || description.slice(0, 160),
        metaKeywords: seo.metaKeywords || `cashew, mangalore, ${grade}, ${category}`,
        canonicalUrl: seo.canonicalUrl || `https://vsncashews.com/products/${finalSlug}`,
      },
    };

    onSaveProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0B132B] border-2 border-[#D4AF37] p-6 text-[#F8F9FA] shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
              Mangalore Product Management
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#F3E5AB]">
              {productToEdit ? `Edit Product: ${productToEdit.name}` : 'Add New Product to Catalog'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-[#D4AF37] cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Navigation Tabs */}
        <div className="flex border-b border-[#D4AF37]/30 my-4 gap-2 overflow-x-auto">
          {[
            { id: 'basic', label: '1. Basic Details & Price', icon: DollarSign },
            { id: 'images', label: '2. Images & Gallery', icon: ImageIcon },
            { id: 'variants', label: '3. Variants & Stock', icon: Layers },
            { id: 'seo', label: '4. SEO Meta Fields', icon: Globe },
            { id: 'nutrition', label: '5. Nutritional Info', icon: Info },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 border-b-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#1C2541]/80'
                    : 'border-transparent text-gray-400 hover:text-[#F3E5AB]'
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#D4AF37] block mb-1">
                    Product Title / Name *
                  </label>
                  <SquareInput
                    required
                    placeholder="e.g. W-180 Emperor King Jumbo Cashews"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase text-[#D4AF37]">
                      SEO Product Slug *
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[10px] text-[#F3E5AB] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-[#D4AF37]" /> Auto-Generate
                    </button>
                  </div>
                  <SquareInput
                    required
                    placeholder="e.g. w180-emperor-king-jumbo-cashews"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#D4AF37] block mb-1">
                    SKU Code *
                  </label>
                  <SquareInput
                    required
                    placeholder="VSN-W180-500"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-[#D4AF37] block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-2.5 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-[#D4AF37] block mb-1">
                    Cashew Grade *
                  </label>
                  <select
                    value={grade}
                    onChange={(e: any) => setGrade(e.target.value)}
                    className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-2.5 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
                  >
                    {ALL_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#D4AF37] block mb-1">
                    Base Unit Price (₹) *
                  </label>
                  <SquareInput
                    required
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-400 block mb-1">
                    Compare At Price (MRP ₹)
                  </label>
                  <SquareInput
                    type="number"
                    placeholder="e.g. 1050"
                    value={compareAtPrice || ''}
                    onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-[#D4AF37] block mb-1">
                    Stock Inventory Quantity *
                  </label>
                  <SquareInput
                    required
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setStockQuantity(qty);
                      if (qty === 0) setInStock(false);
                      else setInStock(true);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#D4AF37] block mb-1">
                  Harvest Origin Location *
                </label>
                <SquareInput
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Baikampady Orchards, Mangalore, Karnataka"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#D4AF37] block mb-1">
                  Full Product Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description highlighting kernel size, taste profile, and vacuum packaging..."
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-3 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2 border-t border-[#D4AF37]/20">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F3E5AB]">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Product Currently In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F3E5AB]">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Feature on Homepage Banner</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F3E5AB]">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Mark as Best Seller Badge</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 border border-[#D4AF37]/30 bg-[#1C2541]/40 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                  <Upload className="w-4 h-4" /> Upload Local Files or Add Web Image URLs
                </h3>

                {/* File Drag and Drop */}
                <div className="border-2 border-dashed border-[#D4AF37]/40 p-6 text-center bg-[#0B132B]/60 hover:border-[#D4AF37] transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="product-file-upload"
                  />
                  <label
                    htmlFor="product-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2 text-xs text-gray-300"
                  >
                    <Upload className="w-8 h-8 text-[#D4AF37]" />
                    <span className="font-bold text-[#F3E5AB]">
                      Click to upload local images or drag files here
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Supports PNG, JPG, WEBP (Auto-converts to Base64)
                    </span>
                  </label>
                </div>

                {/* URL Input */}
                <div className="flex gap-2 pt-2">
                  <SquareInput
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                  />
                  <SquareButton
                    variant="gold"
                    size="sm"
                    type="button"
                    onClick={handleAddImageUrl}
                  >
                    Add Image URL
                  </SquareButton>
                </div>
              </div>

              {/* Gallery List */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-2">
                  Active Image Gallery ({images.length} images)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative border border-[#D4AF37]/50 bg-[#0B132B] p-1 group"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx}`}
                        className="w-full h-28 object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-[#D4AF37] text-[#0B132B] text-[9px] font-bold uppercase px-1.5 py-0.5">
                          Cover Image
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VARIANTS & STOCK */}
          {activeTab === 'variants' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 border border-[#D4AF37]/30 bg-[#1C2541]/40 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  Select Available Packaging Weights
                </h3>
                <div className="flex flex-wrap gap-3">
                  {ALL_WEIGHTS.map((w) => {
                    const isSelected = selectedWeights.includes(w);
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => handleToggleWeight(w)}
                        className={`py-2 px-4 border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37]'
                            : 'bg-[#0B132B] text-gray-300 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {w}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Variant Pricing & Stock Table */}
              <div className="border border-[#D4AF37]/30 bg-[#0B132B] p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F3E5AB]">
                  Variant Pricing & Individual Stock Controls
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#1C2541] uppercase text-[10px] text-[#D4AF37] font-bold">
                      <tr>
                        <th className="p-2 border border-[#D4AF37]/20">Variant Weight</th>
                        <th className="p-2 border border-[#D4AF37]/20">Calculated Price (₹)</th>
                        <th className="p-2 border border-[#D4AF37]/20">Stock Quantity</th>
                        <th className="p-2 border border-[#D4AF37]/20">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedWeights.map((w) => {
                        const variant = variants.find((v) => v.weight === w);
                        const vPrice = variant ? variant.price : price;
                        const vStock = variant ? variant.stockQuantity : stockQuantity;

                        return (
                          <tr key={w} className="border-b border-[#D4AF37]/10">
                            <td className="p-2 font-bold text-[#F8F9FA]">{w}</td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={vPrice}
                                onChange={(e) =>
                                  handleVariantPriceChange(w, Number(e.target.value))
                                }
                                className="w-28 bg-[#1C2541] border border-[#D4AF37]/40 px-2 py-1 text-xs text-white"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={vStock}
                                onChange={(e) =>
                                  handleVariantStockChange(w, Number(e.target.value))
                                }
                                className="w-28 bg-[#1C2541] border border-[#D4AF37]/40 px-2 py-1 text-xs text-white"
                              />
                            </td>
                            <td className="p-2">
                              {vStock > 0 ? (
                                <span className="text-emerald-400 font-bold">In Stock</span>
                              ) : (
                                <span className="text-red-400 font-bold">Out of Stock</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO META FIELDS */}
          {activeTab === 'seo' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 border border-[#D4AF37]/30 bg-[#1C2541]/40 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Search Engine Optimization (SEO Metadata)
                </h3>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                    Meta Title Tag
                  </label>
                  <SquareInput
                    placeholder="e.g. W-180 Emperor King Jumbo Cashews | V S N CASHEWS"
                    value={seo.metaTitle || ''}
                    onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Recommended length: 50-60 characters
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Summarize product features for Google Search snippet..."
                    value={seo.metaDescription || ''}
                    onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                    className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-3 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Recommended length: 150-160 characters
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                    Meta Keywords
                  </label>
                  <SquareInput
                    placeholder="cashew, mangalore, w180, dry fruits, buy cashew online"
                    value={seo.metaKeywords || ''}
                    onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                    Canonical URL
                  </label>
                  <SquareInput
                    placeholder="https://vsncashews.com/products/w180-king-cashew"
                    value={seo.canonicalUrl || ''}
                    onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NUTRITIONAL INFO */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 border border-[#D4AF37]/30 bg-[#1C2541]/40 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  Nutritional Composition (per 100g serving)
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                      Protein (g)
                    </label>
                    <SquareInput
                      value={nutrition.protein}
                      onChange={(e) => setNutrition({ ...nutrition, protein: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                      Healthy Fats (g)
                    </label>
                    <SquareInput
                      value={nutrition.healthyFats}
                      onChange={(e) => setNutrition({ ...nutrition, healthyFats: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                      Energy / Calories (kcal)
                    </label>
                    <SquareInput
                      value={nutrition.calories}
                      onChange={(e) => setNutrition({ ...nutrition, calories: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                      Dietary Fiber (g)
                    </label>
                    <SquareInput
                      value={nutrition.dietaryFiber}
                      onChange={(e) => setNutrition({ ...nutrition, dietaryFiber: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between">
            <SquareButton variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </SquareButton>

            <SquareButton variant="gold" size="lg" type="submit">
              {productToEdit ? 'Save Product Changes' : 'Publish Product to Store'}
            </SquareButton>
          </div>
        </form>
      </div>
    </div>
  );
};
