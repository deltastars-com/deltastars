import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Product, CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const SESSION_KEY = 'delta_cart_session';

const getSessionId = () => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();
  const sessionId = getSessionId();

  const loadCart = useCallback(async () => {
    try {
      const cart = await api.getCart(sessionId, user?.id);
      setItems(cart.items || []);
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, user?.id]);

  const saveCart = useCallback(async (newItems: CartItem[]) => {
    try {
      await api.saveCart(sessionId, newItems, user?.id);
    } catch (error) {
      addToast('حدث خطأ في حفظ السلة', 'error');
    }
  }, [sessionId, user?.id, addToast]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      let newItems;
      if (existing) {
        newItems = prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        newItems = [...prev, { ...product, quantity }];
      }
      saveCart(newItems);
      addToast(`تم إضافة ${product.name_ar} إلى السلة`, 'success');
      return newItems;
    });
  }, [saveCart, addToast]);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.id !== productId);
      saveCart(newItems);
      addToast('تم إزالة المنتج', 'info');
      return newItems;
    });
  }, [saveCart, addToast]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => {
      const newItems = prev.map(i => i.id === productId ? { ...i, quantity } : i);
      saveCart(newItems);
      return newItems;
    });
  }, [saveCart, removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
    addToast('تم تفريغ السلة', 'info');
  }, [saveCart, addToast]);

  const subtotal = items.reduce((sum, i) => {
    const price = i.unit_type === 'kg' ? i.price_1kg : i.price_500g;
    return sum + price * i.quantity;
  }, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    items,
    loading,
    itemCount,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartEmpty: items.length === 0,
  };
};
