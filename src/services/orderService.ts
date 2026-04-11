import { supabase } from '../lib/supabaseClient';
import { Order, OrderTracking } from '../types';

export const orderService = {
  // إنشاء طلب جديد
  async createOrder(orderData: any): Promise<{ orderId: string; trackingNumber: string }> {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        order_status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;

    // إضافة سجل تتبع أولي
    await supabase.from('order_tracking').insert({
      order_id: order.id,
      status: 'pending',
      note_ar: 'تم استلام طلبك بنجاح، جاري المعالجة'
    });

    // إشعار واتساب للعميل
    await this.sendWhatsAppNotification(order.customer_phone, 'order_received', { order_id: order.id });

    return { orderId: order.id, trackingNumber: order.tracking_number };
  },

  // تحديث حالة الطلب (مع تتبع لحظي)
  async updateOrderStatus(orderId: string, status: string, location?: { lat: number; lng: number }, note?: string) {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) throw error;

    // إضافة سجل تتبع
    await supabase.from('order_tracking').insert({
      order_id: orderId,
      status,
      location,
      note_ar: note
    });

    // إشعار واتساب حسب الحالة
    const { data: order } = await supabase.from('orders').select('customer_phone').eq('id', orderId).single();
    if (order) {
      let template = 'order_updated';
      if (status === 'shipped') template = 'order_shipped';
      if (status === 'out_for_delivery') template = 'order_out_for_delivery';
      if (status === 'delivered') template = 'order_delivered';
      await this.sendWhatsAppNotification(order.customer_phone, template, { order_id: orderId });
    }

    return true;
  },

  // تتبع الطلب (لحظي)
  async trackOrder(orderId: string): Promise<OrderTracking[]> {
    const { data, error } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  // تأكيد استلام الطلب من العميل
  async confirmDelivery(orderId: string) {
    await this.updateOrderStatus(orderId, 'delivered', undefined, 'تم تسليم الطلب بنجاح');
    
    // إنشاء فاتورة تلقائية
    await this.generateInvoice(orderId);
    
    return true;
  },

  // إنشاء فاتورة آلية بعد التسليم
  async generateInvoice(orderId: string) {
    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', orderId)
      .single();
    if (!order) return;

    const invoiceNumber = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${orderId.slice(-8)}`;
    
    await supabase.from('invoices').insert({
      invoice_number: invoiceNumber,
      order_id: orderId,
      customer_id: order.user_id,
      customer_name: order.customer_name,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      discount_amount: order.discount_amount,
      total_amount: order.total_amount,
      status: 'paid',
      payment_method: order.payment_method,
      payment_date: new Date().toISOString()
    });

    return invoiceNumber;
  },

  // إرسال إشعار واتساب
  async sendWhatsAppNotification(phone: string, template: string, variables: any) {
    const { data: whatsappKey } = await supabase
      .from('integration_keys')
      .select('api_key')
      .eq('service_name', 'whatsapp')
      .eq('is_active', true)
      .single();

    if (!whatsappKey?.api_key) {
      console.log('WhatsApp API key not configured');
      return;
    }

    // TODO: استدعاء واجهة واتساب بيزنيس API
    await supabase.from('whatsapp_notifications').insert({
      recipient_phone: phone,
      template_name: template,
      variables,
      status: 'pending'
    });
  },

  // كشف حساب يومي
  async generateDailyReport(date: string, branchId?: string) {
    let query = supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'paid')
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`);
    
    if (branchId) query = query.eq('branch_id', branchId);
    
    const { data: orders } = await query;
    
    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
    const totalTax = orders?.reduce((sum, o) => sum + o.tax_amount, 0) || 0;
    
    const paymentMethods = {
      cod: orders?.filter(o => o.payment_method === 'cod').reduce((sum, o) => sum + o.total_amount, 0) || 0,
      card: orders?.filter(o => o.payment_method === 'card').reduce((sum, o) => sum + o.total_amount, 0) || 0,
      bank: orders?.filter(o => o.payment_method === 'bank').reduce((sum, o) => sum + o.total_amount, 0) || 0
    };
    
    await supabase.from('daily_reports').upsert({
      report_date: date,
      branch_id: branchId || null,
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      total_tax: totalTax,
      payment_methods: paymentMethods,
      orders_details: orders
    });
    
    return { totalOrders, totalRevenue, totalTax, paymentMethods };
  },

  // كشف حساب شهري
  async generateMonthlyReport(year: number, month: number, branchId?: string) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    let query = supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'paid')
      .gte('created_at', `${startDate}T00:00:00`)
      .lte('created_at', `${endDate}T23:59:59`);
    
    if (branchId) query = query.eq('branch_id', branchId);
    
    const { data: orders } = await query;
    
    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
    
    // أكثر المنتجات مبيعاً
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const order of orders || []) {
      const items = order.order_items || [];
      for (const item of items) {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = { name: item.products?.name_ar, quantity: 0, revenue: 0 };
        }
        productSales[item.product_id].quantity += item.quantity;
        productSales[item.product_id].revenue += item.total_price;
      }
    }
    
    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    await supabase.from('monthly_reports').upsert({
      report_month: startDate,
      branch_id: branchId || null,
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      top_products: topProducts
    });
    
    return { totalOrders, totalRevenue, topProducts };
  }
};
