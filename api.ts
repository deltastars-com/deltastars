import { supabase } from '../lib/supabaseClient';
import { Product, Order, User } from '../types';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL ||
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export interface CreateOrderInput {
  userId?: string;
  customerName: string;
  customerPhone: string;
  items: Array<{ productId: number; quantity: number; unit: 'kg' | '500g' }>;
  deliveryAddress: any;
  paymentMethod: 'cod' | 'card' | 'bank' | 'paypal';
  couponCode?: string;
}

export const api = {
  // ==================== المنتجات ====================
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) throw new Error(`Failed to fetch products: ${error.message}`);
    return data || [];
  },

  async getProduct(id: number): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  },

  // ==================== OTP (لأول مرة فقط) ====================
  async sendOtp(phone: string, purpose: 'login' | 'order_confirm' | 'reset_password' = 'login'): Promise<void> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, purpose }),
    });
    if (!response.ok) throw new Error('Failed to send OTP');
  },

  async verifyOtp(phone: string, code: string, purpose: string = 'login'): Promise<{ user: User; verified: boolean }> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, purpose }),
    });
    if (!response.ok) throw new Error('Invalid OTP');
    return response.json();
  },

  // ==================== الطلبات ====================
  async createOrder(orderData: CreateOrderInput): Promise<{ orderId: string; total: number; trackingNumber: string }> {
    let subtotal = 0;
    for (const item of orderData.items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        const price = item.unit === 'kg' ? product.price_1kg : product.price_500g;
        subtotal += price * item.quantity;
      }
    }
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    const response = await fetch(`${EDGE_FUNCTION_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...orderData, subtotal, tax, total }),
    });
    if (!response.ok) throw new Error('Order creation failed');
    return response.json();
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase.from('orders').update({ order_status: status, updated_at: new Date().toISOString() }).eq('id', orderId);
    if (error) throw error;
  },

  // ==================== السلة ====================
  async getCart(sessionId: string, userId?: string): Promise<any> {
    let query = supabase.from('carts').select('*');
    if (userId) query = query.eq('user_id', userId);
    else query = query.eq('session_id', sessionId);
    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || { items: [] };
  },

  async saveCart(sessionId: string, items: any[], userId?: string): Promise<void> {
    const { error } = await supabase.from('carts').upsert({
      session_id: sessionId,
      user_id: userId || null,
      items,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'session_id' });
    if (error) throw error;
  },

  // ==================== WebAuthn للعملاء (حفظ الجهاز بعد الشراء) ====================
  async initiateDeviceRegistration(userId: string): Promise<any> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/initiate-device-reg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error('Failed to initiate device registration');
    const options = await response.json();
    return options;
  },

  async saveDevice(userId: string, credential: any): Promise<void> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/save-device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, credential }),
    });
    if (!response.ok) throw new Error('Failed to save device');
  },

  async getDeviceChallenge(userId: string): Promise<any> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/device-challenge?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to get challenge');
    return response.json();
  },

  async verifyDeviceAssertion(userId: string, assertion: any): Promise<boolean> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/verify-device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, assertion }),
    });
    const data = await response.json();
    return data.verified;
  },

  // ==================== WebAuthn للإدارة (بصمة/وجه) ====================
  async initiateBiometricRegistration(userId: string): Promise<any> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/initiate-biometric-reg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error('Failed to initiate biometric registration');
    return response.json();
  },

  async registerBiometric(userId: string, credential: any): Promise<void> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/register-biometric`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, credential }),
    });
    if (!response.ok) throw new Error('Failed to register biometric');
  },

  async initiateBiometricLogin(userId: string): Promise<any> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/initiate-biometric-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error('Failed to initiate biometric login');
    return response.json();
  },

  async verifyBiometricLogin(userId: string, assertion: any): Promise<boolean> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/verify-biometric`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, assertion }),
    });
    const data = await response.json();
    return data.verified;
  },

  // ==================== الإدارة (البريد + كلمة مرور) ====================
  async loginWithPassword(email: string, password: string): Promise<{ user: User }> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  },

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword }),
    });
    if (!response.ok) throw new Error('Failed to change password');
  },

  // ==================== متفرقات ====================
  async getAdminStats(): Promise<any> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/admin-stats`);
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return response.json();
  },

  async askAssistant(prompt: string, language: string = 'ar'): Promise<string> {
    const response = await fetch(`${EDGE_FUNCTION_URL}/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language }),
    });
    const data = await response.json();
    return data.reply;
  },
};

export default api;
// أضف داخل api كائن:
async updateDriverLocation(driverId: string, lat: number, lng: number, orderId?: string): Promise<void> {
  await fetch(`${EDGE_FUNCTION_URL}/update-driver-location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driverId, lat, lng, orderId }),
  });
},

subscribeToDriverLocation(orderId: string, callback: (location: any) => void) {
  const channel = supabase.channel(`order:${orderId}`);
  channel.on('broadcast', { event: 'driver_location' }, (payload) => callback(payload.payload)).subscribe();
  return () => channel.unsubscribe();
},
