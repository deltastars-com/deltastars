import { supabase } from '../lib/supabaseClient';

const MOYASAR_API_URL = 'https://api.moyasar.com/v1';

export const paymentService = {
  async initiatePayment(orderId: string, amount: number, currency: string = 'SAR') {
    const { data: moyasarKeys } = await supabase
      .from('integration_keys')
      .select('api_secret')
      .eq('service_name', 'payment_gateway')
      .eq('is_active', true)
      .single();

    if (!moyasarKeys?.api_secret) {
      console.log('Moyasar secret key not configured');
      return { success: false, message: 'بوابة الدفع غير متاحة حالياً' };
    }

    const amountInHalalas = Math.round(amount * 100);
    const auth = btoa(`${moyasarKeys.api_secret}:`);

    const response = await fetch(`${MOYASAR_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInHalalas,
        currency: currency.toLowerCase(),
        description: `طلب رقم ${orderId.slice(-8)}`,
        source: { type: 'creditcard' },
        callback_url: `${window.location.origin}/payment-callback`,
        metadata: { order_id: orderId }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Payment failed');

    await supabase.from('orders').update({ payment_transaction_id: data.id }).eq('id', orderId);

    return { 
      success: true, 
      paymentUrl: data.source?.transaction_url || data.checkout_url,
      paymentId: data.id 
    };
  },

  async getPaymentStatus(paymentId: string) {
    const { data: moyasarKeys } = await supabase
      .from('integration_keys')
      .select('api_secret')
      .eq('service_name', 'payment_gateway')
      .eq('is_active', true)
      .single();

    if (!moyasarKeys?.api_secret) return null;

    const auth = btoa(`${moyasarKeys.api_secret}:`);
    const response = await fetch(`${MOYASAR_API_URL}/payments/${paymentId}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    const data = await response.json();
    return { status: data.status, paid: data.status === 'paid' };
  },

  async handleWebhook(payload: any) {
    const { id, status, metadata } = payload;
    if (status === 'paid') {
      await supabase.from('orders').update({ 
        payment_status: 'paid', 
        payment_transaction_id: id 
      }).eq('id', metadata.order_id);
      
      await supabase.from('invoices').update({ 
        status: 'paid', 
        payment_date: new Date().toISOString() 
      }).eq('order_id', metadata.order_id);
      
      return true;
    }
    return false;
  }
};
