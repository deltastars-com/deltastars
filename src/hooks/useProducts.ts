import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import { useToast } from '../contexts/ToastContext';

const PAGE_SIZE = 20;

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const { addToast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await api.getUniqueCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await api.getProductsPaginated(
        currentPage,
        PAGE_SIZE,
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setProducts(data);
      setTotalProducts(count);
      setTotalPages(Math.ceil(count / PAGE_SIZE));
    } catch (error) {
      addToast('فشل في تحميل المنتجات', 'error');
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, addToast]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    currentPage,
    totalPages,
    totalProducts,
    selectedCategory,
    categories: ['all', ...categories],
    changeCategory,
    goToPage,
    refresh: fetchProducts,
  };
};
