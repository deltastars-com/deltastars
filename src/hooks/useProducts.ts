import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Product } from '../types';
import { useToast } from '../contexts/ToastContext';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
      setFiltered(data);
    } catch (error) {
      addToast('فشل في تحميل المنتجات', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name_ar.includes(q) || p.name_en.toLowerCase().includes(q));
    }
    if (category !== 'all') {
      result = result.filter(p => p.category_ar === category || p.category_en === category);
    }
    if (sortBy === 'price_asc') result.sort((a,b) => (a.price_1kg||0) - (b.price_1kg||0));
    else if (sortBy === 'price_desc') result.sort((a,b) => (b.price_1kg||0) - (a.price_1kg||0));
    setFiltered(result);
  }, [products, search, category, sortBy]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products: filtered, loading, search, setSearch, category, setCategory, sortBy, setSortBy, refresh: fetchProducts };
};
