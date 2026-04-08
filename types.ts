export interface Product {
  id: number;
  sku: string;
  name_ar: string;
  name_en: string;
  category_ar: string;
  category_en: string;
  description_ar?: string;
  description_en?: string;
  unit_type: string;
  weight_grams: number;
  price_500g: number;
  price_1kg: number;
  price_currency: string;
  image_url: string;
  stock_available: number;
}

export interface User {
  id: string;
  phone?: string;
  email?: string;
  full_name?: string;
  role: string;
  force_password_change?: boolean;
  biometric_enabled?: boolean;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  total_amount: number;
  order_status: string;
  created_at: string;
  delivery_address?: any;
}

export type Page = 'home' | 'products' | 'cart' | 'login' | 'dashboard' | 'trackOrder' | 'driverDashboard' | 'dev_console' | 'sourcing' | 'contact' | 'privacy' | 'terms' | 'returns' | 'shipping' | 'wishlist' | 'showroom' | 'productDetail' | 'units' | 'admin_dashboard';

export interface CartItem extends Product {
  quantity: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
