
// This is a minimal Firebase Messaging Service Worker
// It allows the app to receive push notifications even when closed.

importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
  authDomain: "delta-stars-sovereign.firebaseapp.com",
  projectId: "delta-stars-sovereign",
  storageBucket: "delta-stars-sovereign.appspot.com",
  messagingSenderId: "SENDER_ID_PLACEHOLDER",
  appId: "APP_ID_PLACEHOLDER"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://lh3.googleusercontent.com/d/1-0qvsPmpVVnWdGJHrlJ4rbtecG-i5n4l'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
