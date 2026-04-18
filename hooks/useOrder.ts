import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  const createOrder = useCallback(async (orderData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.createOrder({ ...orderData, userId: user?.id });
      addToast(`تم إنشاء الطلب بنجاح! رقم الطلب: ${result.orderId.slice(-8)}`, 'success');
      return result;
    } catch (err: any) {
      const msg = err.message || 'فشل في إنشاء الطلب';
      setError(msg);
      addToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, addToast]);

  return { createOrder, loading, error };
};
