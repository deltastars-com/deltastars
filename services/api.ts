import { supabase } from '../supabaseClient';
import { Product, User, Order, Coupon, Promotion } from '../types';

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL ||
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const api = {
  // ==================== Products ====================
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

  async getProductsPaginated(page: number, pageSize: number, category?: string): Promise<{ data: Product[]; count: number }> {
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

  async createProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ==================== OTP (Client) ====================
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

  // ==================== Orders ====================
  async createOrder(orderData: any): Promise<{ orderId: string; total: number; trackingNumber?: string }> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Order creation failed');
    return res.json();
  },

  async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (error) return null;
    return data;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    if (error) throw error;
  },

  // ==================== Admin Dashboard Auth ====================
  async loginToAdminDashboard(username: string, password: string): Promise<{ user: User }> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/auth-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  async changeAdminPassword(userId: string, newPassword: string): Promise<void> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword }),
    });
    if (!res.ok) throw new Error('Failed to change password');
  },

  async requestAdminPasswordReset(email: string): Promise<void> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/reset-admin-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Failed to send reset link');
  },

  // ==================== Admin Stats & Management ====================
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/admin-stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('id, email, phone, role, created_at');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async updateUserRole(userId: string, role: string): Promise<void> {
    const { error } = await supabase.from('users').update({ role }).eq('id', userId);
    if (error) throw new Error(error.message);
  },

  async getDrivers(): Promise<any[]> {
    const { data, error } = await supabase.from('drivers').select('*, users(full_name, phone)');
    if (error) throw new Error(error.message);
    return data || [];
  },

  // ==================== Promotions & Coupons ====================
  async getPromotions(): Promise<Promotion[]> {
    const { data, error } = await supabase.from('promotions').select('*').eq('is_active', true);
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createPromotion(promo: Partial<Promotion>): Promise<Promotion> {
    const { data, error } = await supabase.from('promotions').insert(promo).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deletePromotion(id: number): Promise<void> {
    const { error } = await supabase.from('promotions').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async getCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase.from('coupons').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const { data, error } = await supabase.from('coupons').insert(coupon).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteCoupon(id: string): Promise<void> {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ==================== AI Assistant ====================
  async askAssistant(prompt: string, language: string = 'ar'): Promise<string> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language }),
    });
    const data = await res.json();
    return data.reply;
  },

  // ==================== WebAuthn (Biometrics & Device) ====================
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

  async initiateDeviceRegistration(userId: string): Promise<any> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/initiate-device-reg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  async saveDevice(userId: string, credential: any): Promise<void> {
    await fetch(`${EDGE_FUNCTION_URL}/save-device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, credential }),
    });
  },

  async getDeviceChallenge(userId: string): Promise<any> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/device-challenge?userId=${userId}`);
    return res.json();
  },

  async verifyDeviceAssertion(userId: string, assertion: any): Promise<boolean> {
    const res = await fetch(`${EDGE_FUNCTION_URL}/verify-device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, assertion }),
    });
    const data = await res.json();
    return data.verified;
  },
};
