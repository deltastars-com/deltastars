import { supabase } from '../lib/supabaseClient';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const notificationService = {
  async initPushNotifications() {
    if (!Capacitor.isPluginAvailable('PushNotifications')) {
      console.log('Push Notifications not available');
      return;
    }

    // طلب الإذن
    await PushNotifications.requestPermissions();
    await PushNotifications.register();

    // استقبال الإشعارات
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push registration success', token.value);
      // حفظ token في Supabase
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await supabase.from('users').update({ 
          fcm_token: token.value 
        }).eq('id', user.user.id);
      }
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push notification action performed', action);
    });
  },

  async sendOrderNotification(orderId: string, userId: string, status: string) {
    // استدعاء Edge Function لإرسال الإشعار
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL}/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, userId, status })
    });
    return response.ok;
  }
};
