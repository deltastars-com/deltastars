
export type Page = 'home' | 'products' | 'cart' | 'login' | 'dashboard' | 'vipLogin' | 'vipDashboard' | 'wishlist' | 'showroom' | 'productDetail' | 'operations' | 'warehouse' | 'privacy' | 'security_setup' | 'trackOrder' | 'dev_console' | 'trust_center' | 'sourcing' | 'terms' | 'returns' | 'driverDashboard';

export interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  category: CategoryKey;
  price: number;
  image: string;
  unit_ar: string;
  unit_en: string;
  description_ar?: string;
  description_en?: string;
  features_ar?: string; 
  features_en?: string;
  origin_ar?: string;
  origin_en?: string;
  stock_quantity: number;
  min_threshold: number;
  gallery?: string[];
}

export interface User {
  type: UserRole;
  email?: string;
  phone?: string;
  name?: string;
  creditLimit?: number;
  currentBalance?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type UserRole = 'admin' | 'ops' | 'developer' | 'gm' | 'vip';
// تحديث قائمة الأقسام لتشمل كافة تصنيفات العميل
export type CategoryKey = 'fruits' | 'vegetables' | 'herbs' | 'qassim' | 'dates' | 'packages' | 'seasonal' | 'nuts' | 'flowers' | 'custom';

export interface CategoryConfig {
  key: CategoryKey;
  label_ar: string;
  label_en: string;
  icon: string;
  order: number;
  isVisible: boolean;
}

export interface InvoiceItem {
  productId: number;
  name_ar: string;
  name_en: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  orderId?: string;
  clientId?: string;
  customerName: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  shipping?: number;
  tax?: number;
  total: number;
  status: string;
  status_ar: string;
  type: 'Sales' | 'Purchase';
}

export interface VipClient {
  id: string;
  phone: string;
  companyName: string;
  contactPerson: string;
  shippingAddress: string;
  creditLimit: number;
  currentBalance: number;
}

export interface VipTransaction {
  id: string;
  clientId: string;
  date: string;
  description_ar: string;
  description_en: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  clientId: string;
  date: string;
  amount: number;
  method: string;
  method_ar: string;
  status: string;
}

export interface ShowroomAsset {
  id: string;
  type: 'video' | 'image';
  url: string;
  title_ar?: string;
  title_en?: string;
}

export interface ShowroomItem {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image: string;
  section_ar: string;
  section_en: string;
  assets: ShowroomAsset[];
}

export interface Review {
  id: string;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  vehicle_type: 'truck' | 'car';
  status: 'delivering' | 'online' | 'offline';
  rating: number;
  completed_orders: number;
  location: { lat: number; lng: number };
}

export interface ShipmentStatus {
  status: 'ordered' | 'processed' | 'shipped' | 'out_for_delivery' | 'delivered';
  timestamp: string;
  location_name_ar: string;
  location_name_en: string;
  note_ar?: string;
  note_en?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  agent: DeliveryAgent;
  currentStatus: ShipmentStatus['status'];
  history: ShipmentStatus[];
  estimatedDelivery: string;
}

export interface StockMovement {
  id: string;
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  date: string;
  user: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface Promotion {
  id: number;
  title_ar: string;
  title_en: string;
  image: string;
  type: string;
  isActive: boolean;
  description_ar?: string;
  description_en?: string;
}

export type HomeSectionType = 'hero' | 'categories' | 'partners' | 'trust' | 'channels';

export interface HomeSection {
  id: string;
  type: HomeSectionType;
  title_ar: string;
  title_en: string;
  isVisible: boolean;
  order: number;
}
