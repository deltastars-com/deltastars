import { supabase } from '../lib/supabaseClient';
import { Product, User } from '../types';

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL ||
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const api = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getProduct(id: number): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  },

  async getProductsPaginated(
    page: number,
    pageSize: number,
    category?: string
  ): Promise<{ data: Product[]; count: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase.from('products').select('*', { count: 'exact' });
    if (category && category !== 'all') {
      query = query.or(`category_ar.eq.${category},category_en.eq.${category}`);
    }
    const { data, error, count } = await query.range(from, to).order('id');
    if (error) throw new Error(error.message);
    return { data: data || [], count: count || 0 };
  },

  async getUniqueCategories(): Promise<string[]> {
    const { data, error } = await supabase.from('products').select('category_ar, category_en');
    if (error) throw new Error(error.message);
    const set = new Set<string>();
    data?.forEach(p => {
      if (p.category_ar) set.add(p.category_ar);
      if (p.category_en) set.add(p.category_en);
    });
    return Array.from(set).sort();
  },

  async sendOtp(phone: string, purpose: string): Promise<void> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, purpose }),
    });
    if (!res.ok) throw new Error('Failed to send OTP');
  },

  async verifyOtp(phone: string, code: string, purpose: string): Promise<{ user: User; verified: boolean }> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, purpose }),
    });
    if (!res.ok) throw new Error('Invalid OTP');
    return res.json();
  },

  async createOrder(orderData: any): Promise<{ orderId: string; total: number }> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Order creation failed');
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    if (error) throw error;
  },

  async loginWithPassword(email: string, password: string): Promise<{ user: User }> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword }),
    });
    if (!res.ok) throw new Error('Failed to change password');
  },

  async getAdminStats(): Promise<any> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/admin-stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async askAssistant(prompt: string, language: string = 'ar'): Promise<string> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language }),
    });
    const data = await res.json();
    return data.reply;
  },

  async initiateBiometricRegistration(userId: string): Promise<any> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/initiate-biometric-reg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  async registerBiometric(userId: string, credential: any): Promise<void> {
    await fetch(`${EDGE_FUNCTION_URL}/register-biometric`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, credential }),
    });
  },

  async initiateBiometricLogin(userId: string): Promise<any> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/initiate-biometric-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  async verifyBiometricLogin(userId: string, assertion: any): Promise<boolean> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/verify-biometric`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, assertion }),
    });
    const data = await res.json();
    return data.verified;
  },
};
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
