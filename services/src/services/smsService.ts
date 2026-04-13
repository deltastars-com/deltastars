import { supabase } from '../lib/supabaseClient';

const AUTHENTICA_API_URL = 'https://api.authentica.sa/api/v2';

export const smsService = {
  async sendVerificationCode(phone: string, code: string, method: string = 'sms') {
    const { data: authKey } = await supabase
      .from('integration_keys')
      .select('api_key')
      .eq('service_name', 'authentica')
      .eq('is_active', true)
      .single();

    if (!authKey?.api_key) {
      console.log('Authentica API key not configured, using mock code:', code);
      return true;
    }

    const payload = {
      method: method,
      phone: phone.startsWith('+') ? phone : `+966${phone}`,
      otp: code,
      template_id: 31
    };

    const response = await fetch(`${AUTHENTICA_API_URL}/send-otp`, {
      method: 'POST',
      headers: {
        'X-Authorization': authKey.api_key,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.[0]?.message);
    return data.success === true;
  },

  async verifyCode(phone: string, code: string, email?: string) {
    const { data: authKey } = await supabase
      .from('integration_keys')
      .select('api_key')
      .eq('service_name', 'authentica')
      .eq('is_active', true)
      .single();

    if (!authKey?.api_key) {
      console.log('Authentica API key not configured, using mock verification');
      return code === '123456';
    }

    const payload: any = {
      otp: code,
      phone: phone.startsWith('+') ? phone : `+966${phone}`
    };
    if (email) payload.email = email;

    const response = await fetch(`${AUTHENTICA_API_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'X-Authorization': authKey.api_key,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.[0]?.message);
    return data.success === true;
  },

  async getBalance() {
    const { data: authKey } = await supabase
      .from('integration_keys')
      .select('api_key')
      .eq('service_name', 'authentica')
      .eq('is_active', true)
      .single();

    if (!authKey?.api_key) return null;

    const response = await fetch(`${AUTHENTICA_API_URL}/balance`, {
      method: 'GET',
      headers: {
        'X-Authorization': authKey.api_key,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.[0]?.message);
    return data.data?.balance;
  },

  async isNewCustomer(phone: string): Promise<boolean> {
    const { data } = await supabase.from('profiles').select('id').eq('phone', phone).maybeSingle();
    return !data;
  },

  async recordDeviceAfterPurchase(userId: string) {
    await supabase.from('profiles').update({ device_registered: true }).eq('id', userId);
  },

  async canSkipOtp(phone: string): Promise<boolean> {
    const { data } = await supabase.from('profiles').select('device_registered').eq('phone', phone).single();
    return data?.device_registered === true;
  }
};
