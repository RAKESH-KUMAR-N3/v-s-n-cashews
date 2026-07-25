'use client';

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  UserCheck,
  UserX,
  Sparkles,
  Clock,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { SquareBadge } from '@/components/ui/SquareBadge';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onProceedToCheckout }) => {
  const {
    cartItems,
    savedItems,
    userMode,
    userProfile,
    shippingMethod,
    couponCode,
    discountPercent,

    subtotal,
    gstRate,
    gstAmount,
    shippingFee,
    discountAmount,
    grandTotal,
    totalCartCount,
    freeShippingThreshold,
    freeShippingProgress,

    setUserMode,
    setShippingMethod,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isGstDetailsOpen, setIsGstDetailsOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [orderSuccessRef, setOrderSuccessRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon) return;
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setInputCoupon('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleCheckout = () => {
    if (onProceedToCheckout) {
      onClose();
      onProceedToCheckout();
      return;
    }
    setIsProcessingCheckout(true);
    setTimeout(() => {
      const ref = `VSN-ORD-${Date.now().toString(36).toUpperCase()}`;
      setOrderSuccessRef(ref);
      setIsProcessingCheckout(false);
      clearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Cart Container */}
      <div className="relative w-full max-w-lg bg-[#0B132B] border-l-2 border-[#D4AF37] h-full flex flex-col p-4 sm:p-6 text-[#F8F9FA] z-10 shadow-[0_0_50px_rgba(212,175,55,0.2)] animate-slide-left overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F3E5AB]">
              Sovereign Shopping Bag
            </h3>
            <SquareBadge variant="gold" className="text-xs">
              {totalCartCount}
            </SquareBadge>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest vs Logged In Mode Toggle */}
        <div className="mt-3 bg-[#1C2541] border border-[#D4AF37]/30 p-2.5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {userMode === 'LOGGED_IN' ? (
              <div className="w-8 h-8 rounded-none border border-[#D4AF37] bg-[#0B132B] flex items-center justify-center text-[#D4AF37]">
                <UserCheck className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-none border border-gray-600 bg-[#0B132B] flex items-center justify-center text-gray-400">
                <UserX className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#F8F9FA] flex items-center gap-1.5 truncate">
                {userMode === 'LOGGED_IN' ? (
                  <>
                    <span>Logged In: {userProfile?.name}</span>
                    <SquareBadge variant="gold" className="text-[9px] px-1 py-0 uppercase">
                      Royal Member (5% Off)
                    </SquareBadge>
                  </>
                ) : (
                  <span>Guest Cart</span>
                )}
              </span>
              <span className="text-[10px] text-gray-400 truncate">
                {userMode === 'LOGGED_IN'
                  ? userProfile?.email
                  : 'Cart saved in current browser session'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setUserMode(userMode === 'GUEST' ? 'LOGGED_IN' : 'GUEST')}
            className="text-[11px] font-mono px-2.5 py-1 bg-[#0B132B] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors shrink-0 uppercase tracking-wider"
          >
            {userMode === 'GUEST' ? 'Log In' : 'Guest Mode'}
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="my-3 p-3 bg-[#1C2541]/80 border border-[#D4AF37]/30 shrink-0">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-200 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              {shippingMethod === 'EXPRESS_AIR' ? 'Express Air Cargo' : 'Standard Delivery'}
            </span>
            <span className="text-[#F3E5AB] font-bold">
              {subtotal >= freeShippingThreshold
                ? '✨ FREE SHIPPING UNLOCKED'
                : `Add ${formatPrice(freeShippingThreshold - subtotal)} for FREE`}
            </span>
          </div>
          <div className="w-full bg-[#0B132B] h-1.5 border border-[#D4AF37]/30 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] h-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        {orderSuccessRef ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 border-2 border-[#D4AF37] bg-[#1C2541] flex items-center justify-center text-[#D4AF37] animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-xl text-[#F3E5AB]">Order Placed Successfully!</h4>
            <p className="text-xs text-gray-300 max-w-xs">
              Thank you for choosing V S N CASHEWS. Your order reference is{' '}
              <span className="font-mono text-[#D4AF37] font-bold">{orderSuccessRef}</span>.
            </p>
            <p className="text-[11px] text-gray-400">
              Our Mangalore estate team is preparing your vacuum-sealed nitrogen freshness pack for dispatch.
            </p>
            <SquareButton
              variant="gold"
              onClick={() => {
                setOrderSuccessRef(null);
                onClose();
              }}
            >
              Continue Shopping
            </SquareButton>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 my-1">
            {/* Active Cart Items */}
            {cartItems.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-[#1C2541]/30 border border-dashed border-[#D4AF37]/20">
                <ShoppingBag className="w-12 h-12 text-[#D4AF37]/40 stroke-1" />
                <p className="text-sm font-serif text-[#F3E5AB]">Your Shopping Bag is empty</p>
                <p className="text-xs text-gray-400 max-w-xs">
                  Discover our King W-180 Jumbo Cashews, Ghee Roasted Flavors, and Velvet Gift Boxes.
                </p>
                <SquareButton variant="gold" size="sm" onClick={onClose}>
                  Browse Catalog
                </SquareButton>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-[#D4AF37]/20 pb-1">
                  <span>Cart Items ({cartItems.length})</span>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px] lowercase"
                  >
                    <RotateCcw className="w-3 h-3" /> clear all
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-[#1C2541]/70 border border-[#D4AF37]/30 relative group transition-colors hover:border-[#D4AF37]/60"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-[#D4AF37]/40 shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-serif font-bold text-[#F8F9FA] truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-400 p-0.5 transition-colors"
                            title="Remove from Cart"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                            {item.weight}
                          </span>
                          <span className="text-[10px] text-gray-400">•</span>
                          <span className="text-[10px] text-gray-300">
                            {formatPrice(item.price)} / unit
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper & Save For Later */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#D4AF37]/20">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#D4AF37]/40 bg-[#0B132B]">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="p-1 text-gray-300 hover:text-[#D4AF37] hover:bg-[#1C2541] transition-colors"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#F8F9FA] min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="p-1 text-gray-300 hover:text-[#D4AF37] hover:bg-[#1C2541] transition-colors"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="text-[11px] text-gray-300 hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                            title="Save for later purchase"
                          >
                            <Bookmark className="w-3 h-3 text-[#D4AF37]" />
                            <span>Save for later</span>
                          </button>

                          <span className="text-xs font-bold font-serif text-[#F3E5AB]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Saved For Later Accordion Section */}
            <div className="pt-2 border-t border-[#D4AF37]/20">
              <button
                onClick={() => setIsSavedOpen(!isSavedOpen)}
                className="w-full flex items-center justify-between p-2.5 bg-[#1C2541]/50 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs text-[#F3E5AB] font-serif transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#D4AF37]" />
                  <span>Saved For Later ({savedItems.length})</span>
                </div>
                <span className="text-xs text-[#D4AF37] font-mono">{isSavedOpen ? '▲' : '▼'}</span>
              </button>

              {isSavedOpen && (
                <div className="p-3 bg-[#0B132B] border border-t-0 border-[#D4AF37]/30 space-y-2 max-h-56 overflow-y-auto">
                  {savedItems.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">
                      No items saved for later. Click "Save for later" on any cart item.
                    </p>
                  ) : (
                    savedItems.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2 bg-[#1C2541] border border-[#D4AF37]/20 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={s.product.images[0]}
                            alt={s.product.name}
                            className="w-10 h-10 object-cover border border-[#D4AF37]/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-[#F8F9FA] truncate text-xs">{s.product.name}</p>
                            <p className="text-[10px] text-[#D4AF37]">
                              {s.weight} • {formatPrice(s.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => moveToCart(s.id)}
                            className="px-2 py-1 bg-[#D4AF37] text-[#0B132B] font-bold text-[10px] uppercase hover:bg-[#F3E5AB] transition-colors"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => removeSavedItem(s.id)}
                            className="p-1 text-gray-400 hover:text-red-400"
                            title="Delete saved item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Summary & Order Execution */}
        {cartItems.length > 0 && !orderSuccessRef && (
          <div className="pt-3 border-t border-[#D4AF37]/30 space-y-3 shrink-0 bg-[#0B132B]">
            {/* Shipping Method Selector */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setShippingMethod('STANDARD')}
                className={`p-2 border text-left transition-all ${
                  shippingMethod === 'STANDARD'
                    ? 'border-[#D4AF37] bg-[#1C2541] text-[#F3E5AB]'
                    : 'border-gray-700 bg-[#0B132B] text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span>Standard Air/Surface</span>
                  {shippingMethod === 'STANDARD' && <Check className="w-3 h-3 text-[#D4AF37]" />}
                </div>
                <div className="text-[10px] text-gray-300 mt-0.5">
                  {subtotal >= 1499 ? 'FREE (3-5 Days)' : '₹99 (3-5 Days)'}
                </div>
              </button>

              <button
                onClick={() => setShippingMethod('EXPRESS_AIR')}
                className={`p-2 border text-left transition-all ${
                  shippingMethod === 'EXPRESS_AIR'
                    ? 'border-[#D4AF37] bg-[#1C2541] text-[#F3E5AB]'
                    : 'border-gray-700 bg-[#0B132B] text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span>Express Priority Air</span>
                  {shippingMethod === 'EXPRESS_AIR' && <Check className="w-3 h-3 text-[#D4AF37]" />}
                </div>
                <div className="text-[10px] text-gray-300 mt-0.5">
                  {subtotal >= 2499 ? 'FREE (24-48 Hrs)' : '₹199 (24-48 Hrs)'}
                </div>
              </button>
            </div>

            {/* Coupon Code Input Form */}
            <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
              <SquareInput
                placeholder="Coupon (e.g. ROYAL10, VSNKING)"
                value={inputCoupon}
                onChange={(e) => {
                  setInputCoupon(e.target.value);
                  setCouponFeedback(null);
                }}
                className="py-1 text-xs"
                icon={<Tag className="w-3.5 h-3.5" />}
              />
              <SquareButton type="submit" variant="navy" size="sm" className="shrink-0">
                Apply
              </SquareButton>
            </form>

            {couponCode && (
              <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1">
                <span>✓ Active Coupon: <strong>{couponCode}</strong> ({discountPercent}% Off)</span>
                <button
                  onClick={removeCoupon}
                  className="text-gray-400 hover:text-white text-[10px] underline ml-2"
                >
                  Remove
                </button>
              </div>
            )}

            {couponFeedback && (
              <p
                className={`text-[11px] ${
                  couponFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {couponFeedback.message}
              </p>
            )}

            {/* Comprehensive Pricing Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-[#D4AF37]/20">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal (Net Price)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {/* GST Breakdown */}
              <div className="flex justify-between items-center text-gray-300">
                <div className="flex items-center gap-1">
                  <span>GST Tax (5% Included)</span>
                  <button
                    onClick={() => setIsGstDetailsOpen(!isGstDetailsOpen)}
                    className="text-[#D4AF37] hover:underline"
                    title="View Tax Breakdown"
                  >
                    <Info className="w-3 h-3 inline" />
                  </button>
                </div>
                <span>+{formatPrice(gstAmount)}</span>
              </div>

              {isGstDetailsOpen && (
                <div className="pl-3 py-1 text-[10px] text-gray-400 bg-[#1C2541]/40 border-l-2 border-[#D4AF37] space-y-0.5">
                  <div className="flex justify-between">
                    <span>• CGST (2.5% Central)</span>
                    <span>{formatPrice(Math.round(gstAmount / 2))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• SGST (2.5% State)</span>
                    <span>{formatPrice(Math.round(gstAmount / 2))}</span>
                  </div>
                  <div className="text-[9px] text-[#D4AF37] pt-0.5">
                    HSN Code: 08013100 (Sovereign Mangalore Processed Cashew Nuts)
                  </div>
                </div>
              )}

              {/* Discount */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>
                    Total Discount ({discountPercent}%)
                    {userMode === 'LOGGED_IN' && ' (incl. Royal Member 5%)'}
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {/* Shipping */}
              <div className="flex justify-between">
                <span>
                  Shipping ({shippingMethod === 'EXPRESS_AIR' ? 'Express Air' : 'Standard'})
                </span>
                <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : ''}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-baseline pt-2 border-t border-[#D4AF37]/30 text-[#F3E5AB]">
                <span className="font-serif font-bold text-sm">Grand Total</span>
                <div className="text-right">
                  <span className="font-serif font-black gold-gradient-text text-xl">
                    {formatPrice(grandTotal)}
                  </span>
                  <span className="block text-[9px] text-gray-400">All Taxes & Packaging Included</span>
                </div>
              </div>
            </div>

            {/* Checkout Action */}
            <SquareButton
              variant="gold"
              size="lg"
              fullWidth
              isLoading={isProcessingCheckout}
              onClick={handleCheckout}
            >
              Place Sovereign Order <ArrowRight className="w-4 h-4 ml-1" />
            </SquareButton>

            <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 pb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Mangalore Estate Dispatch • Direct Factory Fresh Guarantee
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
