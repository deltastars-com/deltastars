// src/lib/notifications.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// بيانات Firebase - ثابتة وواضحة
const firebaseConfig = {
  apiKey: "AIzaSyA_Qrx3ozyrNHrgTmcCHo_qL-vg00OjKJc",
  projectId: "deltastarsstote",
  messagingSenderId: "1017838794266",
  appId: "1:1017838794266:web:f99fa172a7de27145bc3a3",
};

const VAPID_KEY = "BKKkEQPoaH0F712vjY3HpQvov9hw8QJ12JxlOfCMgb3pxRsq6YmRY5nbUdqMJ5EFilk5FDSVDPRMX2EMQw7zHrI";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// طلب الإذن وتسجيل الجهاز
export async function requestNotificationPermission(userId) {
  if (!("Notification" in window)) {
    console.log("هذا المتصفح لا يدعم الإشعارات");
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("لم يتم منح الإذن");
    return false;
  }

  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("تم التسجيل بنجاح:", token);
    
    // حفظ في Supabase
    const { supabase } = await import("./supabaseClient");
    await supabase.from("fcm_tokens").upsert({
      user_id: userId,
      token: token,
      last_active: new Date().toISOString(),
    });
    
    return true;
  } catch (error) {
    console.error("خطأ:", error);
    return false;
  }
}

// استقبال الإشعارات أثناء فتح التطبيق
export function listenForMessages() {
  onMessage(messaging, (payload) => {
    console.log("إشعار:", payload);
    if (Notification.permission === "granted") {
      new Notification(payload.notification?.title || "إشعار", {
        body: payload.notification?.body || "",
      });
    }
  });
}
