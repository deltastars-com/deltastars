import { supabase } from '../lib/supabaseClient';

interface Location {
  lat: number;
  lng: number;
}

interface Branch {
  id: string;
  name_ar: string;
  location: Location;
  is_active: boolean;
}

interface Driver {
  id: string;
  user_id: string;
  current_location: Location;
  current_status: 'online' | 'offline' | 'delivering';
  branch_id: string;
}

export const orderRoutingService = {
  // حساب المسافة بين نقطتين (هافرسين)
  calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // العثور على أقرب فرع لموقع العميل
  async findNearestBranch(customerLocation: Location): Promise<Branch | null> {
    const { data: branches } = await supabase
      .from('branches')
      .select('*')
      .eq('is_active', true);

    if (!branches || branches.length === 0) return null;

    let nearestBranch = null;
    let minDistance = Infinity;

    for (const branch of branches) {
      const distance = this.calculateDistance(customerLocation, branch.location);
      if (distance < minDistance) {
        minDistance = distance;
        nearestBranch = branch;
      }
    }

    return nearestBranch;
  },

  // العثور على أقرب مندوب متاح لفرع معين
  async findNearestDriver(branchId: string, customerLocation: Location): Promise<Driver | null> {
    const { data: drivers } = await supabase
      .from('drivers')
      .select('*, users(full_name, phone)')
      .eq('branch_id', branchId)
      .eq('current_status', 'online')
      .eq('is_active', true);

    if (!drivers || drivers.length === 0) return null;

    let nearestDriver = null;
    let minDistance = Infinity;

    for (const driver of drivers) {
      if (driver.current_location) {
        const distance = this.calculateDistance(driver.current_location, customerLocation);
        if (distance < minDistance) {
          minDistance = distance;
          nearestDriver = driver;
        }
      }
    }

    return nearestDriver;
  },

  // توجيه الطلب إلى الفرع والمندوب المناسبين
  async routeOrder(orderId: string, customerLocation: Location): Promise<{ branchId: string; driverId: string | null }> {
    // 1. العثور على أقرب فرع
    const nearestBranch = await this.findNearestBranch(customerLocation);
    if (!nearestBranch) {
      throw new Error('لا يوجد فرع متاح في منطقتك');
    }

    // 2. تحديث الطلب بالفرع المعين
    await supabase
      .from('orders')
      .update({ 
        branch_id: nearestBranch.id,
        order_status: 'assigned_to_branch',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    // 3. إشعار الفرع بطلب جديد
    await this.notifyBranch(nearestBranch.id, orderId);

    // 4. العثور على أقرب مندوب
    const nearestDriver = await this.findNearestDriver(nearestBranch.id, customerLocation);

    if (nearestDriver) {
      await supabase
        .from('orders')
        .update({ 
          driver_id: nearestDriver.user_id,
          order_status: 'assigned_to_driver'
        })
        .eq('id', orderId);

      await this.notifyDriver(nearestDriver.user_id, orderId);
    }

    return { branchId: nearestBranch.id, driverId: nearestDriver?.user_id || null };
  },

  // إشعار الفرع بطلب جديد
  async notifyBranch(branchId: string, orderId: string) {
    const channel = supabase.channel(`branch:${branchId}`);
    await channel.send({
      type: 'broadcast',
      event: 'new_order',
      payload: { orderId, timestamp: new Date().toISOString() }
    });

    // تسجيل الإشعار في قاعدة البيانات
    await supabase.from('notifications').insert({
      branch_id: branchId,
      type: 'new_order',
      title_ar: 'طلب جديد',
      body_ar: `تم استلام طلب جديد رقم ${orderId.slice(-8)}`,
      data: { orderId }
    });
  },

  // إشعار المندوب بطلب جديد
  async notifyDriver(driverId: string, orderId: string) {
    const channel = supabase.channel(`driver:${driverId}`);
    await channel.send({
      type: 'broadcast',
      event: 'new_assignment',
      payload: { orderId, timestamp: new Date().toISOString() }
    });

    await supabase.from('notifications').insert({
      user_id: driverId,
      type: 'new_order_assignment',
      title_ar: 'طلب توصيل جديد',
      body_ar: `تم تعيينك لتوصيل طلب رقم ${orderId.slice(-8)}`,
      data: { orderId }
    });
  },

  // تحديث موقع المندوب (يُستدعى كل 5 ثوانٍ)
  async updateDriverLocation(driverId: string, location: Location, orderId?: string) {
    await supabase
      .from('drivers')
      .update({ 
        current_location: location,
        last_location_update: new Date().toISOString(),
        current_status: orderId ? 'delivering' : 'online'
      })
      .eq('user_id', driverId);

    // إذا كان هناك طلب محدد، بث الموقع للعميل
    if (orderId) {
      const channel = supabase.channel(`order:${orderId}`);
      await channel.send({
        type: 'broadcast',
        event: 'driver_location',
        payload: { ...location, driverId, timestamp: new Date().toISOString() }
      });
    }
  },

  // تأكيد استلام الطلب من قبل العميل
  async confirmDelivery(orderId: string, driverId: string) {
    const now = new Date().toISOString();
    
    // تحديث حالة الطلب
    await supabase
      .from('orders')
      .update({ 
        order_status: 'delivered',
        delivered_at: now,
        updated_at: now
      })
      .eq('id', orderId);

    // تحديث حالة المندوب
    await supabase
      .from('drivers')
      .update({ 
        current_status: 'online',
        completed_orders: supabase.rpc('increment_completed_orders', { driver_id: driverId })
      })
      .eq('user_id', driverId);

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
                      
    // تسجيل في السجل المحاسبي
    await supabase.from('financial_ledger').insert({
      order_id: orderId,
      transaction_type: 'income',
      amount: order.total_amount,
      tax_amount: order.tax_amount,
      reference: invoiceNumber,
      description: `فاتورة طلب رقم ${orderId.slice(-8)}`
    });                                                                                                                                            
  }
};                                                                                                                                            
