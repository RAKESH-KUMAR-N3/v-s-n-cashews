'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, SavedItem, ShippingMethod, CartUserMode, CartUserProfile, Product, CashewWeight } from '@/types';
import { PRODUCTS_CATALOG } from '@/data/products';

interface CartContextType {
  // State
  cartItems: CartItem[];
  savedItems: SavedItem[];
  userMode: CartUserMode;
  userProfile: CartUserProfile | null;
  shippingMethod: ShippingMethod;
  couponCode: string;
  discountPercent: number;
  
  // Computed Financials
  subtotal: number;
  gstRate: number; // 5% (2.5% CGST + 2.5% SGST)
  gstAmount: number;
  shippingFee: number;
  discountAmount: number;
  grandTotal: number;
  totalCartCount: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;

  // Actions
  setUserMode: (mode: CartUserMode) => void;
  loginUser: (profile?: Partial<CartUserProfile>) => void;
  logoutUser: () => void;
  signupUser: (profile: { name: string; email: string; phone?: string; companyName?: string; gstin?: string }) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  addToCart: (product: Product, weight: CashewWeight, quantity?: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, newQty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSavedItem: (id: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const DEFAULT_LOGGED_IN_USER: CartUserProfile = {
  id: 'usr-vsn-royal-01',
  name: 'Rakesh Kumar',
  email: 'nrakeshkumar36@gmail.com',
  isRoyalMember: true,
  memberDiscountPercent: 5, // Extra 5% Royal Club discount for logged in users
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local Storage Keys
const GUEST_CART_KEY = 'vsn_cashews_guest_cart_v2';
const GUEST_SAVED_KEY = 'vsn_cashews_guest_saved_v2';
const USER_CART_KEY = 'vsn_cashews_user_cart_v2';
const USER_SAVED_KEY = 'vsn_cashews_user_saved_v2';
const USER_MODE_KEY = 'vsn_cashews_user_mode_v2';

// Seed initial items if completely empty
const INITIAL_SEED_ITEMS: CartItem[] = [
  {
    id: 'cart-init-king-180',
    productId: PRODUCTS_CATALOG[0]?.id || 'prod-w180-king',
    product: PRODUCTS_CATALOG[0],
    weight: '500g',
    quantity: 1,
    price: PRODUCTS_CATALOG[0]?.price || 890,
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<CartUserMode>('GUEST');

  const [userProfile, setUserProfile] = useState<CartUserProfile | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_SEED_ITEMS);

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('STANDARD');
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);

  // Load state safely on client mount for SSR compatibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedMode = (localStorage.getItem(USER_MODE_KEY) as CartUserMode) || 'GUEST';
      setUserModeState(savedMode);
      if (savedMode === 'LOGGED_IN') {
        setUserProfile(DEFAULT_LOGGED_IN_USER);
      }

      const cartKey = savedMode === 'LOGGED_IN' ? USER_CART_KEY : GUEST_CART_KEY;
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }

      const savedKey = savedMode === 'LOGGED_IN' ? USER_SAVED_KEY : GUEST_SAVED_KEY;
      const storedSaved = localStorage.getItem(savedKey);
      if (storedSaved) {
        setSavedItems(JSON.parse(storedSaved));
      }
    } catch (e) {
      console.error('Failed to load initial cart state from storage:', e);
    }
  }, []);

  // Sync to LocalStorage whenever cart items change
  useEffect(() => {
    try {
      const key = userMode === 'LOGGED_IN' ? USER_CART_KEY : GUEST_CART_KEY;
      localStorage.setItem(key, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart items to storage:', e);
    }
  }, [cartItems, userMode]);

  // Sync to LocalStorage whenever saved items change
  useEffect(() => {
    try {
      const key = userMode === 'LOGGED_IN' ? USER_SAVED_KEY : GUEST_SAVED_KEY;
      localStorage.setItem(key, JSON.stringify(savedItems));
    } catch (e) {
      console.error('Failed to save saved items to storage:', e);
    }
  }, [savedItems, userMode]);

  // Sync User Mode
  useEffect(() => {
    try {
      localStorage.setItem(USER_MODE_KEY, userMode);
    } catch (e) {
      console.error('Failed to save user mode:', e);
    }
  }, [userMode]);

  // Switch User Mode handler
  const setUserMode = (newMode: CartUserMode) => {
    if (newMode === userMode) return;

    setUserModeState(newMode);
    if (newMode === 'LOGGED_IN') {
      setUserProfile(DEFAULT_LOGGED_IN_USER);

      // Load Logged in Cart or merge current guest cart
      try {
        const userStoredCart = localStorage.getItem(USER_CART_KEY);
        const userStoredSaved = localStorage.getItem(USER_SAVED_KEY);

        let userCart: CartItem[] = userStoredCart ? JSON.parse(userStoredCart) : [];
        const userSaved: SavedItem[] = userStoredSaved ? JSON.parse(userStoredSaved) : [];

        // If guest cart had items, offer seamless merge
        if (cartItems.length > 0) {
          const merged = [...userCart];
          cartItems.forEach((guestItem) => {
            const idx = merged.findIndex(
              (m) => m.productId === guestItem.productId && m.weight === guestItem.weight
            );
            if (idx > -1) {
              merged[idx].quantity += guestItem.quantity;
            } else {
              merged.push(guestItem);
            }
          });
          userCart = merged;
        }

        setCartItems(userCart);
        setSavedItems(userSaved);
      } catch (e) {
        console.error('Error switching user cart mode:', e);
      }
    } else {
      setUserProfile(null);
      // Load Guest Cart
      try {
        const guestStoredCart = localStorage.getItem(GUEST_CART_KEY);
        const guestStoredSaved = localStorage.getItem(GUEST_SAVED_KEY);
        setCartItems(guestStoredCart ? JSON.parse(guestStoredCart) : []);
        setSavedItems(guestStoredSaved ? JSON.parse(guestStoredSaved) : []);
      } catch (e) {
        console.error('Error loading guest cart:', e);
      }
    }
  };

  const loginUser = (customProfile?: Partial<CartUserProfile>) => {
    const profileToSet: CartUserProfile = {
      ...DEFAULT_LOGGED_IN_USER,
      ...customProfile,
    };
    setUserProfile(profileToSet);
    setUserModeState('LOGGED_IN');
    localStorage.setItem(USER_MODE_KEY, 'LOGGED_IN');
  };

  const logoutUser = () => {
    setUserMode('GUEST');
  };

  const signupUser = (details: { name: string; email: string; phone?: string; companyName?: string; gstin?: string }) => {
    const newProfile: CartUserProfile = {
      id: `usr-${Date.now()}`,
      name: details.name,
      email: details.email,
      isRoyalMember: true,
      memberDiscountPercent: 5,
    };
    setUserProfile(newProfile);
    setUserModeState('LOGGED_IN');
    localStorage.setItem(USER_MODE_KEY, 'LOGGED_IN');
  };

  // Cart Operations
  const addToCart = (product: Product, weight: CashewWeight, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.weight === weight
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      // Find price for selected weight
      let itemPrice = product.price;
      if (product.variants && product.variants.length > 0) {
        const v = product.variants.find((variant) => variant.weight === weight);
        if (v) itemPrice = v.price;
      } else {
        const multiplierMap: Record<CashewWeight, number> = {
          '250g': 0.55,
          '500g': 1.0,
          '1kg': 1.9,
          '2kg Pack': 3.7,
          '5kg Master Box': 8.8,
        };
        itemPrice = Math.round(product.price * (multiplierMap[weight] || 1.0));
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        product,
        weight,
        quantity,
        price: itemPrice,
      };

      return [...prev, newItem];
    });
  };

  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            if (item.quantity <= 1) {
              return null; // Remove if quantity becomes 0
            }
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Save For Later Actions
  const saveForLater = (id: string) => {
    const itemToSave = cartItems.find((item) => item.id === id);
    if (!itemToSave) return;

    // Remove from active cart
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    // Add to saved for later
    setSavedItems((prev) => {
      const existingSaved = prev.find(
        (s) => s.productId === itemToSave.productId && s.weight === itemToSave.weight
      );
      if (existingSaved) return prev;

      const newSavedItem: SavedItem = {
        id: `saved-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: itemToSave.productId,
        product: itemToSave.product,
        weight: itemToSave.weight,
        price: itemToSave.price,
        savedAt: new Date().toISOString(),
      };
      return [newSavedItem, ...prev];
    });
  };

  const moveToCart = (savedId: string) => {
    const saved = savedItems.find((s) => s.id === savedId);
    if (!saved) return;

    // Remove from saved
    setSavedItems((prev) => prev.filter((s) => s.id !== savedId));

    // Add back to active cart
    addToCart(saved.product, saved.weight, 1);
  };

  const removeSavedItem = (savedId: string) => {
    setSavedItems((prev) => prev.filter((s) => s.id !== savedId));
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'ROYAL10') {
      setCouponCode('ROYAL10');
      setCouponDiscountPercent(10);
      return { success: true, message: 'ROYAL10 applied! 10% discount added.' };
    } else if (trimmed === 'VSNKING') {
      setCouponCode('VSNKING');
      setCouponDiscountPercent(15);
      return { success: true, message: 'VSNKING applied! 15% discount added.' };
    } else if (trimmed === 'FREESHIP') {
      setCouponCode('FREESHIP');
      setCouponDiscountPercent(5);
      return { success: true, message: 'FREESHIP applied! Extra 5% discount.' };
    }
    return { success: false, message: 'Invalid coupon. Try ROYAL10, VSNKING, or FREESHIP' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercent(0);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // GST Calculation (5% GST for standard packed nut products in India)
  const gstRate = 0.05; // 5%
  const gstAmount = Math.round(subtotal * gstRate);

  // Member & Coupon Discounts
  const memberDiscountPercent = userProfile?.isRoyalMember ? userProfile.memberDiscountPercent : 0;
  const totalDiscountPercent = couponDiscountPercent + memberDiscountPercent;
  const discountAmount = Math.round((subtotal * totalDiscountPercent) / 100);

  // Shipping Calculation
  const freeShippingThreshold = shippingMethod === 'EXPRESS_AIR' ? 2499 : 1499;
  let shippingFee = 0;
  if (cartItems.length > 0) {
    if (subtotal >= freeShippingThreshold) {
      shippingFee = 0;
    } else {
      shippingFee = shippingMethod === 'EXPRESS_AIR' ? 199 : 99;
    }
  }

  const grandTotal = subtotal + gstAmount + shippingFee - discountAmount;
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedItems,
        userMode,
        userProfile,
        shippingMethod,
        couponCode,
        discountPercent: totalDiscountPercent,

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
        loginUser,
        logoutUser,
        signupUser,
        setShippingMethod,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        removeItem,
        clearCart,
        saveForLater,
        moveToCart,
        removeSavedItem,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
