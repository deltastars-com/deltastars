// src/lib/push-notifications.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { supabase } from "./supabaseClient";

const firebaseConfig = {
  apiKey: "AIzaSyA_Qrx3ozyrNHrgTmcCHo_qL-vg00OjKJc",
  projectId: "deltastarsstote",
  messagingSenderId: "1017838794266",
  appId: "1:1017838794266:web:f99fa172a7de27145bc3a3",
};

const VAPID_KEY = "BKKkEQPoaH0F712vjY3HpQvov9hw8QJ12JxlOfCMgb3pxRsq6YmRY5nbUdqMJ5EFilk5FDSVDPRMX2EMQw7zHrI";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function registerForPush(userId) {
  if (!("Notification" in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return false;
  }

  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    await supabase.from("fcm_tokens").upsert({
      user_id: userId,
      token: token,
      device_info: { userAgent: navigator.userAgent },
      last_active: new Date().toISOString(),
    });
    
    return true;
  } catch (error) {
    return false;
  }
}

export function listenForPush() {
  onMessage(messaging, (payload) => {
    if (Notification.permission === "granted") {
      new Notification(payload.notification?.title || "إشعار", {
        body: payload.notification?.body || "",
      });
    }
  });
}
