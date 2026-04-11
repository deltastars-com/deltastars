import { supabase } from '../lib/supabaseClient';

export interface IntegrationKey {
  service_name: string;
  api_key?: string;
  api_secret?: string;
  webhook_url?: string;
  is_active: boolean;
}

export const integrationKeysService = {
  // الحصول على مفتاح ربط معين
  async getKey(serviceName: string): Promise<IntegrationKey | null> {
    const { data, error } = await supabase
      .from('integration_keys')
      .select('*')
      .eq('service_name', serviceName)
      .single();
    if (error) return null;
    return data;
  },

  // تحديث مفتاح ربط
  async updateKey(serviceName: string, keyData: Partial<IntegrationKey>): Promise<void> {
    const { error } = await supabase
      .from('integration_keys')
      .update({
        ...keyData,
        updated_at: new Date().toISOString()
      })
      .eq('service_name', serviceName);
    if (error) throw error;
  },

  // تفعيل خدمة معينة
  async activateService(serviceName: string, apiKey: string, apiSecret?: string, webhookUrl?: string): Promise<void> {
    await this.updateKey(serviceName, {
      api_key: apiKey,
      api_secret: apiSecret,
      webhook_url: webhookUrl,
      is_active: true
    });
  },

  // تعطيل خدمة
  async deactivateService(serviceName: string): Promise<void> {
    await this.updateKey(serviceName, { is_active: false });
  },

  // التحقق من صحة المفاتيح (للخدمات المختلفة)
  async validatePaymentKey(apiKey: string): Promise<boolean> {
    // TODO: استدعاء API بوابة الدفع للتحقق
    return true;
  },

  async validateSmsKey(apiKey: string): Promise<boolean> {
    // TODO: استدعاء API خدمة الرسائل للتحقق
    return true;
  },

  async validateWhatsAppKey(apiKey: string): Promise<boolean> {
    // TODO: استدعاء واجهة واتساب بيزنيس
    return true;
  },

  async validateMapsKey(apiKey: string): Promise<boolean> {
    // TODO: استدعاء Google Maps API للتحقق
    return true;
  }
};
