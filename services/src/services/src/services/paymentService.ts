import { supabase } from '../lib/supabaseClient';

const STRIPE_API_VERSION = '2025-02-24.acacia';

export const paymentService = {
  async initiatePayment(orderId: string, amount: number, currency: string = 'sar') {
    const { data: stripeKeys } = await supabase
      .from('integration_keys')
      .select('api_key, api_secret')
      .eq('service_name', 'payment_gateway')
      .eq('is_active', true)
      .single();

    if (!stripeKeys?.api_secret) {
      console.log('Stripe secret key not configured');
      return { success: false, message: 'بوابة الدفع غير متاحة حالياً' };
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKeys.api_secret}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': currency.toLowerCase(),
        'line_items[0][price_data][product_data][name]': `طلب رقم ${orderId.slice(-8)}`,
        'line_items[0][price_data][unit_amount]': Math.round(amount * 100).toString(),
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${window.location.origin}/cart`,
        'metadata[order_id]': orderId
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message);

    await supabase.from('orders').update({ stripe_session_id: data.id }).eq('id', orderId);
    return { success: true, paymentUrl: data.url, sessionId: data.id };
  },

  async getPaymentStatus(orderId: string) {
    const { data } = await supabase.from('orders').select('payment_status, stripe_session_id').eq('id', orderId).single();
    return data;
  }
};
