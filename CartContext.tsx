/**
 * Delta Stars - نظام سلة الطلبات
 * الحد الأدنى للطلب: 50 ريال
 * التوصيل المجاني: فوق 200 ريال
 * منطقة التوصيل: جدة فقط (المرحلة الأولى)
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product } from "@/data/products";

export const DELIVERY_ZONES = ["جدة"] as const;
export const MIN_ORDER = 50;
export const FREE_DELIVERY_THRESHOLD = 200;
export const DELIVERY_FEE = 25; // رسوم التوصيل إذا أقل من 200

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isFreeDelivery: boolean;
  isMinOrderMet: boolean;
  amountToMinOrder: number;
  amountToFreeDelivery: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setItems(prev =>
        prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : DELIVERY_FEE) : 0;
  const total = subtotal + deliveryFee;
  const isMinOrderMet = subtotal >= MIN_ORDER;
  const amountToMinOrder = Math.max(0, MIN_ORDER - subtotal);
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, subtotal, deliveryFee, total,
      isFreeDelivery, isMinOrderMet, amountToMinOrder, amountToFreeDelivery,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
