import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderPricing } from '../types';
import { validateCoupon } from '../utils/couponCodes';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  pricing: OrderPricing;
  appliedCoupon: string | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totalItemCount: number;
  freeShippingThreshold: number;
}

const CART_STORAGE_KEY = 'aurevya_cart_v1';
const COUPON_STORAGE_KEY = 'aurevya_coupon_v1';
const FREE_SHIPPING_THRESHOLD = 4000;
const STANDARD_SHIPPING_FEE = 250;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity: number = 1, selectedVariant?: string) => {
    if (quantity < 1) return;
    const cartItemId = `${product.id}-${selectedVariant || 'default'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedVariant,
            quantity,
            unitPrice: product.price,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to your shopping bag.`);
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: Math.min(newQty, 10) } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        showToast(`Removed "${item.product.name}" from shopping bag.`, 'info');
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    const res = validateCoupon(appliedCoupon, subtotal);
    if (res.isValid) {
      discount = res.discountAmount;
    }
  }

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);

  const pricing: OrderPricing = {
    subtotal,
    discount,
    couponCode: appliedCoupon || undefined,
    shipping,
    total,
  };

  const applyCouponCode = (code: string) => {
    if (subtotal === 0) {
      return { success: false, message: 'Your shopping bag is empty.' };
    }
    const res = validateCoupon(code, subtotal);
    if (res.isValid) {
      setAppliedCoupon(res.code);
      showToast(res.message, 'success');
      return { success: true, message: res.message };
    } else {
      showToast(res.message, 'error');
      return { success: false, message: res.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed.', 'info');
  };

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        pricing,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        totalItemCount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
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
