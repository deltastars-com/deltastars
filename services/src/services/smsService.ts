import { supabase } from '../lib/supabaseClient';

export const smsService = {
  // إرسال رمز التحقق عبر دالة send-otp
  async sendVerificationCode(phone: string, code: string, method: string = 'sms') {
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { 
          phone: phone.startsWith('+') ? phone : `+966${phone}`, 
          purpose: 'login', 
          method, 
          otp: code 
        }
      });

      if (error) throw new Error(error.message);
      return data?.success === true;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  },

  // التحقق من رمز التحقق عبر دالة verify-otp
  async verifyCode(phone: string, code: string) {
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          phone: phone.startsWith('+') ? phone : `+966${phone}`, 
          code, 
          purpose: 'login' 
        }
      });

      if (error) throw new Error(error.message);
      return data?.verified === true;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return false;
    }
  },

  // التحقق من رصيد خدمة Authentica
  async getBalance(): Promise<number | null> {
    try {
      const { data: authKey } = await supabase
        .from('integration_keys')
        .select('api_key')
        .eq('service_name', 'authentica')
        .eq('is_active', true)
        .single();

      if (!authKey?.api_key) return null;
      
      // يمكن إضافة استدعاء دالة حافة لجلب الرصيد الحقيقي
      return 1000; // قيمة افتراضية
    } catch (error) {
      console.error('Get balance error:', error);
      return null;
    }
  },

  // التحقق مما إذا كان العميل جديداً (لم يسجل من قبل)
  async isNewCustomer(phone: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();
      
      return !data;
    } catch (error) {
      console.error('Check new customer error:', error);
      return true;
    }
  },

  // تسجيل جهاز العميل بعد أول عملية شراء ناجحة
  async recordDeviceAfterPurchase(userId: string): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({ device_registered: true })
        .eq('id', userId);
    } catch (error) {
      console.error('Record device error:', error);
    }
  },

  // التحقق مما إذا كان العميل يمكنه تخطي إدخال OTP (لأن جهازه مسجل)
  async canSkipOtp(phone: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('device_registered')
        .eq('phone', phone)
        .single();
      
      return data?.device_registered === true;
    } catch (error) {
      return false;
    }
  }
};
